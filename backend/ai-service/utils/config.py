import os
from typing import Dict, Any

class Config:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.load_config()
        return cls._instance
    
    def load_config(self):
        self.settings = {
            'GCP': {
                'project_id': os.getenv('GCP_PROJECT_ID'),
                'region': os.getenv('GCP_REGION', 'us-central1'),
                'storage_bucket': os.getenv('GCS_BUCKET', 'disaster-data-bucket')
            },
            'VertexAI': {
                'endpoints': {
                    'damage': os.getenv('DAMAGE_MODEL_ENDPOINT'),
                    'resource': os.getenv('RESOURCE_MODEL_ENDPOINT')
                }
            },
            'Gemini': {
                'api_key': os.getenv('GEMINI_API_KEY'),
                'safety_settings': {
                    'HARASSMENT': 'BLOCK_NONE',
                    'HATE_SPEECH': 'BLOCK_NONE'
                }
            },
            'RFID': {
                'api_endpoint': os.getenv('RFID_API_ENDPOINT'),
                'poll_interval': 60
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        keys = key.split('.')
        val = self.settings
        for k in keys:
            val = val.get(k, {})
        return val if val != {} else default