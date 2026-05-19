# 🚀 AI-Based Smart Complaint Management System

An intelligent MERN Stack web application designed to simplify and automate complaint management using AI-powered analysis.

This project allows users to register complaints online, track complaint status, and receive AI-generated complaint analysis including urgency detection, department recommendation, summary generation, and automated responses.

---

# 🌐 Live Demo

## Frontend

https://smart-complaint-frontend-9mmr.onrender.com

## Backend API

https://smart-complaint-management-system-backend.onrender.com

---

# ✨ Features

## 🔐 Authentication & Security

* User Signup & Login
* JWT-based Authentication
* Protected Routes
* Password Hashing using bcrypt

## 📝 Complaint Management

* Register Complaints
* View All Complaints
* Search Complaints by Location
* Update Complaint Status
* Complaint Tracking Dashboard

## 🤖 AI Integration

* AI Complaint Priority Detection
* Department Recommendation
* AI-generated Complaint Summary
* Automated User Response Generation

## ☁️ Deployment

* Frontend deployed on Render
* Backend deployed on Render
* MongoDB Atlas Cloud Database

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Context API
* React Toastify
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## AI Integration

* OpenRouter API
* GPT-3.5 Turbo Model

---

# 📂 Project Structure

```bash
smart-complaint-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-complaint-management-system.git
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Start backend server:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 📡 API Endpoints

## Authentication APIs

### Signup

```http
POST /api/auth/signup
```

### Login

```http
POST /api/auth/login
```

---

## Complaint APIs

### Add Complaint

```http
POST /api/complaints
```

### Get All Complaints

```http
GET /api/complaints
```

### Update Complaint Status

```http
PUT /api/complaints/:id
```

### Search Complaints by Location

```http
GET /api/complaints/search?location=Ghaziabad
```

---

## AI APIs

### AI Complaint Analysis

```http
POST /api/ai/analyze
```

---

# 🤖 AI Analysis Output Example

```json
{
  "priority": "High",
  "department": "Water Department",
  "summary": "Pipeline leakage causing public inconvenience.",
  "autoResponse": "Your complaint has been registered and forwarded to the Water Department."
}
```

---

# 🔒 Security Features

* JWT Token Authentication
* Protected Backend Routes
* Password Encryption using bcrypt
* Secure API Communication

---

# 📸 Project Screenshots

## Features Demonstrated

* User Authentication
* Complaint Registration
* Complaint Dashboard
* AI Analysis Result
* Complaint Status Tracking
* MongoDB Database Storage
* Render Deployment

---

# 🚀 Deployment

## Backend Deployment

* Render Web Service

## Frontend Deployment

* Render Static Site

## Database

* MongoDB Atlas

---

# 🎯 Future Improvements

* Admin Dashboard
* Email Notifications
* Real-time Complaint Tracking
* Image Upload Support
* AI Chat Assistant
* Analytics Dashboard

---

# 👨‍💻 Developed By

Tarun

---

# 📄 License

This project is developed for educational and academic purposes.
