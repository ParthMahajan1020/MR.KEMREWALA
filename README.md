# MR.KEMREWALA

MR.KEMREWALA is a photographer portfolio website focused on presenting photography collections through an immersive, image-led visual experience.

## Overview

The project is a one-page portfolio for wedding, portrait, fashion, events, wildlife, travel, and product photography. It includes an animated introduction, a cinematic DriftWall hero, responsive portfolio galleries, services, reviews, a booking form, and a contact footer.

## Features

- Animated intro and hero reveal
- DriftWall using the portfolio's local photography assets
- Portfolio categories with responsive Swiper galleries
- Fullscreen image viewing with keyboard and touch navigation
- Responsive navigation with mobile menu
- About and services sections
- Client review submission and approved-review display
- Contact/booking form
- Email notifications from the backend
- MongoDB-backed reviews
- Responsive desktop, tablet, and mobile layouts
- Reduced-motion support in animated gallery surfaces

## Tech Stack

### Frontend

- React 19
- Vite
- JavaScript and CSS
- GSAP
- Swiper
- yet-another-react-lightbox
- React Icons

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Nodemailer
- dotenv
- CORS

## Project Structure

```text
MR.KEMREWALA/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── backend/
│   ├── assets/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── .gitignore
└── README.md
```

`frontend/` contains the React/Vite portfolio application and its photography assets. `backend/` contains the Express API, MongoDB models, review/contact controllers, email configuration, server assets, and routes.

## Setup

```bash
git clone https://github.com/ParthMahajan1020/MR.KEMREWALA.git
cd MR.KEMREWALA
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Other frontend scripts are `npm run build`, `npm run preview`, and `npm run lint`.

### Backend

In a second terminal:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`. The backend listens on port `5000` by default.

## Environment Variables

Real credentials are intentionally excluded from GitHub. Create `backend/.env` locally from `backend/.env.example` and provide values for:

```text
PORT
EMAIL
APP_PASSWORD
MONGODB_URI
PHOTOGRAPHER_EMAIL
BACKEND_URL
```

`EMAIL` and `APP_PASSWORD` are used for Gmail/Nodemailer notifications. `MONGODB_URI` is the MongoDB connection string. `BACKEND_URL` is used when generating review approval and deletion links.

## API Endpoints

- `GET /` - backend health message
- `POST /api/contact` - submit a booking/contact request
- `GET /api/reviews` - retrieve approved reviews
- `POST /api/reviews` - submit a review for approval
- Review approval/deletion routes are defined in `backend/routes/reviewRoutes.js`

## Important Notes

- Never commit `.env` files, API keys, database credentials, email passwords, or private keys.
- Never commit `node_modules/`, `dist/`, build output, or local IDE files.
- Run `npm install` in both application directories after cloning.
- The frontend currently targets the backend at `http://localhost:5000` for contact and review requests.
- A MongoDB database and configured email account are required for live backend submissions.

## License

- No project-level license has been added. All rights remain with the project owner.

---

## Author

*Parth Mahajan*  
- BTech Student | Full-Stack Web Development & DSA
- LinkedIn: https://www.linkedin.com/in/parth-mahajan1020/
- GitHub: https://github.com/ParthMahajan1020  
- Email: parth.mahajan1020@example.com  
- Passionate about building console applications, learning new programming languages, and exploring software projects.
