import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
from typing import Dict, List, Union
import json
from datetime import datetime
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.optimizers import Adam

class ResourcePredictor:
    def __init__(self, config=None):
        """
        Hybrid ML model for predicting disaster resource requirements
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'model_type': 'hybrid',  # 'rf' (Random Forest) or 'lstm' or 'hybrid'
            'resource_types': [
                'medical_kits',
                'food_packets',
                'tents',
                'water_containers',
                'rescue_equipment'
            ],
            'time_horizon': 7,  # Predict next 7 days
            'feature_columns': [
                'disaster_type',
                'severity',
                'population_density',
                'affected_area',
                'weather_conditions',
                'time_since_disaster'
            ],
            'lstm_units': 64,
            'rf_n_estimators': 100
        }
        self.models = self._initialize_models()
        self.scalers = {}
        self.feature_importances = {}
        
    def _initialize_models(self):
        """Initialize model architecture based on config"""
        models = {}
        
        if self.config['model_type'] in ['rf', 'hybrid']:
            for res_type in self.config['resource_types']:
                models[f'{res_type}_rf'] = RandomForestRegressor(
                    n_estimators=self.config['rf_n_estimators'],
                    random_state=42
                )
        
        if self.config['model_type'] in ['lstm', 'hybrid']:
            for res_type in self.config['resource_types']:
                models[f'{res_type}_lstm'] = self._build_lstm_model()
                
        return models
    
    def _build_lstm_model(self):
        """Build LSTM model for time-series resource prediction"""
        model = Sequential([
            LSTM(self.config['lstm_units'], 
                input_shape=(self.config['time_horizon'], len(self.config['feature_columns']))),
            Dense(32, activation='relu'),
            Dense(1)
        ])
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        return model
    
    def preprocess_data(self, historical_data: pd.DataFrame):
        """
        Prepare data for training
        Args:
            historical_data: DataFrame with columns matching feature_columns + resource_types
        Returns:
            Processed features and targets
        """
        # Convert categorical features
        data = pd.get_dummies(historical_data, columns=['disaster_type', 'weather_conditions'])
        
        # Normalize numerical features
        for col in ['severity', 'population_density', 'affected_area', 'time_since_disaster']:
            if col in data.columns:
                data[col] = (data[col] - data[col].mean()) / data[col].std()
        
        # Create time-series sequences for LSTM
        if self.config['model_type'] in ['lstm', 'hybrid']:
            X_seq, y_seq = self._create_sequences(data)
        
        # Prepare tabular data for Random Forest
        X_rf = data[self.config['feature_columns']]
        y_rf = data[self.config['resource_types']]
        
        return {
            'X_rf': X_rf,
            'y_rf': y_rf,
            'X_seq': X_seq if 'X_seq' in locals() else None,
            'y_seq': y_seq if 'y_seq' in locals() else None
        }
    
    def _create_sequences(self, data):
        """Create time-series sequences for LSTM"""
        X, y = [], []
        for i in range(len(data) - self.config['time_horizon']):
            X.append(data.iloc[i:i+self.config['time_horizon']][self.config['feature_columns']].values)
            y.append(data.iloc[i+self.config['time_horizon']][self.config['resource_types']].values)
        return np.array(X), np.array(y)
    
    def train(self, historical_data: pd.DataFrame):
        """
        Train the predictive models
        Args:
            historical_data: DataFrame containing historical disaster records
        """
        processed = self.preprocess_data(historical_data)
        
        # Train Random Forest models
        if self.config['model_type'] in ['rf', 'hybrid']:
            for i, res_type in enumerate(self.config['resource_types']):
                X_train, X_test, y_train, y_test = train_test_split(
                    processed['X_rf'],
                    processed['y_rf'][res_type],
                    test_size=0.2
                )
                self.models[f'{res_type}_rf'].fit(X_train, y_train)
                
                # Store feature importances
                self.feature_importances[res_type] = dict(zip(
                    self.config['feature_columns'],
                    self.models[f'{res_type}_rf'].feature_importances_
                ))
                
                # Evaluate
                preds = self.models[f'{res_type}_rf'].predict(X_test)
                print(f"{res_type} RF - MAE: {mean_absolute_error(y_test, preds):.2f}")
        
        # Train LSTM models
        if self.config['model_type'] in ['lstm', 'hybrid'] and processed['X_seq'] is not None:
            for i, res_type in enumerate(self.config['resource_types']):
                X_train, X_test, y_train, y_test = train_test_split(
                    processed['X_seq'],
                    processed['y_seq'][:, i],
                    test_size=0.2
                )
                self.models[f'{res_type}_lstm'].fit(
                    X_train, y_train,
                    validation_data=(X_test, y_test),
                    epochs=50,
                    batch_size=32,
                    verbose=1
                )
    
    def predict(self, current_conditions: Dict, days_ahead: int = 7) -> Dict:
        """
        Predict resource needs based on current situation
        Args:
            current_conditions: Dictionary of current disaster features
            days_ahead: Prediction horizon (1-7 days)
        Returns:
            Dictionary of resource predictions with confidence intervals
        """
        # Prepare input data
        input_df = self._prepare_prediction_input(current_conditions, days_ahead)
        predictions = {}
        
        for res_type in self.config['resource_types']:
            # RF prediction
            rf_pred = self.models[f'{res_type}_rf'].predict(input_df)[0]
            
            # LSTM prediction if hybrid
            if self.config['model_type'] == 'hybrid':
                lstm_pred = self.models[f'{res_type}_lstm'].predict(
                    input_df.values.reshape(1, days_ahead, -1)
                )[0][0]
                predictions[res_type] = (rf_pred + lstm_pred) / 2  # Average both predictions
            else:
                predictions[res_type] = rf_pred
                
        return {
            'predictions': predictions,
            'feature_importances': self.feature_importances,
            'timestamp': datetime.now().isoformat()
        }
    
    def _prepare_prediction_input(self, conditions: Dict, days: int) -> pd.DataFrame:
        """Create input DataFrame for prediction"""
        # Create sequence of future days
        future_days = []
        for day in range(days):
            day_conditions = conditions.copy()
            day_conditions['time_since_disaster'] = day
            future_days.append(day_conditions)
        
        return pd.DataFrame(future_days)
    
    def optimize_allocation(self, predictions: Dict, inventory: Dict) -> Dict:
        """
        Generate optimal resource allocation plan
        Args:
            predictions: Output from predict() method
            inventory: Current resource inventory
        Returns:
            Allocation plan with priority scores
        """
        allocation = {}
        total_priority = 0
        
        for res_type, pred_amount in predictions['predictions'].items():
            deficit = max(0, pred_amount - inventory.get(res_type, 0))
            priority = 1.0  # Base priority
            
            # Increase priority for medical and rescue resources
            if res_type in ['medical_kits', 'rescue_equipment']:
                priority *= 1.5
                
            allocation[res_type] = {
                'predicted_need': round(pred_amount, 2),
                'current_inventory': inventory.get(res_type, 0),
                'deficit': round(deficit, 2),
                'priority_score': round(priority * deficit, 2),
                'allocation_plan': self._generate_supply_plan(res_type, deficit)
            }
            total_priority += allocation[res_type]['priority_score']
        
        # Normalize priority scores (0-100)
        for res_type in allocation:
            allocation[res_type]['priority_score'] = round(
                (allocation[res_type]['priority_score'] / total_priority) * 100, 2
            ) if total_priority > 0 else 0
            
        return allocation
    
    def _generate_supply_plan(self, resource_type: str, deficit: float) -> List[Dict]:
        """Generate detailed supply plan for a resource"""
        # Mock supply chain logic - would integrate with your RFID tracking
        if deficit <= 0:
            return []
            
        plans = {
            'medical_kits': [
                {'source': 'central_warehouse', 'quantity': min(100, deficit)},
                {'source': 'local_hospitals', 'quantity': max(0, deficit - 100)}
            ],
            'food_packets': [
                {'source': 'regional_storage', 'quantity': deficit}
            ],
            # ... other resource plans
        }
        return plans.get(resource_type, [])
    
    def save_models(self, directory: str):
        """Save all models to disk"""
        for name, model in self.models.items():
            if 'lstm' in name:
                model.save(f"{directory}/{name}.h5")
            else:
                joblib.dump(model, f"{directory}/{name}.joblib")
        
        # Save configuration
        with open(f"{directory}/config.json", 'w') as f:
            json.dump(self.config, f)
    
    @classmethod
    def load_models(cls, directory: str):
        """Load saved models from disk"""
        with open(f"{directory}/config.json", 'r') as f:
            config = json.load(f)
            
        instance = cls(config)
        
        for name in instance.models.keys():
            if 'lstm' in name:
                instance.models[name] = tf.keras.models.load_model(f"{directory}/{name}.h5")
            else:
                instance.models[name] = joblib.load(f"{directory}/{name}.joblib")
                
        return instance
    
    def deploy_to_vertex(self, vertex_service, endpoint_name='resource-predictor'):
        """
        Deploy as Vertex AI endpoint
        Args:
            vertex_service: Your VertexAIService instance
            endpoint_name: Display name in Vertex AI
        """
        # Package custom prediction container
        vertex_service.deploy_custom_container(
            container_uri='gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-6',
            model_path=self.save_models('vertex_temp'),
            display_name=endpoint_name,
            requirements=['scikit-learn', 'pandas', 'numpy']
        )