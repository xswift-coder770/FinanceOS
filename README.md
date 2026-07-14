
# 💰 FinanceOS – Personal Finance & Habit Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" />
  <img src="https://img.shields.io/badge/Status-Production-success" />
</p>

## 📖 Overview

FinanceOS is a **full-stack MERN (MongoDB, Express.js, React.js, Node.js)** web application designed to help users efficiently manage their personal finances while building healthy financial habits.

Unlike traditional expense trackers that only record transactions, FinanceOS combines **income management, expense tracking, savings goals, habit monitoring, financial analytics, and secure authentication** into one unified platform.

The application follows a **modular, scalable architecture** with cloud deployment, making it suitable for real-world usage and future expansion.

---

# 🚀 Live Demo

### 🌐 Frontend

https://finance-os-phi-roan.vercel.app

### ⚙️ Backend API

https://financeos-6ljy.onrender.com/api/health

---

# ✨ Key Features

### 🔐 Authentication

- Secure User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Persistent User Sessions

---

### 💰 Income Management

- Add Income
- Edit Income
- Delete Income
- Income Tracking
- Dashboard Integration

---

### 💳 Expense Management

- Create Expenses
- Update Expenses
- Delete Expenses
- Expense Categories
- Expense History
- Category-wise Organization

---

### 🎯 Savings Goals

- Create Savings Goals
- Track Goal Progress
- Monitor Remaining Amount
- Financial Target Management

---

### 📈 Dashboard

Real-time dashboard displaying

- Total Income
- Total Expenses
- Total Savings
- Savings Rate
- Recent Transactions
- Financial KPIs

---

### ✅ Habit Tracker

Develop healthy financial habits

- Daily Habits
- Progress Tracking
- Completion Monitoring

---

### 📊 Analytics

Financial insights including

- Income vs Expense
- Savings Analysis
- Financial Metrics
- Spending Distribution

---

### 🔒 Security

- JWT Authentication
- bcrypt Password Hashing
- Helmet Security Headers
- Express Rate Limiting
- Input Validation
- Secure REST APIs
- Environment Variables

---

# 🏗️ System Architecture

```
                    User
                      │
                      ▼
        React Frontend (Vite)
                      │
               Axios REST APIs
                      │
                      ▼
         Express.js Backend API
                      │
        Controllers & Middleware
                      │
               Mongoose ODM
                      │
                      ▼
              MongoDB Atlas
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- CSS3
- Axios
- React Router DOM

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB Atlas
- Mongoose

---

## Authentication

- JWT
- bcryptjs

---

## Security

- Helmet
- Express Validator
- Express Rate Limit
- CORS

---

## Deployment

- Vercel
- Render
- MongoDB Atlas

---

# 📂 Project Structure

```
FinanceOS
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   ├── utils
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── validations
│   ├── utils
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🔄 Authentication Flow

```
User Login
     │
     ▼
React Login Page
     │
     ▼
Axios API Request
     │
     ▼
Express Route
     │
     ▼
Input Validation
     │
     ▼
User Lookup
     │
     ▼
Password Verification
     │
     ▼
JWT Generation
     │
     ▼
Token Returned
     │
     ▼
Stored in Local Storage
     │
     ▼
Protected Dashboard
```

---

# 🗄️ Database Design

## User

```
_id
name
email
password
role
financialProfile
createdAt
updatedAt
```

---

## Expense

```
_id
userId
title
category
amount
type
date
```

---

## Goal

```
_id
userId
goalName
targetAmount
currentAmount
deadline
```

---

## Habit

```
_id
userId
habitName
completed
```

---

# 🌐 REST API

## Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

## Dashboard

```
GET /api/dashboard
```

---

## Expenses

```
GET /api/expenses
POST /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id
```

---

## Goals

```
GET /api/goals
POST /api/goals
PUT /api/goals/:id
DELETE /api/goals/:id
```

---

## Habits

```
GET /api/habits
POST /api/habits
PUT /api/habits/:id
DELETE /api/habits/:id
```

---

## Analytics

```
GET /api/analytics
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/xswift-coder770/FinanceOS.git
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
npm install
npm run dev
```

---

# 🔑 Environment Variables

### Backend

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

---

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📈 Future Enhancements

- AI Financial Advisor
- OCR Bill Scanner
- Recurring Transactions
- Investment Portfolio
- Budget Forecasting
- Email Verification
- Password Recovery
- PDF Report Generation
- Mobile Application
- Notifications
- Multi-Currency Support

---

# 📚 Learning Outcomes

This project demonstrates practical implementation of

- MERN Stack Development
- REST API Design
- JWT Authentication
- MongoDB Integration
- Cloud Deployment
- Secure Backend Development
- React State Management
- Context API
- Production Deployment
- Git & GitHub Workflow

---

# 👨‍💻 Author

**Gaurav Kumar Baraik**

B.Tech Computer Science Engineering

BIT Mesra, Ranchi

GitHub: https://github.com/xswift-coder770

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is intended for educational and portfolio purposes.
