# ai-service/models/disaster_prediction/cnn_model.py
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import numpy as np

class SatelliteImageCNN:
    def __init__(self, config=None):
        """
        CNN model for analyzing satellite imagery to detect early signs of disasters
        
        Args:
            config (dict): Configuration parameters for the model
        """
        self.config = config or {
            'input_shape': (256, 256, 3),  # Standard size for satellite images
            'conv_filters': [32, 64, 128], # Filter progression
            'dense_units': 256,            # Dense layer units
            'dropout_rate': 0.3,           # Dropout for regularization
            'learning_rate': 0.0001,       # Learning rate
            'batch_size': 16,              # Batch size
            'epochs': 30,                  # Training epochs
            'num_classes': 5               # flood, wildfire, earthquake, cyclone, normal
        }
        self.model = self._build_model()
    
    def _build_model(self):
        """Build and compile the CNN model for satellite image analysis"""
        model = Sequential()
        
        # Convolutional Base
        for i, filters in enumerate(self.config['conv_filters']):
            if i == 0:
                model.add(Conv2D(filters, (3, 3), activation='relu', 
                              padding='same', input_shape=self.config['input_shape']))
            else:
                model.add(Conv2D(filters, (3, 3), activation='relu', padding='same'))
            model.add(BatchNormalization())
            model.add(MaxPooling2D((2, 2)))
            model.add(Dropout(self.config['dropout_rate']))
        
        # Classification Head
        model.add(Flatten())
        model.add(Dense(self.config['dense_units'], activation='relu'))
        model.add(Dropout(self.config['dropout_rate']))
        model.add(Dense(self.config['num_classes'], activation='softmax'))
        
        # Compile the model
        optimizer = Adam(learning_rate=self.config['learning_rate'])
        model.compile(
            optimizer=optimizer,
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy', 
                   tf.keras.metrics.Precision(name='precision'),
                   tf.keras.metrics.Recall(name='recall')]
        )
        
        return model
    
    def train(self, X_train, y_train, X_val=None, y_val=None):
        """
        Train the CNN model on satellite imagery data
        
        Args:
            X_train: Training images (shape: [samples, height, width, channels])
            y_train: Training labels (shape: [samples])
            X_val: Validation images
            y_val: Validation labels
        
        Returns:
            History object containing training metrics
        """
        callbacks = [
            EarlyStopping(patience=8, restore_best_weights=True, monitor='val_loss'),
            ReduceLROnPlateau(factor=0.2, patience=5, min_lr=1e-6)
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
            X: Input images (shape: [samples, height, width, channels])
        
        Returns:
            Tuple of (predicted_class, confidence_score)
        """
        preds = self.model.predict(X)
        predicted_class = np.argmax(preds, axis=1)
        confidence = np.max(preds, axis=1)
        return predicted_class, confidence
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate model on test data
        
        Args:
            X_test: Test images
            y_test: Test labels
        
        Returns:
            Dictionary of evaluation metrics
        """
        results = self.model.evaluate(X_test, y_test, verbose=0)
        metrics = {
            'loss': results[0],
            'accuracy': results[1],
            'precision': results[2],
            'recall': results[3]
        }
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
    
    def preprocess_image(self, image):
        """
        Preprocess raw satellite image for model input
        Args:
            image: Raw image (PIL or numpy array)
        Returns:
            Processed image ready for prediction
        """
        # Convert to array if not already
        if not isinstance(image, np.ndarray):
            image = np.array(image)
        
        # Resize to model's expected input
        image = tf.image.resize(image, self.config['input_shape'][:2])
        
        # Normalize pixel values
        image = image / 255.0
        
        # Add batch dimension
        image = np.expand_dims(image, axis=0)
        
        return image