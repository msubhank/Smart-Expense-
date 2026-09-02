# SmartExpense — Personal Expense Tracker (Java + Firebase)

A full-stack, portfolio-ready expense management and financial tracking application built with **Spring Boot (Java 17+)**, **Google Firebase Authentication & Cloud Firestore**, and a modern **React + Tailwind CSS** frontend with interactive analytics, budget monitoring, and financial statement exports.

---

## 🛠️ Tools & Technologies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | Java 17+ (Eclipse Temurin) | Core backend programming |
| **Backend Framework** | Spring Boot 3.x | REST APIs, dependency injection, business logic |
| **Authentication** | Firebase Authentication | User login, registration, Google Sign-in |
| **Database** | Cloud Firestore | Cloud NoSQL database for transactions, categories, budgets |
| **Firebase SDK** | Firebase Admin SDK | Server-side token verification & trusted Firestore access |
| **Frontend UI** | React.js (Vite) | Client-side user interface and reactive state |
| **Styling** | Tailwind CSS | Responsive styling & glassmorphic aesthetics |
| **Charts** | Recharts | Cash flow trends & category donut charts |
| **Testing** | JUnit 5 + Mockito | Java unit & service layer testing |
| **API Testing** | Postman | REST endpoint verification |

---

## 🗺️ Project Phases

- [x] **Phase 1**: Project Scaffolding & Architecture Foundation (Spring Boot + React + Tailwind)
- [x] **Phase 2**: Firebase Authentication & Spring Security JWT Verification Filter
- [ ] **Phase 3**: Domain Models, Firestore DAOs & REST API Controllers
- [ ] **Phase 4**: Frontend UI, State Management & Interactive Dashboard
- [ ] **Phase 5**: Financial Analytics Engine, PDF Statements & CSV Export
- [ ] **Phase 6**: Unit Testing & Postman Collection Verification

---

## ⚡ Getting Started

### 1. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Runs the Vite development server on `http://localhost:5173`.

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Starts the Spring Boot server on `http://localhost:8080`.

*(Note: On Windows PowerShell without global Maven, you can run:*
```powershell
& "$env:USERPROFILE\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
```
*or click "Run" in your IDE's `SmartExpenseApplication.java`).*

---

## 🔒 Phase 2 Authentication Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | **Public** | Verifies server health and CORS connectivity |
| `GET` | `/api/auth/me` | **Protected** | Verifies Firebase JWT Bearer token and returns authenticated user claims |

---

## 🔑 Firebase Configuration (Optional for Dev, Required for Live Auth)

1. **Frontend**: Copy [`frontend/.env.example`](frontend/.env.example) to `frontend/.env` and enter your Firebase web app keys.
2. **Backend**: Download your Firebase Admin private key and save it as `backend/src/main/resources/serviceAccountKey.json` (see [`serviceAccountKey.sample.json`](backend/src/main/resources/serviceAccountKey.sample.json)).

