# 🚀 Premium Full-Stack Portfolio

Welcome to my premium full-stack portfolio! This application is built with a modern tech stack to showcase my projects, skills, and experience with a sleek, responsive design and a dynamic backend.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4
- **Backend:** Node.js, Express.js 5
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Storage:** Multer (Local file uploads)

## ✨ Features

- **Dynamic Content Management:** Complete Admin panel to manage all portfolio sections (Hero, About, Skills, Projects, Experience, etc.).
- **Modern UI/UX:** Responsive layouts, sleek design, and interactive components.
- **Performance Optimized:** Optimized API data fetching.
- **Secure Authentication:** JWT-protected admin routes.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` in the root folder and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=securepassword
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the Development Servers**

   Start the backend (runs on port 5000):
   ```bash
   cd backend
   npm run dev
   ```

   Start the frontend (runs on port 3000):
   ```bash
   cd frontend
   npm run dev
   ```

Visit `http://localhost:3000` to view the portfolio and `http://localhost:3000/admin` to access the admin dashboard!



Vercel:[[ https://shrabbi-portfolio-website.vercel.app/](https://shrabbi.vercel.app/)](https://shrabbi.vercel.app/)
## 📄 License

This project is licensed under the MIT License.
