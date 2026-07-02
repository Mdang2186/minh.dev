# minh.dev - Personal Portfolio Website

Hi there! 👋 I'm **Đỗ Công Minh**, a Software Engineering student at UNETI (2022 - 2026) aiming to become a professional Frontend Developer. I am passionate about building modern, intuitive interfaces with strong fundamentals and a product-focused mindset.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin)](https://linkedin.com/in/mdang2186)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/Mdang2186)
[![Facebook](https://img.shields.io/badge/Facebook-Profile-blue?logo=facebook)](https://www.facebook.com/mdang2186)
[![Email](https://img.shields.io/badge/Email-mdang2186@gmail.com-red?logo=gmail)](mailto:mdang2186@gmail.com)

---

## About the Project
`minh.dev` is my personal portfolio and blog platform built with a modern tech stack. It showcases my projects, skills, and experiences. Additionally, it features a fully functional **Admin Dashboard** allowing dynamic updates to the portfolio content directly from the browser without modifying the source code.

### Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend & Database**: Prisma ORM, PostgreSQL (Neon/Railway)
- **Architecture**: Turborepo (Monorepo setup with `apps/web` and `packages/database`)
- **Authentication**: JWT-based session management using `httpOnly` cookies, bcryptjs
- **Styling**: Tailwind CSS with custom UI components (inspired by shadcn/ui)

## Features
- 🌐 **Public Portfolio**: Stunning UI with interactive project showcases (lightbox, swipeable galleries), and responsive design.
- 🔒 **Secure Admin Dashboard**: Access protected routes via `/admin/login`.
- ✏️ **Dynamic Content Management**:
  - Manage Personal Profile (avatar, CV file, bio).
  - Manage Projects (add/edit projects, screenshots, tech stacks, directory trees).
  - Manage Skills, Experiences, and Social Links.
- 🚀 **File Upload**: Direct file uploading (images, CV) managed in the admin dashboard.

---

## Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   ```bash
   copy .env.example .env
   ```
   Fill in the variables in `.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="ChangeMe123!"
   ADMIN_NAME="Portfolio Admin"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

3. **Database Setup (Prisma):**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```
   *Note: If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are not set, the seed will use the demo account `admin@example.com` / `ChangeMe123!`. Do not use the demo credentials for production.*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to view the public portfolio.
To access the Admin Panel, navigate to `http://localhost:3000/admin/login`.

## Deployment
- The web app is optimized for Vercel deployment.
- PostgreSQL database can be hosted on Neon, Railway, or Supabase. Remember to provide the correct `DATABASE_URL` during deployment.

---
*Built with ❤️ by Đỗ Công Minh.*
