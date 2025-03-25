import tensorflow as tf
import numpy as np
from PIL import Image, ImageDraw
import cv2
import json
from typing import List, Dict, Tuple

class DamageObjectDetector:
    def __init__(self, config=None):
        """
        YOLOv8-based object detector for damaged infrastructure assessment
        
        Args:
            config (dict): Configuration parameters
        """
        self.config = config or {
            'model_size': 'yolov8x',  # Large model for precision
            'conf_threshold': 0.6,    # Confidence cutoff
            'iou_threshold': 0.45,    # NMS threshold
            'damage_classes': {
                0: 'intact_building',
                1: 'damaged_building',
                2: 'collapsed_building',
                3: 'flooded_road',
                4: 'blocked_road',
                5: 'destroyed_infrastructure'
            },
            'damage_palette': {
                'intact': (0, 255, 0),     # Green
                'damaged': (255, 165, 0),  # Orange
                'severe': (255, 0, 0)      # Red
            }
        }
        self.model = self._load_model()
        
    def _load_model(self):
        """Load YOLOv8 model from TensorFlow Hub"""
        model_url = {
            'yolov8s': 'https://tfhub.dev/ultralytics/yolov8s/1',
            'yolov8m': 'https://tfhub.dev/ultralytics/yolov8m/1',
            'yolov8x': 'https://tfhub.dev/ultralytics/yolov8x/1'
        }.get(self.config['model_size'])
        
        if not model_url:
            raise ValueError(f"Unsupported model size: {self.config['model_size']}")
            
        return tf.saved_model.load(model_url)
    
    def detect(self, image, return_image=False) -> Dict:
        """
        Detect damaged objects in disaster imagery
        
        Args:
            image: PIL Image/np.array/file path
            return_image: Whether to return annotated image
        
        Returns:
            {
                'detections': List[dict], 
                'damage_summary': dict,
                'annotated_image': PIL.Image (optional)
            }
        """
        # Preprocess input
        img_array, original_image = self._preprocess_image(image)
        
        # Run inference
        detections = self.model(img_array)
        
        # Process results
        boxes, scores, classes = self._extract_detections(detections)
        filtered_dets = self._filter_detections(boxes, scores, classes)
        
        # Generate damage assessment
        damage_summary = self._generate_damage_summary(filtered_dets)
        
        # Prepare output
        result = {
            'detections': filtered_dets,
            'damage_summary': damage_summary
        }
        
        if return_image:
            annotated_img = self._draw_detections(original_image, filtered_dets)
            result['annotated_image'] = annotated_img
            
        return result
    
    def _preprocess_image(self, image):
        """Convert input to normalized tensor"""
        if isinstance(image, str):  # File path
            original = Image.open(image)
        elif isinstance(image, np.ndarray):
            original = Image.fromarray(image)
        else:
            original = image.copy()
            
        # Convert to RGB and resize maintaining aspect ratio
        original = original.convert('RGB')
        img_array = np.array(original)
        
        # Resize to model's expected size with letterboxing
        img_array = self._letterbox_image(img_array, new_shape=640)
        
        # Normalize and add batch dimension
        img_array = img_array / 255.0
        img_array = tf.expand_dims(img_array, axis=0)
        img_array = tf.cast(img_array, tf.float32)
        
        return img_array, original
    
    def _letterbox_image(self, img, new_shape=640):
        """Resize image with aspect ratio maintained"""
        h, w = img.shape[:2]
        scale = min(new_shape / h, new_shape / w)
        new_h, new_w = int(h * scale), int(w * scale)
        
        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        
        # Create canvas and paste resized image
        canvas = np.full((new_shape, new_shape, 3), 114, dtype=np.uint8)
        canvas[(new_shape-new_h)//2:(new_shape-new_h)//2 + new_h,
               (new_shape-new_w)//2:(new_shape-new_w)//2 + new_w] = resized
        return canvas
    
    def _extract_detections(self, detections):
        """Convert raw model output to usable format"""
        boxes = detections['detection_boxes'][0].numpy()
        scores = detections['detection_scores'][0].numpy()
        classes = detections['detection_classes'][0].numpy().astype(int)
        return boxes, scores, classes
    
    def _filter_detections(self, boxes, scores, classes):
        """Apply confidence threshold and NMS"""
        valid_indices = scores > self.config['conf_threshold']
        boxes = boxes[valid_indices]
        scores = scores[valid_indices]
        classes = classes[valid_indices]
        
        # Apply NMS
        nms_indices = tf.image.non_max_suppression(
            boxes, scores, max_output_size=100,
            iou_threshold=self.config['iou_threshold'])
        
        filtered_dets = []
        for idx in nms_indices:
            filtered_dets.append({
                'class_id': int(classes[idx]),
                'class_name': self.config['damage_classes'].get(classes[idx], 'unknown'),
                'confidence': float(scores[idx]),
                'bounding_box': boxes[idx].tolist()
            })
            
        return filtered_dets
    
    def _generate_damage_summary(self, detections):
        """Generate quantitative damage assessment"""
        summary = {
            'total_detections': len(detections),
            'damage_counts': {name: 0 for name in self.config['damage_classes'].values()},
            'damage_score': 0.0  # 0-1 severity metric
        }
        
        severity_weights = {
            'intact': 0,
            'damaged': 0.5,
            'severe': 1.0
        }
        
        total_weight = 0
        
        for det in detections:
            class_name = det['class_name']
            summary['damage_counts'][class_name] += 1
            
            # Calculate weighted damage score
            if 'intact' in class_name:
                weight = severity_weights['intact']
            elif 'damaged' in class_name:
                weight = severity_weights['damaged']
            else:
                weight = severity_weights['severe']
                
            summary['damage_score'] += weight * det['confidence']
            total_weight += weight
        
        if total_weight > 0:
            summary['damage_score'] /= total_weight
            
        return summary
    
    def _draw_detections(self, image, detections):
        """Draw bounding boxes on image with damage severity colors"""
        draw = ImageDraw.Draw(image)
        img_width, img_height = image.size
        
        for det in detections:
            ymin, xmin, ymax, xmax = det['bounding_box']
            
            # Convert normalized coordinates to pixels
            left = xmin * img_width
            top = ymin * img_height
            right = xmax * img_width
            bottom = ymax * img_height
            
            # Determine color based on damage severity
            if 'intact' in det['class_name']:
                color = self.config['damage_palette']['intact']
            elif 'damaged' in det['class_name']:
                color = self.config['damage_palette']['damaged']
            else:
                color = self.config['damage_palette']['severe']
            
            # Draw rectangle
            draw.rectangle([left, top, right, bottom], outline=color, width=3)
            
            # Draw label
            label = f"{det['class_name']} {det['confidence']:.2f}"
            draw.text((left, top - 10), label, fill=color)
            
        return image
    
    def process_batch(self, image_paths: List[str]) -> Dict:
        """
        Batch process multiple images for rapid assessment
        Args:
            image_paths: List of image paths from drone/satellite surveys
        Returns:
            Aggregated damage report across all images
        """
        batch_summary = {
            'total_images': len(image_paths),
            'aggregate_damage': {name: 0 for name in self.config['damage_classes'].values()},
            'worst_affected': None,
            'max_damage_score': 0.0
        }
        
        for path in image_paths:
            result = self.detect(path)
            batch_summary['worst_affected'] = max(
                batch_summary['worst_affected'] or 0,
                result['damage_summary']['damage_score']
            )
            
            for class_name, count in result['damage_summary']['damage_counts'].items():
                batch_summary['aggregate_damage'][class_name] += count
                
        return batch_summary
    
    def deploy_to_vertex(self, vertex_service, endpoint_name='damage-detector'):
        """
        Deploy as Vertex AI endpoint
        Args:
            vertex_service: Your VertexAIService instance
            endpoint_name: Display name in Vertex AI
        """
        # Create custom deployment image with OpenCV
        vertex_service.deploy_custom_container(
            container_uri='gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-6',
            model_path=self.model,
            display_name=endpoint_name,
            requirements=['opencv-python-headless', 'pillow']
        )