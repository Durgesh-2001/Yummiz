# 🍽️ Yummiz – Full-Stack Recipe Web App

**Yummiz** is a modern full-stack food recipe web application that lets users explore, save, and request delicious dishes, while giving admins powerful tools to manage content and user interactions.

---

## 🚀 Live Demo (Coming Soon)

<!-- Add your deployed URL here when ready -->
---

## 🧱 Tech Stack

### Frontend

* React 18 + Vite
* Redux Toolkit
* Tailwind CSS + Material UI
* React Router v6
* Axios
* React Hook Form + Yup
* Vitest + React Testing Library

### Admin Panel

* React 18 + Vite
* MUI Admin Template + React Data Grid
* Recharts for charts
* React Dropzone (image uploads)
* Redux Toolkit
* Formik + Day.js
* Jest

### Backend

* Node.js 18+, Express.js
* MongoDB + Mongoose
* JWT Auth + bcryptjs
* Multer + Cloudinary (file uploads)
* Nodemailer (email/OTP)
* Express-validator, Helmet, CORS, Rate-limiting
* Jest + Supertest
* Swagger/OpenAPI Docs

### Dev Tools

* Git + npm
* ESLint + Prettier
* Postman
* dotenv
* Docker
* TypeScript (optional)
* Winston for logging
* http-status-codes

---

## 🧑‍🍳 Features

### User-Side

* Browse recipes by categories
* Save favorite recipes
* Search functionality
* Request new recipes
* Email + OTP-based authentication
* Fully mobile responsive

### Admin-Side

* Dashboard with stats + charts
* CRUD for recipes (create/edit/delete)
* Image upload with Cloudinary
* View + manage recipe requests
* Track user activity and request volume

---

## 🛠️ How to Run It Locally

```bash
# Clone the repository
git clone https://github.com/yourname/yummiz.git

# Backend setup
cd yummiz/backend
npm install
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev

# Admin setup
cd ../admin
npm install
npm run dev
```

> Make sure to add your environment variables in `.env` files for each module.

---

## 🗂️ Folder Structure

```
/yummiz
├── /frontend      # User-facing app
├── /admin         # Admin panel
├── /backend       # API + DB
└── /uploads       # Image storage (if not using Cloudinary)
```

---

## 📸 Screenshots

<!-- Add images of your UI here to give your README more pop -->

---

## 📢 Contact & Credits

Made with 💚 by \[Your Name].
Want to collaborate, contribute, or hire me?

📬 [your.email@example.com](mailto:your.email@example.com)
🔗 [LinkedIn](https://linkedin.com/in/yourprofile) | [Portfolio](https://yourwebsite.com)

---

## 📃 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

MIT License

Copyright (c) 2025 \[Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
