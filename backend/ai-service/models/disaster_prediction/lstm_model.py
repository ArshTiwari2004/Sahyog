import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
import numpy as np
import pandas as pd

class DisasterPredictionLSTM:
    def __init__(self, config=None):
        """
        Initialize LSTM model for disaster prediction
        
        Args:
            config (dict): Configuration parameters for the model
        """
        self.config = config or {
            'sequence_length': 24,  # 24 hour history
            'features': 5,         # temperature, humidity, rainfall, wind speed, pressure
            'hidden_units': 64,
            'dropout_rate': 0.2,
            'learning_rate': 0.001,
            'batch_size': 32,
            'epochs': 50
        }
        self.model = self._build_model()
        
    def _build_model(self):
        """Build and compile the LSTM model"""
        model = Sequential([
            LSTM(self.config['hidden_units'], 
                 return_sequences=True, 
                 input_shape=(self.config['sequence_length'], self.config['features'])),
            BatchNormalization(),
            Dropout(self.config['dropout_rate']),
            
            LSTM(self.config['hidden_units'] * 2, 
                 return_sequences=False),
            BatchNormalization(),
            Dropout(self.config['dropout_rate']),
            
            Dense(32, activation='relu'),
            Dropout(self.config['dropout_rate']),
            
            Dense(1, activation='sigmoid')  # Binary classification for disaster occurrence
        ])
        
        optimizer = tf.keras.optimizers.Adam(learning_rate=self.config['learning_rate'])
        model.compile(
            optimizer=optimizer,
            loss='binary_crossentropy',
            metrics=['accuracy', tf.keras.metrics.AUC(), tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
        )
        
        return model
    
    def train(self, X_train, y_train, X_val=None, y_val=None):
        """
        Train the model on historical data
        
        Args:
            X_train: Training features (shape: [samples, sequence_length, features])
            y_train: Training labels (shape: [samples, 1])
            X_val: Validation features
            y_val: Validation labels
        
        Returns:
            History object containing training metrics
        """
        callbacks = [
            tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
            tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
        ]
        
        validation_data = None
        if X_val is not None and y_val is not None:
            validation_data = (X_val, y_val)
            
        history = self.model.fit(
            X_train, y_train,
            batch_size=self.config['batch_size'],
            epochs=self.config['epochs'],
            validation_data=validation_data,
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def predict(self, X):
        """
        Make predictions using the trained model
        
        Args:
            X: Input features (shape: [samples, sequence_length, features])
        
        Returns:
            Predicted disaster probabilities
        """
        return self.model.predict(X)
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate model on test data
        
        Args:
            X_test: Test features
            y_test: Test labels
        
        Returns:
            Dictionary of evaluation metrics
        """
        results = self.model.evaluate(X_test, y_test, verbose=0)
        metrics = {}
        for i, metric_name in enumerate(self.model.metrics_names):
            metrics[metric_name] = results[i]
        return metrics
    
    def save(self, filepath):
        """Save model to disk"""
        self.model.save(filepath)
    
    @classmethod
    def load(cls, filepath):
        """Load model from disk"""
        instance = cls()
        instance.model = tf.keras.models.load_model(filepath)
        return instance
    
    def preprocess_data(self, data, target_column=None):
        """
        Preprocess raw data for LSTM input
        
        Args:
            data: DataFrame with time series data
            target_column: Name of the target column
            
        Returns:
            X, y processed data ready for LSTM
        """
        # Placeholder for data preprocessing logic
        # In a real implementation, this would:
        # 1. Handle missing values
        # 2. Normalize features
        # 3. Create sequences of length sequence_length
        # 4. Split into features (X) and target (y)
        
        # For demonstration, return synthetic data
        n_samples = len(data) - self.config['sequence_length']
        if n_samples <= 0:
            raise ValueError("Not enough data points to create sequences")
            
        X = np.random.random((n_samples, self.config['sequence_length'], self.config['features']))
        
        if target_column is not None:
            y = data[target_column].values[-n_samples:].reshape(-1, 1)
        else:
            y = np.random.randint(0, 2, size=(n_samples, 1))
            
        return X, y