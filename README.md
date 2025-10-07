# Inventory and Workforce Management System

<p align="center">
  <!-- M -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" alt="MongoDB" width="90" style="margin-right:10px;"/>
  <!-- E -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express.js" width="90" style="margin-right:10px;"/>
  <!-- A -->
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular" width="90" style="margin-right:10px;"/>
  <!-- N -->
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" width="90"/>
</p>

<p align="center">
  <b>Built with the MEAN Stack – MongoDB, Express, Angular, and Node.js</b>
</p>

[![Angular Version](https://img.shields.io/badge/Angular-20-red)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![RESTful API](https://img.shields.io/badge/REST-02569B?style=flat&logo=swagger&logoColor=white)](https://restfulapi.net/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> **Admin Dashboard and Employee Interface**  
> This version connects to a live **MongoDB database** using a **Node + Express backend**.  
>  
> 💡 If you prefer a simpler setup (no MongoDB required), check out the Angular-only version here:  
> 👉 [Inventory-and-Workforce-Dashboard-angular](https://github.com/DMGsilverfish/Inventory-and-Workforce-Dashboard-angular)

---

## ✨ What It Does
The **Inventory and Workforce Management System** is a demo Angular application designed to:

- ✅ Provide **role-based logins** (Admin vs Employee)  
- ✅ Showcase **protected routes** using Angular Guards  
- ✅ Demonstrate basic **JSON-based authentication**  
- 🔄 Planned: Enhanced UI/UX, integration with a real backend
- ❌ Employees can work up to **2 shifts per day**

---

## 🏗️ Tech Stack
- **Angular 20** – Modern framework for SPAs  
- **TypeScript** – Strong typing for maintainability
- **RESTful API** – Standardized client-server communication
- **Node.js** – JavaScript runtime for the backend  
- **Express.js** – Lightweight web framework for APIs 
- **HTML5 & CSS** – Simple UI, mobile-friendly  

---

## 🔑 Demo Logins
- **👤 Employee**
  - Username: Alice Johnson
  - PIN: 1234

- **🛠️ Admin**
  - Username: Diana Prince
  - PIN: 4321

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or newer) - [Download Node.js](https://nodejs.org/en)
- **Mongo Server** (v8.2.1 or newer) - [Download Mongo Community Server](https://www.mongodb.com/try/download/community)
- **Mongo Shell** (v2.5.8 or newer) - [Download Mongo Shell](https://www.mongodb.com/try/download/shell)
- **Angular CLI 20**

### Run Locally
```bash
# Clone the repository
git clone https://github.com/DMGsilverfish/inventory-and-workforce-dashboard.git
cd inventory-and-workforce-dashboard

# ----------------------
# 1️⃣ Start the backend
# ----------------------
# Navigate to the backend folder (cd backend)
node server.js
# The backend API will run on http://localhost:3000

# ----------------------
# 2️⃣ Start the frontend (new terminal)
# ----------------------
ng serve
# Open your browser and go to http://localhost:4200
