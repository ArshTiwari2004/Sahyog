# ai-service/services/gcp_service.py
from google.cloud import storage, bigquery, pubsub_v1
from google.api_core.exceptions import GoogleAPIError
from typing import Union, List, Dict, Optional
import json
import logging
import os
from datetime import datetime
import tempfile
import pandas as pd
from concurrent.futures import TimeoutError

class GCPService:
    def __init__(self, config: dict = None):
        """
        Unified service for GCP integrations across the disaster management system
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'project_id': os.getenv('GCP_PROJECT_ID'),
            'region': os.getenv('GCP_REGION', 'us-central1'),
            'storage': {
                'disaster_data_bucket': os.getenv('GCS_DATA_BUCKET', 'disaster-data-bucket'),
                'model_artifacts_bucket': os.getenv('GCS_MODELS_BUCKET', 'model-artifacts-bucket')
            },
            'bigquery': {
                'dataset_id': os.getenv('BQ_DATASET', 'disaster_management'),
                'tables': {
                    'incidents': 'incident_reports',
                    'resources': 'resource_inventory',
                    'predictions': 'model_predictions'
                }
            },
            'pubsub': {
                'topics': {
                    'incident_alerts': 'projects/{project_id}/topics/incident_alerts',
                    'resource_updates': 'projects/{project_id}/topics/resource_updates'
                },
                'subscriptions': {
                    'ai_processor': 'projects/{project_id}/subscriptions/ai_processor_sub'
                }
            },
            'timeouts': {
                'storage': 60,
                'bigquery': 120,
                'pubsub': 30
            }
        }
        
        # Initialize clients
        self.storage_client = storage.Client()
        self.bq_client = bigquery.Client()
        self.publisher = pubsub_v1.PublisherClient()
        self.subscriber = pubsub_v1.SubscriberClient()
        
        # Configure logger
        self.logger = logging.getLogger('gcp_service')
        
    # ----------------------------
    # Cloud Storage Operations
    # ----------------------------
    def upload_to_bucket(self, 
                       source_file: str, 
                       destination_blob: str,
                       bucket_name: Optional[str] = None) -> str:
        """
        Upload files to GCS bucket
        Args:
            source_file: Local file path or file-like object
            destination_blob: Destination path in GCS
            bucket_name: Target bucket (defaults to data bucket)
        Returns:
            GCS URI of uploaded file
        """
        bucket = self.storage_client.bucket(
            bucket_name or self.config['storage']['disaster_data_bucket']
        )
        
        try:
            blob = bucket.blob(destination_blob)
            
            if isinstance(source_file, str):
                blob.upload_from_filename(source_file)
            else:
                blob.upload_from_file(source_file)
                
            self.logger.info(f"Uploaded {destination_blob} to {bucket.name}")
            return f"gs://{bucket.name}/{destination_blob}"
            
        except GoogleAPIError as e:
            self.logger.error(f"GCS upload failed: {str(e)}")
            raise RuntimeError(f"Failed to upload file: {str(e)}")
    
    def download_from_bucket(self, 
                           blob_name: str, 
                           destination_file: str = None,
                           bucket_name: Optional[str] = None) -> str:
        """
        Download files from GCS bucket
        Args:
            blob_name: Source path in GCS
            destination_file: Local path to save (defaults to temp file)
            bucket_name: Source bucket (defaults to data bucket)
        Returns:
            Path to downloaded file
        """
        bucket = self.storage_client.bucket(
            bucket_name or self.config['storage']['disaster_data_bucket']
        )
        
        try:
            blob = bucket.blob(blob_name)
            
            if destination_file is None:
                destination_file = os.path.join(tempfile.gettempdir(), os.path.basename(blob_name))
                
            blob.download_to_filename(destination_file)
            self.logger.info(f"Downloaded {blob_name} to {destination_file}")
            return destination_file
            
        except GoogleAPIError as e:
            self.logger.error(f"GCS download failed: {str(e)}")
            raise RuntimeError(f"Failed to download file: {str(e)}")
    
    def stream_to_bucket(self, 
                       data: Union[dict, list], 
                       destination_blob: str,
                       bucket_name: Optional[str] = None) -> str:
        """
        Stream JSON data directly to GCS
        Args:
            data: JSON-serializable data
            destination_blob: Destination path in GCS
            bucket_name: Target bucket
        Returns:
            GCS URI of uploaded data
        """
        bucket = self.storage_client.bucket(
            bucket_name or self.config['storage']['disaster_data_bucket']
        )
        
        try:
            blob = bucket.blob(destination_blob)
            
            with blob.open("w") as f:
                json.dump(data, f)
                
            self.logger.info(f"Streamed JSON to {destination_blob}")
            return f"gs://{bucket.name}/{destination_blob}"
            
        except (GoogleAPIError, TypeError) as e:
            self.logger.error(f"GCS stream failed: {str(e)}")
            raise RuntimeError(f"Failed to stream data: {str(e)}")
    
    # ----------------------------
    # BigQuery Operations
    # ----------------------------
    def query_bigquery(self, query: str) -> pd.DataFrame:
        """
        Execute BigQuery SQL query
        Args:
            query: Standard SQL query string
        Returns:
            DataFrame with results
        """
        try:
            df = self.bq_client.query(query).to_dataframe()
            self.logger.info(f"BigQuery executed: {query[:100]}...")
            return df
            
        except GoogleAPIError as e:
            self.logger.error(f"BigQuery failed: {str(e)}")
            raise RuntimeError(f"Query failed: {str(e)}")
    
    def stream_to_bigquery(self, 
                         data: List[dict], 
                         table_name: str,
                         dataset_id: Optional[str] = None) -> int:
        """
        Stream data to BigQuery table
        Args:
            data: List of dictionaries (rows)
            table_name: Target table name
            dataset_id: Dataset ID (defaults to config)
        Returns:
            Number of rows inserted
        """
        dataset_ref = self.bq_client.dataset(
            dataset_id or self.config['bigquery']['dataset_id']
        )
        table_ref = dataset_ref.table(table_name)
        
        try:
            errors = self.bq_client.insert_rows_json(table_ref, data)
            
            if errors:
                self.logger.error(f"BigQuery insert errors: {errors}")
                raise RuntimeError(f"Insert failed with errors: {errors}")
                
            self.logger.info(f"Inserted {len(data)} rows to {table_name}")
            return len(data)
            
        except GoogleAPIError as e:
            self.logger.error(f"BigQuery stream failed: {str(e)}")
            raise RuntimeError(f"Stream to BigQuery failed: {str(e)}")
    
    def create_bigquery_table(self, 
                            table_name: str,
                            schema: List[dict],
                            dataset_id: Optional[str] = None,
                            overwrite: bool = False):
        """
        Create new BigQuery table
        Args:
            table_name: Name of new table
            schema: Table schema definition
            dataset_id: Dataset ID (defaults to config)
            overwrite: Whether to replace existing table
        """
        dataset_ref = self.bq_client.dataset(
            dataset_id or self.config['bigquery']['dataset_id']
        )
        table_ref = dataset_ref.table(table_name)
        
        try:
            if overwrite and self._table_exists(table_ref):
                self.bq_client.delete_table(table_ref)
                self.logger.info(f"Deleted existing table {table_name}")
                
            table = bigquery.Table(table_ref, schema=schema)
            table = self.bq_client.create_table(table)
            self.logger.info(f"Created table {table.table_id}")
            
        except GoogleAPIError as e:
            self.logger.error(f"Table creation failed: {str(e)}")
            raise RuntimeError(f"Failed to create table: {str(e)}")
    
    def _table_exists(self, table_ref) -> bool:
        """Check if BigQuery table exists"""
        try:
            self.bq_client.get_table(table_ref)
            return True
        except GoogleAPIError:
            return False
    
    # ----------------------------
    # Pub/Sub Operations
    # ----------------------------
    def publish_message(self, 
                      topic_name: str,
                      message: dict,
                      attributes: Optional[dict] = None) -> str:
        """
        Publish message to Pub/Sub topic
        Args:
            topic_name: Target topic name (key from config)
            message: Dictionary message payload
            attributes: Optional message attributes
        Returns:
            Message ID
        """
        topic_path = self.config['pubsub']['topics'].get(topic_name, topic_name)
        topic_path = topic_path.format(project_id=self.config['project_id'])
        
        try:
            future = self.publisher.publish(
                topic_path,
                data=json.dumps(message).encode('utf-8'),
                **(attributes or {})
            )
            message_id = future.result(timeout=self.config['timeouts']['pubsub'])
            self.logger.info(f"Published message {message_id} to {topic_name}")
            return message_id
            
        except (GoogleAPIError, TimeoutError) as e:
            self.logger.error(f"Pub/Sub publish failed: {str(e)}")
            raise RuntimeError(f"Failed to publish message: {str(e)}")
    
    def subscribe_messages(self,
                         subscription_name: str,
                         callback: callable,
                         timeout: Optional[int] = None):
        """
        Subscribe to Pub/Sub messages
        Args:
            subscription_name: Subscription name (key from config)
            callback: Function to process messages (accepts message dict)
            timeout: Seconds to listen (None for continuous)
        """
        sub_path = self.config['pubsub']['subscriptions'].get(subscription_name, subscription_name)
        sub_path = sub_path.format(project_id=self.config['project_id'])
        
        def wrapped_callback(message):
            try:
                data = json.loads(message.data.decode('utf-8'))
                callback(data)
                message.ack()
            except Exception as e:
                self.logger.error(f"Message processing failed: {str(e)}")
                message.nack()
        
        try:
            streaming_pull = self.subscriber.subscribe(sub_path, wrapped_callback)
            self.logger.info(f"Listening to {subscription_name}...")
            
            if timeout:
                streaming_pull.result(timeout=timeout)
            else:
                streaming_pull.result()
                
        except (GoogleAPIError, TimeoutError) as e:
            self.logger.error(f"Pub/Sub subscription failed: {str(e)}")
            raise RuntimeError(f"Subscription failed: {str(e)}")
        finally:
            streaming_pull.cancel()
    
    # ----------------------------
    # Integrated Disaster Workflows
    # ----------------------------
    def process_incident_report(self, report: dict):
        """
        End-to-end processing for new incident reports
        Args:
            report: Incident report dictionary
        """
        try:
            # 1. Store raw report in GCS
            report_id = report.get('incident_id', datetime.now().strftime('%Y%m%d%H%M%S'))
            gcs_path = f"incidents/raw/{report_id}.json"
            self.stream_to_bucket(report, gcs_path)
            
            # 2. Publish to Pub/Sub for real-time processing
            self.publish_message('incident_alerts', {
                'type': 'new_incident',
                'report_id': report_id,
                'gcs_path': gcs_path,
                'severity': report.get('severity', 'unknown')
            })
            
            # 3. Log metadata in BigQuery
            self.stream_to_bigquery([{
                'incident_id': report_id,
                'timestamp': datetime.now().isoformat(),
                'location': json.dumps(report.get('location')),
                'reporter_id': report.get('reporter_id'),
                'severity': report.get('severity'),
                'gcs_path': gcs_path
            }], 'incident_logs')
            
            return report_id
            
        except Exception as e:
            self.logger.error(f"Incident processing failed: {str(e)}")
            raise RuntimeError(f"Failed to process incident: {str(e)}")
    
    def update_resource_inventory(self, 
                               updates: List[dict],
                               source: str = 'rfid'):
        """
        Process resource inventory updates
        Args:
            updates: List of inventory change records
            source: Source system ('rfid', 'manual', 'drone')
        """
        try:
            # 1. Store update batch in GCS
            batch_id = datetime.now().strftime('%Y%m%d%H%M%S')
            gcs_path = f"inventory/updates/{source}_{batch_id}.json"
            self.stream_to_bucket(updates, gcs_path)
            
            # 2. Update BigQuery inventory table
            self.stream_to_bigquery(updates, 'resource_inventory')
            
            # 3. Notify subsystems via Pub/Sub
            self.publish_message('resource_updates', {
                'type': 'inventory_update',
                'source': source,
                'count': len(updates),
                'gcs_path': gcs_path
            })
            
            return batch_id
            
        except Exception as e:
            self.logger.error(f"Inventory update failed: {str(e)}")
            raise RuntimeError(f"Failed to update inventory: {str(e)}")
    
    def backup_disaster_data(self, days: int = 7):
        """
        Backup recent disaster data to cold storage
        Args:
            days: Number of days to backup
        """
        try:
            # 1. Query recent data from BigQuery
            query = f"""
                SELECT * 
                FROM `{self.config['project_id']}.{self.config['bigquery']['dataset_id']}.incident_reports`
                WHERE TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), timestamp, DAY) <= {days}
            """
            df = self.query_bigquery(query)
            
            # 2. Store backup in GCS
            backup_path = f"backups/incidents/{datetime.now().strftime('%Y%m%d')}.parquet"
            with tempfile.NamedTemporaryFile() as temp:
                df.to_parquet(temp.name)
                self.upload_to_bucket(temp.name, backup_path)
                
            self.logger.info(f"Backed up {len(df)} records to {backup_path}")
            return backup_path
            
        except Exception as e:
            self.logger.error(f"Data backup failed: {str(e)}")
            raise RuntimeError(f"Backup failed: {str(e)}")

# """
# Example usage:
# gcp = GCPService()

# # Process new incident
# incident = {
#     'incident_id': 'flood_20230515_1324',
#     'location': {'lat': 12.34, 'lng': 56.78},
#     'severity': 'high',
#     'description': 'Major flooding in downtown area'
# }
# gcp.process_incident_report(incident)

# # Update inventory
# rfid_updates = [
#     {'item_id': 'med_001', 'location': 'warehouse_A', 'change': -5},
#     {'item_id': 'food_012', 'location': 'truck_03', 'change': 100}
# ]
# gcp.update_resource_inventory(rfid_updates)

# # Query historical data
# df = gcp.query_bigquery("""
#     SELECT severity, COUNT(*) as count 
#     FROM disaster_management.incident_reports 
#     GROUP BY severity
# """)
# """
