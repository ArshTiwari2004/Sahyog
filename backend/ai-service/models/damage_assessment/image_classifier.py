# ai-service/models/damage_assessment/image_classifier.py
import tensorflow as tf
from tensorflow.keras import layers, models, applications
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import numpy as np
from PIL import Image
import io

class DamageClassifier:
    def __init__(self, config=None):
        """
        CNN-based damage severity classifier for disaster images
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'input_shape': (512, 512, 3),  # High-res for damage details
            'num_classes': 4,              # none, mild, severe, catastrophic
            'base_model': 'EfficientNetB4',
            'dropout_rate': 0.3,
            'learning_rate': 0.0001,
            'batch_size': 16,
            'freeze_layers': 100,          # Transfer learning
            'class_weights': {0: 1, 1: 2, 2: 3, 3: 4}  # Higher weight for severe damage
        }
        self.model = self._build_model()
        self.class_names = ['none', 'mild', 'severe', 'catastrophic']
    
    def _build_model(self):
        """Build damage classification model with transfer learning"""
        # Base model (pre-trained on ImageNet)
        if self.config['base_model'] == 'EfficientNetB4':
            base = applications.EfficientNetB4(
                include_top=False,
                weights='imagenet',
                input_shape=self.config['input_shape']
            )
        else:
            raise ValueError(f"Unsupported base model: {self.config['base_model']}")

        # Freeze initial layers
        for layer in base.layers[:self.config['freeze_layers']]:
            layer.trainable = False
        
        # Custom head for damage classification
        inputs = layers.Input(shape=self.config['input_shape'])
        x = base(inputs)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(self.config['dropout_rate'])(x)
        outputs = layers.Dense(
            self.config['num_classes'], 
            activation='softmax',
            kernel_regularizer=tf.keras.regularizers.l2(0.01)
        )(x)
        
        model = models.Model(inputs, outputs)
        
        # Custom weighted loss to handle class imbalance
        def weighted_loss(y_true, y_pred):
            weights = tf.gather(
                tf.constant(list(self.config['class_weights'].values())),
                tf.cast(tf.argmax(y_true, axis=1), tf.int32)
            )
            loss = tf.keras.losses.categorical_crossentropy(y_true, y_pred)
            return tf.reduce_mean(loss * weights)
        
        model.compile(
            optimizer=Adam(learning_rate=self.config['learning_rate']),
            loss=weighted_loss,
            metrics=[
                'accuracy',
                tf.keras.metrics.Precision(name='precision'),
                tf.keras.metrics.Recall(name='recall'),
                tf.keras.metrics.AUC(name='auc')
            ]
        )
        
        return model
    
    def train(self, train_dataset, val_dataset, epochs=30):
        """
        Train the damage classifier
        Args:
            train_dataset: TF Dataset with (images, one-hot labels)
            val_dataset: Validation dataset
            epochs: Training epochs
        Returns:
            Training history
        """
        callbacks = [
            EarlyStopping(patience=5, restore_best_weights=True),
            ModelCheckpoint('damage_model_best.h5', save_best_only=True)
        ]
        
        history = self.model.fit(
            train_dataset,
            validation_data=val_dataset,
            epochs=epochs,
            batch_size=self.config['batch_size'],
            callbacks=callbacks
        )
        return history
    
    def predict_damage(self, image):
        """
        Predict damage level from image (supports multiple input formats)
        Args:
            image: Can be:
                - File path
                - PIL Image
                - numpy array
                - Bytes (from API upload)
        Returns:
            dict: {
                'class': str (none/mild/severe/catastrophic),
                'confidence': float,
                'severity_score': float (0-1)
            }
        """
        # Convert various inputs to processed tensor
        if isinstance(image, str):  # File path
            img = Image.open(image)
        elif isinstance(image, bytes):  # API upload
            img = Image.open(io.BytesIO(image))
        elif isinstance(image, np.ndarray):  # Numpy array
            img = Image.fromarray(image)
        else:  # Assume PIL Image
            img = image
        
        # Preprocess
        img = img.convert('RGB')
        img = img.resize(self.config['input_shape'][:2])
        img_array = np.array(img) / 255.0
        img_tensor = np.expand_dims(img_array, axis=0)
        
        # Predict
        preds = self.model.predict(img_tensor)[0]
        class_idx = np.argmax(preds)
        
        return {
            'class': self.class_names[class_idx],
            'confidence': float(preds[class_idx]),
            'severity_score': float(class_idx / (self.config['num_classes'] - 1))
        }
    
    def evaluate_incident(self, image):
        """
        Full damage assessment pipeline (integrates with Gemini API)
        Returns:
            dict: {
                'damage_level': {...},  # from predict_damage()
                'affected_objects': list,  # from object detector
                'gemini_analysis': dict  # from Gemini API
            }
        """
        damage = self.predict_damage(image)
        
        # Placeholder for object detection integration
        affected_objects = []  # Would come from object_detector.py
        
        return {
            'damage_level': damage,
            'affected_objects': affected_objects,
            'gemini_analysis': None  # To be filled by Gemini service
        }
    
    def save(self, path):
        """Save model in TensorFlow SavedModel format"""
        self.model.save(path, save_format='tf')
    
    @classmethod
    def load(cls, path, config=None):
        """Load saved model"""
        instance = cls(config)
        instance.model = tf.keras.models.load_model(path)
        return instance
    
    def deploy_to_vertex(self, vertex_service, model_name='damage-classifier'):
        """
        Deploy to Vertex AI endpoint
        Args:
            vertex_service: Your VertexAIService instance
            model_name: Display name in Vertex AI
        """
        # Save temporary model
        temp_path = 'vertex_temp_model'
        self.save(temp_path)
        
        # Deploy using your existing Vertex service
        vertex_service.deploy_model(
            model_path=temp_path,
            display_name=model_name,
            serving_container='us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-6:latest'
        )