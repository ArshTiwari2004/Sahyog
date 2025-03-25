import google.generativeai as genai
from typing import Union, Dict, List, Optional
import base64
import json
from datetime import datetime
import requests
from PIL import Image
import io
import logging

class GeminiService:
    def __init__(self, api_key: str = None, config: dict = None):
        """
        Multimodal AI service for disaster analysis using Gemini API
        
        Args:
            api_key: Your Gemini API key (will be loaded from env vars in production)
            config: Service configuration
        """
        self.config = config or {
            'safety_settings': {
                'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
                'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
                'HARM_CATEGORY_DANGEROUS': 'BLOCK_NONE'
            },
            'generation_config': {
                'temperature': 0.4,
                'top_p': 0.95,
                'top_k': 32,
                'max_output_tokens': 2048
            },
            'timeout': 60  # seconds
        }
        
        # Configure API (your key will be secured via GCP Secret Manager in production)
        self.api_key = api_key or "AIzaSyDijxDAdeA9DdQ4P4w5_e7woTvJHzYqAgI" 
        genai.configure(api_key=self.api_key)
        
        # Initialize models
        self.text_model = genai.GenerativeModel('gemini-pro')
        self.vision_model = genai.GenerativeModel('gemini-pro-vision')
        self.multimodal_model = genai.GenerativeModel('gemini-1.5-pro-latest')
        
        # Initialize logger
        self.logger = logging.getLogger('gemini_service')
        
    def analyze_text_report(self, text: str, language: str = 'en') -> Dict:
        """
        Process textual disaster reports from citizens
        Args:
            text: Raw report text
            language: Language code (for translation)
        Returns:
            {
                'summary': str,
                'severity_score': float (0-1),
                'entities': List[str],
                'translation': Dict (if language != 'en')
            }
        """
        prompt = f"""
        Analyze this disaster report and extract:
        1. 50-word summary
        2. Severity score (0-1)
        3. Key entities (people, locations, resources)
        Text: {text}
        
        Return JSON format only: {{"summary": "", "severity_score": 0.0, "entities": []}}
        """
        
        try:
            response = self.text_model.generate_content(
                prompt,
                generation_config=self.config['generation_config'],
                safety_settings=self.config['safety_settings']
            )
            
            result = self._parse_gemini_response(response)
            
            # Add translation if needed
            if language != 'en':
                result['translation'] = self._translate_text(text, target_lang='en')
                
            return result
            
        except Exception as e:
            self.logger.error(f"Text analysis failed: {str(e)}")
            return {
                'summary': 'Analysis failed',
                'severity_score': 0.5,
                'entities': []
            }
    
    def analyze_image(self, image: Union[str, bytes, Image.Image]) -> Dict:
        """
        Assess damage from disaster images
        Args:
            image: Path, bytes, or PIL Image
        Returns:
            {
                'damage_level': str (low/medium/high),
                'damage_types': List[str],
                'affected_objects': List[str],
                'confidence': float (0-1)
            }
        """
        # Convert image to PIL format
        img = self._load_image(image)
        
        prompt = """
        Analyze this disaster image and provide:
        1. Damage level (low/medium/high)
        2. List of visible damage types (flooding/collapse/fire etc.)
        3. List of affected objects (buildings/roads/vehicles etc.)
        4. Confidence score (0-1)
        
        Return JSON format only: {
            "damage_level": "",
            "damage_types": [],
            "affected_objects": [],
            "confidence": 0.0
        }
        """
        
        try:
            response = self.vision_model.generate_content(
                [prompt, img],
                generation_config=self.config['generation_config'],
                safety_settings=self.config['safety_settings']
            )
            return self._parse_gemini_response(response)
            
        except Exception as e:
            self.logger.error(f"Image analysis failed: {str(e)}")
            return {
                'damage_level': 'unknown',
                'damage_types': [],
                'affected_objects': [],
                'confidence': 0.0
            }
    
    def generate_incident_report(self, 
                              text: Optional[str] = None, 
                              images: Optional[List] = None,
                              sensor_data: Optional[Dict] = None) -> Dict:
        """
        Generate comprehensive disaster report combining multiple inputs
        Args:
            text: Citizen report text
            images: List of image paths/bytes/PIL Images
            sensor_data: Dictionary of sensor readings
        Returns:
            Complete incident report with analysis
        """
        parts = []
        
        # Add text prompt if available
        if text:
            parts.append(f"Citizen report: {text}")
        
        # Add images if available
        if images:
            img_parts = [self._load_image(img) for img in images]
            parts.extend(img_parts)
        
        # Add sensor data if available
        if sensor_data:
            parts.append(f"Sensor data: {json.dumps(sensor_data)}")
        
        prompt = """
        Create a professional disaster incident report with:
        1. Situation summary
        2. Damage assessment
        3. Recommended actions
        4. Priority level (1-5)
        
        Use markdown formatting with headings. Be concise but thorough.
        """
        
        try:
            response = self.multimodal_model.generate_content(
                [prompt] + parts,
                generation_config=self.config['generation_config'],
                safety_settings=self.config['safety_settings']
            )
            
            return {
                'report': response.text,
                'timestamp': datetime.now().isoformat(),
                'components_analyzed': {
                    'text': text is not None,
                    'images': len(images) if images else 0,
                    'sensors': bool(sensor_data)
                }
            }
            
        except Exception as e:
            self.logger.error(f"Incident report generation failed: {str(e)}")
            return {
                'report': 'Report generation failed',
                'timestamp': datetime.now().isoformat()
            }
    
    def generate_resource_instructions(self, 
                                    resource_type: str,
                                    quantity: int,
                                    context: Dict) -> str:
        """
        Generate step-by-step instructions for resource deployment
        Args:
            resource_type: Type of resource being deployed
            quantity: Amount to deploy
            context: Additional context about the situation
        Returns:
            Detailed deployment instructions
        """
        prompt = f"""
        Generate step-by-step instructions for deploying {quantity} units of {resource_type} 
        in a disaster scenario with these characteristics:
        {json.dumps(context, indent=2)}
        
        Include:
        1. Safety precautions
        2. Required personnel
        3. Estimated time
        4. Special considerations
        
        Use numbered steps and markdown formatting.
        """
        
        try:
            response = self.text_model.generate_content(
                prompt,
                generation_config=self.config['generation_config'],
                safety_settings=self.config['safety_settings']
            )
            return response.text
            
        except Exception as e:
            self.logger.error(f"Instruction generation failed: {str(e)}")
            return "Unable to generate instructions"
    
    def _load_image(self, image: Union[str, bytes, Image.Image]) -> Image.Image:
        """Convert various image formats to PIL Image"""
        if isinstance(image, str):  # File path
            return Image.open(image)
        elif isinstance(image, bytes):  # Bytes
            return Image.open(io.BytesIO(image))
        elif isinstance(image, Image.Image):  # PIL Image
            return image
        else:
            raise ValueError("Unsupported image format")
    
    def _parse_gemini_response(self, response) -> Dict:
        """Extract JSON from Gemini response"""
        try:
            # Handle potential Markdown code blocks
            text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback to text extraction
            return {'analysis': response.text}
    
    def _translate_text(self, text: str, target_lang: str) -> Dict:
        """Translate text using Gemini"""
        prompt = f"Translate this to {target_lang} exactly without commentary: {text}"
        response = self.text_model.generate_content(prompt)
        return {
            'original': text,
            'translated': response.text,
            'language': target_lang
        }
    
    def log_usage(self, request_type: str, metadata: Dict):
        """Log API usage for monitoring"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'service': 'gemini',
            'request_type': request_type,
            'metadata': metadata
        }
        # In production, this would send to your logging system
        self.logger.info(json.dumps(log_entry))

# Example usage (would be in your other services)
"""
gemini = GeminiService()

# Analyze citizen text report
text_report = "Flood waters rising quickly in downtown area, multiple buildings underwater"
print(gemini.analyze_text_report(text_report))

# Assess drone image
with open("flood_image.jpg", "rb") as f:
    print(gemini.analyze_image(f.read()))

# Generate full incident report
print(gemini.generate_incident_report(
    text=text_report,
    images=["flood_image.jpg"],
    sensor_data={"water_level": "2.4m", "current_speed": "1.2m/s"}
))
"""