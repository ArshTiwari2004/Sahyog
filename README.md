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

## 🛠️ Technologies

### AI and ML:
- **Vertex AI** for model training and deployment.
- **LSTMs, CNNs, GANs** for disaster prediction.
- **Gemini API** for image, video, and text analysis.

### Backend:
- **Node.js** with **Express** for APIs.
- **FastAPI** for AI model interaction.

### Frontend:
- **React.js** for web applications.
- **Flutter** for mobile applications.

### Database:
- **PostgreSQL** for structured data.
- **MongoDB** for unstructured data.

### Resource Management:
- **RFID Sensors** and **Hyperledger Fabric** for real-time tracking.

### Communication:
- **Twilio** for SMS and calls.
- **Firebase Cloud Messaging** for push notifications.

### Visualization:
- **Google Maps API** for GIS-based dashboards.
- **Google Data Studio** for reports.

### Data Processing:
- **Apache Kafka** for data streaming.
- **Apache Spark** for large-scale data analysis.

---

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
