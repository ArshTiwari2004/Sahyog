import logging
import sys
from datetime import datetime
from typing import Dict, Any

class AppLogger:
    def __init__(self, name: str = 'sahyog-ai'):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        
        # Console handler
        ch = logging.StreamHandler(sys.stdout)
        ch.setFormatter(formatter)
        self.logger.addHandler(ch)
    
    def log(self, 
           level: str, 
           message: str, 
           metadata: Dict[str, Any] = None):
        log_method = getattr(self.logger, level.lower(), self.logger.info)
        extra = {'metadata': metadata} if metadata else {}
        log_method(message, extra=extra)
    
    def api_call(self, 
                endpoint: str, 
                params: Dict, 
                duration: float):
        self.log('INFO', f'API call to {endpoint}', {
            'params': params,
            'duration_sec': duration,
            'type': 'api_call'
        })

# Singleton logger instance
logger = AppLogger()