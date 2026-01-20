🛒 Modern E-Commerce Web Application

A full-stack e-commerce application built with Spring Boot, React, MySQL, and JWT-based security.
Designed for security, scalability, and modern best practices, including separate admin and user authentication, role-based access, and safe handling of secrets.

🌟 Features
User Features

Register & login securely

Browse products by categories

Add products to cart

View and manage profile

Persistent login with JWT stored in localStorage

Secure password hashing

Admin Features

Separate admin login & registration

Manage products (CRUD)

Manage users and orders

Admin dashboard with secure access

Tokens stored in sessionStorage → forces re-login for safety

Security Features

JWT authentication with expiration

Backend enforces admin-only access to admin APIs

Frontend protected routes

Passwords hashed with BCrypt

Environment variables used for DB credentials & JWT secret

No sensitive data committed to GitHub

🛠 Tech Stack
Layer	Technology
Frontend	React, React Router, TailwindCSS
Backend	Spring Boot, Spring Security, JWT
Database	MySQL
Security	JWT tokens, BCrypt password hashing
Deployment	Docker (optional), Environment variables
🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Setup Environment Variables

Create a .env file in the backend folder:

# Database
DB_URL=jdbc:mysql://localhost:3306/ecommerce
DB_USERNAME=root
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_jwt_secret
JWT_USER_EXPIRATION=360000000
JWT_ADMIN_EXPIRATION=300000


Note: Never commit .env to GitHub. Use .env.example as a template.

3️⃣ Backend Setup (Spring Boot)
cd backend
./mvnw clean install
./mvnw spring-boot:run


Backend runs on http://localhost:8080

4️⃣ Frontend Setup (React)
cd frontend
npm install
npm start


Frontend runs on http://localhost:3000

🔐 Security Notes

User JWT: stored in localStorage for persistence

Admin JWT: stored in sessionStorage → cleared on browser close

Admin APIs are protected with backend validation

All credentials are loaded from environment variables, never hardcoded

Passwords are hashed before saving to database

🏗 Project Structure
backend/
├─ src/main/java/com/example/springboot1
│  ├─ controller/        # User & Admin controllers
│  ├─ entities/          # User, Product, Order entities
│  ├─ security/          # JwtUtils, filters
│  ├─ service/           # Business logic
│  └─ repository/        # JPA repositories
├─ application.properties # Configs using env variables
frontend/
├─ src/
│  ├─ pages/             # Home, Products, Cart, Admin Dashboard, Auth
│  ├─ components/        # Navbar, Footer, Product Card, etc.
│  ├─ context/           # CartContext, AuthContext
│  └─ App.jsx             # Routes
.gitignore                # Ignore node_modules, target, .env
.env.example              # Template for environment variables
README.md

✅ Best Practices Implemented

Environment Variables: DB credentials & JWT secrets are never committed.

Frontend Security: Admin routes are session-based; user routes are persistent.

Backend Security: JWT expiration and admin access checks.

Password Security: BCrypt hashing.

Modern UI: React with Tailwind for responsive, clean design.

Scalable Architecture: Separate backend controllers for users/admins.

💡 Future Improvements

Add order history and payment gateway integration

Add search & filter products

Add role-based dashboards for different admin levels

Deploy with Docker & CI/CD pipelines
