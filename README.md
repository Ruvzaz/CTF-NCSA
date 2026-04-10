# 🚩 CTF Portal - Ultimate Capture The Flag Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Strapi](https://img.shields.io/badge/Backend-Strapi%20v5-blueviolet?style=for-the-badge&logo=strapi)](https://strapi.io/)
[![Docker](https://img.shields.io/badge/DevOps-Docker%20Compose-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**CTF Portal** เป็นแพลตฟอร์มคอมมูนิตี้ด้าน Cybersecurity ที่ทันสมัย ถูกออกแบบมาเพื่อการจัดการโจทย์ CTF, การเขียน Write-ups, และระบบ Leaderboard ที่รวดเร็ว ปลอดภัย และรองรับ SEO อย่างเต็มรูปแบบ

---

## ✨ Key Features

- 🏎️ **High Performance**: ขับเคลื่อนด้วย Next.js 14 App Router (SSR/ISR) เพื่อความเร็วสูงสุด
- 🛡️ **Secure by Design**: ระบบ Hardened Container, Content Security Policy (CSP), และระบบป้องกัน Brute-force
- 📈 **Real-time Leaderboard**: ระบบจัดอันดับผู้เล่นที่คำนวณคะแนนอย่างแม่นยำพร้อม Podium เอฟเฟกต์
- ✍️ **Markdown Library**: จัดการ Write-ups และข่าวสารด้วยระบบ Markdown Rendering สวยงาม
- 📱 **Fully Responsive**: รองรับการใช้งานมือถือ 100% พร้อม Dark Mode (Cyberpunk Theme)
- 🐳 **One-Click Deploy**: พร้อมรันบนเทคโนโลยี Docker Compose ทันที

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (TypeScript)
- **UI Components**: Shadcn UI + Lucide Icons
- **Styling**: Tailwind CSS (HSL Design System)
- **State Management**: React Context API (Auth & Theme)

### Backend
- **Headless CMS**: Strapi v5
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **API**: REST API / GraphQL integration

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx Reverse Proxy (Plan Phase 6)
- **Security**: Helmet, HSTS, Rate Limiting Middleware

---

## 🚀 Quick Start (Docker)

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/ctf-portal.git
   cd ctf-portal
   ```

2. **Configure Environment Variables**
   สร้างไฟล์ `.env` ที่ระดับ Root Directory (ศึกษารายละเอียดใน [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))
   ```bash
   # ตัวอย่างเพียงบางส่วน
   APP_KEYS=random_keys...
   JWT_SECRET=random_secret...
   NEXT_PUBLIC_STRAPI_URL=http://your-vps-ip:1337
   ```

3. **Spin up with Docker**
   ```bash
   docker-compose up -d --build
   ```
   *เข้าชมได้ที่: `http://localhost:3000` (Frontend) และ `http://localhost:1337/admin` (Strapi)*

---

## 📂 Project Structure

```text
.
├── frontend/             # Next.js Application
├── backend/              # Strapi CMS (v5)
├── Markdown/             # Implementation Plans & Specs
├── docker-compose.yml    # Docker Orchestration
├── DEPLOYMENT_GUIDE.md   # Detailed Deployment Steps
└── PROJECT_BOARD.md      # Agile Progress Tracking
```

---

## 🛡️ Security Posture

ระบบถูกปรับแต่ง (Hardening) ตามนโยบายความปลอดภัยสูงสุด:
- ✅ **Least Privilege**: รัน Node.js ด้วยไอดี `node` (ไม่ใช่ Root) ภายใน Container
- ✅ **HttpOnly Cookies**: เก็บ JWT Session อย่างปลอดภัยกันการโจมตี XSS
- ✅ **CSP & HSTS**: ป้องกัน Clickjacking และ SSL Stripping
- ✅ **Input Sanitization**: ใช้ DOMPurify ในการกรองเนื้อหา Markdown


---
> [!TIP]
> **สำหรับนักพัฒนา:** สามารถดูรายละเอียดแผนการพัฒนาที่ผ่านมาและ Task ที่กำลังทำอยู่ได้ใน [PROJECT_BOARD.md](PROJECT_BOARD.md)
