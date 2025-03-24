import tensorflow as tf
from tensorflow.keras import layers, Model
import numpy as np

class DisasterGAN:
    def __init__(self, config=None):
        """
        GAN model for generating synthetic disaster scenarios
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'latent_dim': 100,
            'img_shape': (256, 256, 3),
            'disaster_classes': 5,
            'g_lr': 0.0002,
            'd_lr': 0.0002,
            'batch_size': 32
        }
        self.generator = self._build_generator()
        self.discriminator = self._build_discriminator()
        self.gan = self._build_gan()
        
    def _build_generator(self):
        """Build generator that creates synthetic disaster images"""
        noise = layers.Input(shape=(self.config['latent_dim'],))
        label = layers.Input(shape=(1,), dtype='int32')
        
        # Embed label and multiply with noise
        lbl = layers.Embedding(self.config['disaster_classes'], 
                             self.config['latent_dim'])(label)
        lbl = layers.Flatten()(lbl)
        combined = layers.multiply([noise, lbl])
        
        # Generator architecture
        x = layers.Dense(128 * 64 * 64)(combined)
        x = layers.Reshape((64, 64, 128))(x)
        x = layers.Conv2DTranspose(128, 4, strides=2, padding='same')(x)
        x = layers.BatchNormalization()(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Conv2DTranspose(64, 4, strides=2, padding='same')(x)
        x = layers.BatchNormalization()(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Conv2D(3, 7, padding='same', activation='tanh')(x)
        
        return Model([noise, label], x, name='generator')
    
    def _build_discriminator(self):
        """Build discriminator to evaluate image authenticity"""
        img = layers.Input(shape=self.config['img_shape'])
        label = layers.Input(shape=(1,), dtype='int32')
        
        # Image processing
        x = layers.Conv2D(64, 3, strides=2, padding='same')(img)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Dropout(0.3)(x)
        x = layers.Conv2D(128, 3, strides=2, padding='same')(x)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Dropout(0.3)(x)
        x = layers.Flatten()(x)
        
        # Label processing
        lbl = layers.Embedding(self.config['disaster_classes'], 
                             50)(label)
        lbl = layers.Flatten()(lbl)
        lbl = layers.Dense(512)(lbl)
        
        # Combined processing
        combined = layers.concatenate([x, lbl])
        x = layers.Dense(1024)(combined)
        x = layers.LeakyReLU(0.2)(x)
        x = layers.Dropout(0.3)(x)
        validity = layers.Dense(1, activation='sigmoid')(x)
        
        return Model([img, label], validity, name='discriminator')
    
    def _build_gan(self):
        """Combine generator and discriminator"""
        self.discriminator.compile(
            optimizer=tf.keras.optimizers.Adam(self.config['d_lr']),
            loss='binary_crossentropy',
            metrics=['accuracy'])
        
        noise = layers.Input(shape=(self.config['latent_dim'],))
        label = layers.Input(shape=(1,), dtype='int32')
        img = self.generator([noise, label])
        self.discriminator.trainable = False
        validity = self.discriminator([img, label])
        
        gan = Model([noise, label], validity)
        gan.compile(
            optimizer=tf.keras.optimizers.Adam(self.config['g_lr']),
            loss='binary_crossentropy')
        return gan
    
    def train(self, X_train, y_train, epochs, batch_size=32):
        """Train the GAN"""
        valid = np.ones((batch_size, 1))
        fake = np.zeros((batch_size, 1))
        
        for epoch in range(epochs):
            # Train discriminator
            idx = np.random.randint(0, X_train.shape[0], batch_size)
            real_imgs, labels = X_train[idx], y_train[idx]
            noise = np.random.normal(0, 1, (batch_size, self.config['latent_dim']))
            gen_imgs = self.generator.predict([noise, labels])
            
            d_loss_real = self.discriminator.train_on_batch([real_imgs, labels], valid)
            d_loss_fake = self.discriminator.train_on_batch([gen_imgs, labels], fake)
            d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)
            
            # Train generator
            noise = np.random.normal(0, 1, (batch_size, self.config['latent_dim']))
            sampled_labels = np.random.randint(0, self.config['disaster_classes'], batch_size)
            g_loss = self.gan.train_on_batch([noise, sampled_labels], valid)
            
            if epoch % 100 == 0:
                print(f"Epoch {epoch} [D loss: {d_loss[0]} | D acc: {100*d_loss[1]}] [G loss: {g_loss}]")
    
    def generate_samples(self, num_samples, label):
        """Generate synthetic disaster images"""
        noise = np.random.normal(0, 1, (num_samples, self.config['latent_dim']))
        labels = np.full((num_samples, 1), label)
        generated = self.generator.predict([noise, labels])
        return generated

    def preprocess_for_training(self, real_images, labels):
        """
        Prepare real disaster images for GAN training
        Args:
            real_images: Raw satellite/drone images from your Kafka stream
            labels: Corresponding disaster class labels
        Returns:
            Normalized and reshaped images ready for training
        """
        # Normalize to [-1, 1] range (GAN standard)
        processed = (real_images.astype('float32') - 127.5) / 127.5
        # Resize to match GAN's expected input shape
        processed = tf.image.resize(processed, self.config['img_shape'][:2])
        return processed, labels

    def augment_dataset(self, X_train, y_train, samples_per_class=1000):
        """
        Generate synthetic samples to balance dataset
        Args:
            X_train: Existing training images
            y_train: Corresponding labels
            samples_per_class: Target samples per disaster class
        Returns:
            Augmented dataset with synthetic samples
        """
        class_counts = np.bincount(y_train)
        augmented_images, augmented_labels = [], []
        
        for class_id in range(self.config['disaster_classes']):
            deficit = samples_per_class - class_counts[class_id]
            if deficit > 0:
                synthetic = self.generate_samples(deficit, class_id)
                augmented_images.extend(synthetic)
                augmented_labels.extend([class_id]*deficit)
        
        return (
            np.concatenate([X_train, augmented_images]),
            np.concatenate([y_train, augmented_labels])
        )

    def deploy_to_vertex(self, vertex_service, region='us-central1'):
        """
        Package and deploy the generator to Vertex AI
        Args:
            vertex_service: Your VertexAIService instance
            region: GCP deployment region
        """
        # Save generator in SavedModel format
        temp_path = 'gan_generator_temp'
        tf.saved_model.save(self.generator, temp_path)
        
        # Deploy using your Vertex AI service
        vertex_service.deploy_model(
            model_path=temp_path,
            display_name='disaster-gan-generator',
            serving_container='us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-6:latest',
            region=region
        )