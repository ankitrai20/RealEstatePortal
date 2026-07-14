# EstatePro - Real Estate Listing Portal

EstatePro is a full-stack real estate listing web application where users can register, log in, add properties, view property details, and manage their wishlist.

Live Demo:
https://real-estate-portal-livid.vercel.app

GitHub Repository:
https://github.com/ankitrai20/RealEstatePortal

Features

- User Registration and Login
- JWT Authentication
- Protected Routes
- Add Property
- Edit Property
- View Property Details
- Wishlist
- Image Upload using Cloudinary
- PostgreSQL Database
- Responsive Design

Technologies Used

Frontend
- React.js
- Vite
- React Router
- Axios

Backend
- Node.js
- Express.js
- JWT
- Multer
- Cloudinary

Database
- PostgreSQL (Neon)

Deployment
- Vercel
- Render

Project Setup

Clone the repository

```bash
git clone https://github.com/ankitrai20/RealEstatePortal.git
```

Install frontend

```bash
cd frontend
npm install
npm run dev
```

Install backend

```bash
cd server
npm install
npm run dev
```

Environment Variables

Server (.env)

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
```

Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Developer

Ankit Rai

BCA Student  
Shri Ramswaroop Memorial University, Lucknow

GitHub:
https://github.com/ankitrai20
