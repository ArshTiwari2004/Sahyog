# Sahyog: Centralized Disaster Response and Inventory Management System 🌍

<p align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Sahyog+Project+Logo" alt="Sahyog Logo" width="800"/>
</p>

<p align="center">
  <a href="https://sahyog-project.vercel.app/" target="_blank">🌐 Live Project</a> |
  <a href="#installation">🚀 Installation</a> |
  <a href="#folder-structure">📁 Folder Structure</a> |
  <a href="#technologies">🛠️ Technologies</a> |
  <a href="#features">✨ Features</a> |
  <a href="#contributing">🤝 Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Deployed-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/Team-CodeCanvas-orange" alt="Team">
</p>

---

## 📝 Problem Statement

India faces significant challenges in disaster management, including:
- **Delayed Response**: Lack of real-time data to predict and respond to disasters.
- **Inefficient Resource Allocation**: Mismanagement of relief materials and response teams.
- **Poor Communication**: Ineffective coordination between authorities, responders, and citizens.
- **Lack of Predictive Insights**: Absence of AI-powered models to predict disasters and mitigate damage.

In large-scale disasters like floods, earthquakes, and cyclones, these inefficiencies result in increased casualties, prolonged suffering, and immense economic loss.

---

## 💡 Solution Overview

**Sahyog** is an AI-powered disaster response platform designed to enhance preparedness, efficiency, and coordination in disaster management. It leverages **Google Cloud Technologies** and **AI models** to predict disasters, optimize resource management, and provide real-time coordination.

### Key Features:
- **Disaster Prediction and Early Warnings** using AI models deployed on Vertex AI.
- **Incident Reporting and Monitoring** through mobile and web apps using Gemini APIs for image, video, and text analysis.
- **Resource Inventory Management** with real-time tracking using RFID sensors and transparent logging through Hyperledger Fabric.
- **Task Allocation and Response Management** using AI algorithms to assign the nearest responders.
- **Multi-channel Communication** for real-time notifications using Twilio and Firebase Cloud Messaging.
- **Post-Disaster Analysis** to generate actionable insights for future disaster management.

---

## 🛠️ Tech Stack

### AI and Machine Learning
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Vertex AI**         | Training and deploying AI models (LSTMs, CNNs, GANs) for disaster prediction.|
| **Gemini APIs**       | Multimodal analysis of images, videos, and text for damage assessment.      |
| **OpenCV**            | Image processing and damage detection from satellite and drone imagery.     |

### Backend
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Node.js + Express** | Building RESTful APIs for the backend.                                      |
| **FastAPI**           | Serving AI models and handling AI-related requests.                         |
| **Apache Kafka**      | Real-time data streaming from satellites, sensors, and drones.             |
| **Apache Spark**      | Large-scale data processing and post-disaster analysis.                     |

### Frontend
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **React.js**          | Building the web dashboard for real-time monitoring and visualization.      |
| **Flutter**           | Developing the mobile app for citizen reporting and alerts.                 |

### Database
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **PostgreSQL**        | Storing structured data like incident reports and resource details.         |
| **MongoDB**           | Storing unstructured data like images, videos, and sensor logs.             |

### Resource Management
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **RFID Sensors**      | Real-time tracking of relief resources like medical kits and food supplies. |
| **Hyperledger Fabric**| Blockchain-based transparent logging of resource distribution.              |

### Communication
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Twilio**            | Sending SMS and voice alerts to citizens and authorities.                   |
| **Firebase Cloud Messaging** | Push notifications for real-time updates.                              |

### Visualization
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Google Maps API**   | GIS-based visualizations for disaster-affected areas and resource allocation.|
| **Google Data Studio**| Generating real-time reports and insights for stakeholders.                 |

### Infrastructure
| **Technology**       | **Purpose**                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Google Cloud Storage (GCS)** | Storing satellite images, sensor data, and AI models.                  |
| **Docker**            | Containerization of backend and AI services.                               |
| **Kubernetes**        | Orchestrating containerized applications for scalability.                  |
| **Terraform**         | Infrastructure as Code (IaC) for managing cloud resources.                 |

---

## 🔄 Workflow

1. **Data Collection**: Real-time data from satellites, sensors, and drones is streamed via **Apache Kafka** and stored in **Google Cloud Storage (GCS)**.
2. **Disaster Prediction**: **Vertex AI** trains and deploys AI models (LSTMs, CNNs, GANs) for disaster prediction using real-time data.
3. **Incident Reporting**: Citizens report incidents via a **Flutter app**, and **Gemini APIs** analyze images, text, and voice inputs for severity assessment.
4. **Decision Making**: AI models process predictions and reports to generate alerts using **Vertex AI** and **Gemini APIs**.
5. **Alert Generation**: Multilingual alerts are sent via **Twilio** (SMS/calls) and **Firebase Cloud Messaging** (push notifications).
6. **Resource Management**: Resources are tracked using **RFID sensors**, and **Hyperledger Fabric** ensures transparent distribution.
7. **Task Allocation**: AI optimizes task assignments using **Dijkstra’s Algorithm** and real-time data from **Google Maps API**.
8. **Post-Disaster Analysis**: Data is aggregated using **Apache Spark**, and **Vertex AI** generates insights for future preparedness.


## 🚀 Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodeCanvas/Sahyog.git
   cd Sahyog

### 2. Install dependencies

### For the backend
```bash
cd backend/api
npm install
```

### For the AI service
```bash
cd ../ai-service
pip install -r requirements.txt
```

### For the frontend
```bash
cd ../../frontend/web
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Copy .env.example to .env and fill in the required values.

### 4. Run the project

### Start the backend server
```bash
cd ../../backend/api
npm start
```

### Start the AI service
```bash
cd ../ai-service
uvicorn main:app --reload
```

### Start the frontend
```bash
cd ../../frontend/web
npm start
```

## 📂 Project Structure

```bash
Sahyog/
├── backend/  
│   ├── api/               # Main API server (Node.js + Express)  
│   ├── ai-service/        # AI model service (Python + FastAPI)  
│   ├── data-pipeline/     # Data processing pipeline  
│   └── blockchain/        # Hyperledger Fabric setup  
│
├── frontend/  
│   ├── web/               # React.js web application  
│   └── mobile/            # Flutter mobile application  
│
├── infrastructure/  
│   ├── terraform/         # Infrastructure as Code  
│   ├── docker/            # Docker configurations  
│   └── kubernetes/        # Kubernetes configs  
│
├── docs/                  # Documentation  
├── scripts/               # Utility scripts  
├── .env.example           # Example environment variables  
├── .gitignore             # Git ignore file  
└── README.md              # Project overview  
```


## 📊 Diagrams

### Process Flow Diagram
<p align="center"> <img src="https://via.placeholder.com/800x400.png?text=Process+Flow+Diagram" alt="Process Flow Diagram" width="800"/> </p>

### Use Case Diagram
<p align="center"> <img src="https://via.placeholder.com/800x400.png?text=Use+Case+Diagram" alt="Use Case Diagram" width="800"/> </p>

### Architeture Diagram
<p align="center"> <img src="https://via.placeholder.com/800x400.png?text=Architecture+Diagram" alt="Architecture Diagram" width="800"/> </p>


## 🤝 Contributing
Contributions to project Sahyog are always welcome! Please follow these steps:

1. Fork the repository.

2. Create a new branch (git checkout -b feature/YourFeatureName).

3. Commit your changes (git commit -m 'Add some feature').

4. Push to the branch (git push origin feature/YourFeatureName).

5. Open a pull request.


### 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
