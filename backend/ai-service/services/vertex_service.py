from google.cloud import aiplatform
from typing import Dict, List, Union, Optional
import json
import logging
import numpy as np
from datetime import datetime
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
import os

class VertexAIService:
    def __init__(self, config: dict = None):
        """
        Service for managing Vertex AI integration
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'project_id': os.getenv('GCP_PROJECT_ID'),
            'location': os.getenv('GCP_REGION', 'us-central1'),
            'staging_bucket': os.getenv('GCP_STAGING_BUCKET'),
            'service_account': os.getenv('GCP_SERVICE_ACCOUNT'),
            'docker_image': {
                'tf_cpu': 'us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-6:latest',
                'tf_gpu': 'us-docker.pkg.dev/vertex-ai/prediction/tf2-gpu.2-6:latest',
                'sklearn': 'us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest'
            },
            'machine_types': {
                'small': 'n1-standard-4',
                'medium': 'n1-standard-8',
                'large': 'n1-standard-16'
            }
        }
        
        # Initialize Vertex AI SDK
        aiplatform.init(
            project=self.config['project_id'],
            location=self.config['location'],
            staging_bucket=self.config['staging_bucket']
        )
        
        self.logger = logging.getLogger('vertex_service')
        self.active_models = {}
        
    def train_model(self,
                   dataset_path: str,
                   model_type: str,
                   custom_job_config: Optional[Dict] = None) -> str:
        """
        Train a new model on Vertex AI
        Args:
            dataset_path: GCS path to training data
            model_type: Type of model ('tf', 'sklearn', 'custom')
            custom_job_config: Custom training job parameters
        Returns:
            Model resource name
        """
        job_config = custom_job_config or {
            'display_name': f'{model_type}_training_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
            'machine_type': self.config['machine_types']['medium'],
            'accelerator_type': 'NVIDIA_TESLA_T4' if model_type == 'tf' else None,
            'accelerator_count': 1,
            'worker_count': 1
        }
        
        try:
            # Create custom training job
            job = aiplatform.CustomTrainingJob(
                display_name=job_config['display_name'],
                script_path=f"gs://{self.config['staging_bucket']}/training_scripts/{model_type}_train.py",
                container_uri=self._get_container_uri(model_type),
                requirements=['tensorflow==2.6.0', 'scikit-learn==1.0.0'],
                model_serving_container_image_uri=self._get_container_uri(model_type)
            )
            
            # Run training
            model = job.run(
                dataset=aiplatform.TabularDataset(dataset_path),
                model_display_name=job_config['display_name'],
                machine_type=job_config['machine_type'],
                accelerator_type=job_config['accelerator_type'],
                accelerator_count=job_config['accelerator_count'],
                args=[
                    f"--epochs={job_config.get('epochs', 50)}",
                    f"--batch_size={job_config.get('batch_size', 32)}"
                ]
            )
            
            self.active_models[model.resource_name] = {
                'type': model_type,
                'deployed': False
            }
            
            return model.resource_name
            
        except Exception as e:
            self.logger.error(f"Training failed: {str(e)}")
            raise RuntimeError(f"Model training failed: {str(e)}")
    
    def deploy_model(self,
                    model_path: Union[str, 'tf.keras.Model'],
                    display_name: str,
                    serving_container: Optional[str] = None,
                    region: Optional[str] = None,
                    min_replicas: int = 1,
                    max_replicas: int = 3) -> Dict:
        """
        Deploy a model to Vertex AI endpoint
        Args:
            model_path: Local path or GCS path to saved model
            display_name: Name for the deployed model
            serving_container: Container image URI
            region: Deployment region
            min_replicas: Minimum number of replicas
            max_replicas: Maximum number of replicas
        Returns:
            Deployment information
        """
        try:
            # Upload model if local path
            if isinstance(model_path, str) and not model_path.startswith('gs://'):
                model = aiplatform.Model.upload(
                    display_name=display_name,
                    artifact_uri=model_path,
                    serving_container_image_uri=serving_container or 
                                              self.config['docker_image']['tf_cpu']
                )
            else:
                # For already uploaded models
                model = aiplatform.Model(model_path)
            
            # Create endpoint if needed
            endpoint = aiplatform.Endpoint.create(
                display_name=f"{display_name}_endpoint",
                project=self.config['project_id'],
                location=region or self.config['location']
            )
            
            # Deploy model with auto-scaling
            deployed_model = endpoint.deploy(
                model=model,
                deployed_model_display_name=display_name,
                min_replica_count=min_replicas,
                max_replica_count=max_replicas,
                traffic_percentage=100,
                machine_type=self.config['machine_types']['medium'],
                accelerator_type=None
            )
            
            # Update active models
            self.active_models[model.resource_name] = {
                'type': 'deployed',
                'endpoint': endpoint.resource_name,
                'deployed_at': datetime.now().isoformat()
            }
            
            return {
                'model_name': model.resource_name,
                'endpoint_id': endpoint.resource_name,
                'deployed_model_id': deployed_model.id,
                'api_endpoint': endpoint.resource_name
            }
            
        except Exception as e:
            self.logger.error(f"Deployment failed: {str(e)}")
            raise RuntimeError(f"Model deployment failed: {str(e)}")
    
    def predict(self,
               endpoint_id: str,
               instances: Union[List, Dict],
               model_type: str = 'tf') -> Dict:
        """
        Make predictions using deployed model
        Args:
            endpoint_id: Endpoint resource name
            instances: Input data for prediction
            model_type: Type of model ('tf', 'sklearn', 'custom')
        Returns:
            Prediction results
        """
        endpoint = aiplatform.Endpoint(endpoint_id)
        
        try:
            if model_type == 'tf':
                # TensorFlow model expects specific format
                instances = self._prepare_tf_input(instances)
            elif model_type == 'sklearn':
                # Scikit-learn expects 2D array
                instances = np.array(instances).tolist()
            
            response = endpoint.predict(instances=instances)
            return self._parse_prediction(response)
            
        except Exception as e:
            self.logger.error(f"Prediction failed: {str(e)}")
            raise RuntimeError(f"Prediction failed: {str(e)}")
    
    def deploy_custom_container(self,
                              container_uri: str,
                              model_path: str,
                              display_name: str,
                              requirements: Optional[List[str]] = None,
                              port: int = 8080) -> Dict:
        """
        Deploy custom container model
        Args:
            container_uri: Docker container URI
            model_path: GCS path to model artifacts
            display_name: Deployment name
            requirements: Python dependencies
            port: Container port
        Returns:
            Deployment information
        """
        try:
            # Create model resource
            model = aiplatform.Model.upload(
                display_name=display_name,
                artifact_uri=model_path,
                serving_container_image_uri=container_uri,
                serving_container_predict_route=f"/predict",
                serving_container_health_route=f"/health",
                serving_container_ports=[port],
                serving_container_environment_variables={
                    'MODEL_NAME': display_name
                }
            )
            
            # Create endpoint
            endpoint = aiplatform.Endpoint.create(
                display_name=f"{display_name}_endpoint"
            )
            
            # Deploy with custom configuration
            deployed_model = endpoint.deploy(
                model=model,
                deployed_model_display_name=display_name,
                traffic_percentage=100,
                machine_type=self.config['machine_types']['medium'],
                min_replica_count=1,
                max_replica_count=3
            )
            
            return {
                'model_name': model.resource_name,
                'endpoint_id': endpoint.resource_name,
                'api_endpoint': endpoint.resource_name
            }
            
        except Exception as e:
            self.logger.error(f"Custom deployment failed: {str(e)}")
            raise RuntimeError(f"Custom container deployment failed: {str(e)}")
    
    def batch_predict(self,
                     model_name: str,
                     input_path: str,
                     output_path: str,
                     machine_type: str = 'n1-standard-4') -> Dict:
        """
        Run batch predictions on Vertex AI
        Args:
            model_name: Model resource name
            input_path: GCS path to input data
            output_path: GCS path for results
            machine_type: Compute machine type
        Returns:
            Batch job information
        """
        try:
            model = aiplatform.Model(model_name)
            
            batch_job = model.batch_predict(
                job_display_name=f"batch_pred_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                gcs_source=input_path,
                gcs_destination_prefix=output_path,
                machine_type=machine_type,
                starting_replica_count=1,
                max_replica_count=5
            )
            
            return {
                'job_name': batch_job.display_name,
                'resource_name': batch_job.resource_name,
                'state': str(batch_job.state)
            }
            
        except Exception as e:
            self.logger.error(f"Batch predict failed: {str(e)}")
            raise RuntimeError(f"Batch prediction failed: {str(e)}")
    
    def _prepare_tf_input(self, instances: Union[List, Dict]) -> List:
        """Convert input to TensorFlow serving format"""
        if isinstance(instances, dict):
            # Convert dict to list of dicts
            return [{k: [v] for k, v in instances.items()}]
        elif isinstance(instances, list) and isinstance(instances[0], dict):
            # Already in correct format
            return instances
        else:
            # Assume array input
            return [{'input': instances}]
    
    def _parse_prediction(self, response) -> Dict:
        """Parse Vertex AI prediction response"""
        try:
            if hasattr(response, 'predictions'):
                return {'predictions': response.predictions}
            elif hasattr(response, 'outputs'):
                return {k: v for k, v in zip(response.output_names, response.outputs)}
            else:
                return {'result': str(response)}
        except Exception as e:
            self.logger.error(f"Response parsing failed: {str(e)}")
            return {'error': 'Failed to parse prediction response'}
    
    def _get_container_uri(self, model_type: str) -> str:
        """Get appropriate container URI for model type"""
        if model_type == 'tf':
            return self.config['docker_image']['tf_cpu']
        elif model_type == 'sklearn':
            return self.config['docker_image']['sklearn']
        else:
            return self.config['docker_image']['tf_cpu']
    
    def get_model_info(self, model_name: str) -> Dict:
        """Get details about a deployed model"""
        try:
            model = aiplatform.Model(model_name)
            return {
                'name': model.display_name,
                'resource_name': model.resource_name,
                'created_at': model.create_time.strftime('%Y-%m-%d %H:%M:%S'),
                'labels': model.labels,
                'uri': model.uri
            }
        except Exception as e:
            self.logger.error(f"Failed to get model info: {str(e)}")
            return {'error': str(e)}
    
    def cleanup_resources(self, older_than_days: int = 30):
        """Clean up old models and endpoints"""
        cutoff = datetime.now() - timedelta(days=older_than_days)
        
        # Clean models
        for model in aiplatform.Model.list():
            if model.create_time < cutoff:
                try:
                    model.delete()
                    self.logger.info(f"Deleted model {model.display_name}")
                except Exception as e:
                    self.logger.error(f"Failed to delete model {model.display_name}: {str(e)}")
        
        # Clean endpoints
        for endpoint in aiplatform.Endpoint.list():
            if endpoint.create_time < cutoff:
                try:
                    endpoint.delete()
                    self.logger.info(f"Deleted endpoint {endpoint.display_name}")
                except Exception as e:
                    self.logger.error(f"Failed to delete endpoint {endpoint.display_name}: {str(e)}")

# Example usage:
"""
vertex = VertexAIService()

# Train and deploy a model
model_path = vertex.train_model(
    dataset_path="gs://your-bucket/disaster_data.csv",
    model_type="tf"
)

deployment = vertex.deploy_model(
    model_path=model_path,
    display_name="disaster-predictor",
    min_replicas=1,
    max_replicas=3
)

# Make predictions
predictions = vertex.predict(
    endpoint_id=deployment['endpoint_id'],
    instances=[{"feature1": 0.5, "feature2": 1.2}],
    model_type="tf"
)
"""