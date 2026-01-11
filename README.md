# 🎬 MovieHub - Full Stack MERN Application

A robust full-stack movie management application built using the MERN stack (MongoDB, Express, React, Node.js). It features secure JWT authentication, role-based access control (RBAC), and a responsive UI.

---

## 🏗 Infrastructure Evolution (The Migration Story)

**Version 1.0 (PaaS Deployment)**
Initially, this application followed a standard distributed deployment:
* **Frontend:** Hosted on Vercel.
* **Backend:** Hosted on Railway/Render.
* **Challenges:** While easy to set up, this architecture introduced "Cold Start" delays on free tiers and required complex CORS configurations.

**Version 2.0 (IaaS Migration)**
To gain full control over performance, I moved to a centralized **AWS EC2** instance.
* **Unified Host:** Both frontend and backend run on a single Amazon Linux 2023 server.
* **Process Management:** Implemented **PM2** for 24/7 uptime and automatic restarts.
* **Network Engineering:** Configured **Linux iptables** to forward traffic from port 80 to 5000.
* **Security:** Secured via **AWS Security Groups**, limiting access to essential ports only.

**Version 3.0 (Automation & CI/CD - Current)** 🚀
To eliminate manual deployments, I implemented a fully automated **CI/CD Pipeline** using **GitHub Actions**.
* **Automation:** Any code pushed to the `main` branch is automatically detected by GitHub.
* **Deployment:** The pipeline connects to the AWS server via SSH, pulls the latest code, installs dependencies, rebuilds the React app, and restarts the server—all in under 2 minutes.

---

## 🚀 Live Demo

- **Live URL:** [https://bit.ly/Movie_Hub](https://bit.ly/Movie_Hub)
- **Direct IP:** [http://3.110.248.235/](http://3.110.248.235/)
- **API Health Check:** [http://3.110.248.235/api/movies](http://3.110.248.235/api/movies)

---

## ✨ Features

### 👤 User Features
- **Browse Movies:** View a paginated list of movies fetched from the database.
- **Search & Filter:** Search by title or description; sort by rating, release date, and name.
- **Responsive UI:** Fully optimized for mobile and desktop screens.

### 🛡 Admin Features
- **Secure Authentication:** JWT-based login system.
- **Movie Management:** Add new movies (Posters, Ratings, Descriptions) and delete existing ones.
- **Role-Based Access:** Protected routes ensure only Admins can modify data.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Auth:** JSON Web Tokens (JWT) & Bcrypt

### Cloud & DevOps
- **Cloud Provider:** Amazon Web Services (AWS)
- **Server:** EC2 (Amazon Linux 2023)
- **CI/CD:** GitHub Actions
- **Process Manager:** PM2
- **Networking:** Elastic IP & IPTables

---

## 🔑 Demo Credentials (Admin)

Use these credentials to test the Admin features (Add/Delete movies):

- **Username:** `admin`
- **Password:** `adminpassword123`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Access |
|:-------|:---------|:------------|:-------|
| `GET` | `/api/movies` | Fetch all movies | Public |
| `POST` | `/api/movies` | Add a new movie | Admin |
| `DELETE` | `/api/movies/:id` | Delete a movie | Admin |
| `POST` | `/api/auth/login` | User login | Public |
| `POST` | `/api/auth/register` | User registration | Public |

---

## 📦 Local Setup

If you want to run this project locally:

1. **Clone the repository**
   ```bash
   git clone [https://github.com/ManmohanSinghM/mern-movie-app.git](https://github.com/ManmohanSinghM/mern-movie-app.git)
   cd mern-movie-app
2. **Install Dependencies**
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3. **Environment Variables Create a .env file in the server folder:**
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Create a .env file in the client folder:
VITE_TMDB_API_KEY=your_tmdb_key
VITE_BACKEND_URL=http://localhost:5000/api

4. **Run the App**
# Run Backend (from server folder)
npm start

# Run Frontend (from client folder in a new terminal)
npm run dev




