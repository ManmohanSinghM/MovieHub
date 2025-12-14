# 🎬 MERN Stack Movie Application

A full-stack movie management application built using the MERN stack with
JWT authentication and role-based access control.

---

## 🚀 Live Demo

- **Frontend:** https://mern-movie-app-six.vercel.app
- **Backend API:** https://mern-movie-app-production.up.railway.app

---

## ✨ Features

### User Features
- View movies with pagination
- Search movies by title or description
- Sort movies by rating, release date, and name

### Admin Features
- Add new movies
- Delete movies
- Role-based access using JWT

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Material UI
- Axios
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

---

## 🔑 Demo Credentials (Admin)

- **Username:** Admin  
- **Password:** adminpassword123  

---

## 🔌 API Endpoints

| Method | Endpoint | Access |
|------|--------|-------|
| GET | /api/movies | Public |
| POST | /api/movies | Admin |
| DELETE | /api/movies/:id | Admin |
| POST | /api/auth/login | Public |
| POST | /api/auth/register | Public |

---

## 📦 Local Setup

```bash
git clone https://github.com/ManmohanSinghM/MovieHub.git
cd MovieHub
