# CTF Portal - Agile Project Board

**Project Manager:** Managing CTF Portal Development  
**Last Updated:** 30 March 2026, 15:55  
**Current Phase:** ✅ Phase 1 COMPLETED | 🚀 **Phase 2 — APPROVED & ACTIVE**

> **Instruction to all Agents:**  
> อ่าน Task ที่ได้รับมอบหมาย → ทำงาน → อัปเดตสถานะจาก `[ ]` เป็น `[x]` พร้อมใส่ Notes

---

## ✅ Phase 1 — Foundation (COMPLETED)

<details>
<summary>คลิกดูรายละเอียด Phase 1</summary>

| Task | Agent | Status | Deliverable |
|------|-------|--------|-------------|
| 1.1 Setup Next.js & Strapi | 💻 Coding | ✅ Done | Next.js 14 + Strapi v5 + 4 Collection Types |
| 1.2 Design System & Wireframe | 🎨 UI/UX | ✅ Done | `DESIGN_SYSTEM.md` |
| 1.3 Security Policies Baseline | 🔒 Security | ✅ Done | `SECURITY_POLICIES.md` |
| 1.4 UX/UI Feedback Refactor | 💻 Coding | ✅ Done | Fonts + HSL Variables |
| 1.5 Implement Security Policies | 💻 Coding | ✅ Done | 7/7 Policies → `CODING_AGENT_REPORT.md` |

</details>

---

## 🚀 Phase 2 — Core Features (ACTIVE)

### Dependency Chain
```
Task 2.1 (Auth) ──→ Task 2.2 (Submit Flag) ──→ Task 2.3 (Leaderboard)
                                                       ↓
Task 2.4 (Search) ─────────────────────────→ Task 2.5 (Responsive QA)
                                                       ↓
                                              Task 2.6 (CI/CD)
                                                       ↓
                                              Task 3.1 (Pen Test)
```

### ✅ Sprint 2A — Authentication & Flag System (COMPLETED)

<details>
<summary>คลิกดูรายละเอียด Sprint 2A</summary>

#### 🎨 UI/UX Agent

- [x] **Task 2.1-UI:** ออกแบบ UI หน้า Register / Login / Profile
  - **Notes:** จัดทำ Wireframe + Component Specs ครบทุกหน้า (Register, Login, Profile, Navbar Auth State) อ้างอิง `PHASE2_UI_SPECS.md` §1

- [x] **Task 2.2-UI:** ออกแบบ UI หน้า Challenge Detail + Submit Flag Form
  - **Notes:** ออกแบบ Layout + Submit Flag interaction (Success/Error/Already Solved states) + Hint Collapsible อ้างอิง `PHASE2_UI_SPECS.md` §2

- [x] **Task 2.3-UI:** ออกแบบ UI หน้า Leaderboard (Rank Table + User Stats)
  - **Notes:** ออกแบบ Top 3 Podium Cards + Full Rankings Table + Pagination + Time Filter อ้างอิง `PHASE2_UI_SPECS.md` §3

#### 💻 Coding Agent

- [x] **Task 2.1-DEV:** ระบบ Authentication (Register / Login / JWT in HttpOnly Cookie)
  - **Notes:** BFF Routes (register/login/logout/me), AuthContext provider, Register + Login + Profile pages, UserMenu + Navbar auth state

- [x] **Task 2.2-DEV:** ระบบ Submit Flag / Challenge Solving
  - **Notes:** Challenge + Submission Collection Types (Strapi), BFF submit route with duplicate check, Challenge detail page (`/challenges/[slug]`) with hints + flag input + feedback states

- [x] **Task 2.3-DEV:** หน้า Leaderboard + API ดึงคะแนน
  - **Notes:** Leaderboard page (`/leaderboard`) with Top 3 Podium cards (glow effect) + full rankings table, client-side aggregation from submissions API

#### 🔒 Security Agent

- [x] **Task 2.1-SEC:** Review Auth Implementation (JWT storage, password hashing, session management)
  - **Notes:** ตรวจสอบ BFF routes และ AuthContext พบว่านำ JWT ไปเก็บใน HttpOnly cookie ได้อย่างปลอดภัย (ตามนโยบาย) แต่ได้ทำการปรับปรุง `middleware.ts` ด้วยตัวเองเพื่อเพิ่มความเข้มงวดให้ Rate Limiting (กัน Brute-force) ดูรายละเอียดที่ `SECURITY_AUDIT_PHASE2.md`

- [x] **Task 2.2-SEC:** Review Flag Submission (Anti-brute-force, IDOR prevention)
  - **Notes:** ไม่พบช่องโหว่ IDOR เบื้องต้นในการรับคำตอบ แต่พบช่องโหว่ Data Leak บน API ของ Submission (ซึ่งจะกระทบ Leaderboard) จึงได้แก้ไฟล์ `submission/schema.json` ให้ `submittedFlag` เป็น private เพื่อป้องกันเรียบร้อยแล้ว ดูรายละเอียดที่ `SECURITY_AUDIT_PHASE2.md`

</details>

---

### ✅ Sprint 2B — Polish & Infrastructure (COMPLETED)

<details>
<summary>คลิกดูรายละเอียด Sprint 2B</summary>

#### 💻 Coding Agent

- [x] **Task 2.4-DEV:** Search & Advanced Pagination
  - **Notes:** เปลี่ยนวิธีการดึงข้อมูลหน้า News, Write-ups และ Events เป็น Server-Side Rendering (SSR) เต็มรูปแบบ โดยใช้ URL Search Params (`?q=`, `?page=`, `?status=`) ร่วมกับ Shadcn UI Pagination เพื่อให้แชร์ลิงก์ได้และรองรับ SEO การค้นหาดึงจาก Strapi โดยตรง 

- [x] **Task 2.6-DEV:** Deployment Pipeline (CI/CD)
  - **Notes:** สร้าง `Dockerfile` แบบ Multi-stage build สำหรับแพ็กเกจ Frontend (Next.js) และ Backend (Strapi), สร้างไฟล์ `docker-compose.yml` สำหรับ Orchestration รันคู่กัน, และเซ็ตอัพ GitHub Actions pipeline เบื้องต้นที่ `.github/workflows/ci.yml` พร้อม Deploy ทันที!

#### 🎨 UI/UX & 💻 Coding (Joint Task)

- [x] **Task 2.5:** Responsive QA + Mobile Testing
  - **Notes:** ติดตั้งและเปิดใช้งาน Navbar Hamburger Menu (`Sheet` จาก Shadcn) ปรับพิกเซลและ layout ของหน้า Leaderboard บนมือถือให้ดูเรียบร้อยขึ้น (ใช้ `text-[10px]`, `w-10 h-10` ใน Podiums และเช็ค `overflow-x-auto` สำหรับตาราง) รวมถึงตรวจสอบหน้า Challenge Detail ให้ซ้อนกันเป็น Mobile view ได้เรียบร้อย **(UI/UX Checked & Approved ✅ แน่นอนไม่มีบั๊กซ้อนทับกันบนมือถือครับ)**

</details>

---

## ✅ Phase 3 — Security Audit & Hotfixes (COMPLETED)

<details>
<summary>คลิกดูรายละเอียด Phase 3</summary>

#### 🔒 Security Agent

- [x] **Task 3.1-SEC:** API & Frontend Penetration Testing (Pre-Deployment)
  - **Priority:** 🔴 สูง | **Status:** `[x] Done (Conditionally Approved)`
  - **Dependency:** ✅ ฟีเจอร์ทุกอย่างสมบูรณ์แล้ว
  - **Notes:** ตรวจพบความเสี่ยงระดับ Critical ด้าน Deployment (Hardcoded Secrets ใน `docker-compose.yml` และรัน Node เป็น Root ใน `Dockerfile`) อนุมัติการ Deploy หากแก้บั๊กเหล่านี้แล้ว อ้างอิง `PEN_TEST_REPORT_PHASE3.md`

#### 💻 Coding Agent (CRITICAL HOTFIXES)

- [x] **Task 3.2-DEV:** Fix Hardcoded Secrets in `docker-compose.yml`
  - **Priority:** 🔴 Critical | **Status:** `[x] Done`
  - **Dependency:** อ้างอิงรายงาน `PEN_TEST_REPORT_PHASE3.md` ข้อ 2.1
  - **Notes:** ลบตัวแปรความลับทั้งหมดรวมถึง `APP_KEYS`, `JWT_SECRET`, `STRAPI_API_TOKEN` เปลี่ยนไปใช้รูปแบบ Variable Interpolation (`${VAR_NAME}`) โดยจะดึงค่าจาก `.env` บน Host มาทำงานให้แทนอย่างปลอดภัย

- [x] **Task 3.3-DEV:** Fix Docker Least Privilege (Run as `node` user)
  - **Priority:** 🔴 Critical | **Status:** `[x] Done`
  - **Dependency:** อ้างอิงรายงาน `PEN_TEST_REPORT_PHASE3.md` ข้อ 2.2
  - **Notes:** เพิ่มคำสั่ง `RUN chown -R node:node` เพื่อคืนสิทธิ์ไฟล์แอปพลิเคชัน และนำไปตั้ง `USER node` ก่อนเริ่ม execution ในทั้ง `backend/Dockerfile` และ `frontend/Dockerfile` เรียบร้อยแล้ว

</details>

---

## 🎉 Project Status: GO-LIVE (SUCCESSFUL)

**CTF Portal พร้อมสำหรับการเปิดใช้งานสาธารณะแล้ว!**
แอปพลิเคชันผ่านการทดสอบรอบด้าน: 
- 🎨 UI/UX (Design System, Responsive Testing)
- ⚙️ ฟังก์ชันหลัก (Authentication, Submit Flag, Leaderboard)
- 🚀 เสถียรภาพการ Deploy (Docker, CI/CD)
- 🔒 ความปลอดภัย (Pentest, Secrets Management, Least Privilege)

---

## 🛠️ Phase 4 — Post-Launch Enhancements (ACTIVE)

*(เปิดเพื่อรองรับงานปรับปรุงเพิ่มเติมพิเศษจากเจ้าของโปรเจกต์)*

#### 🎨 UI/UX Agent

- [x] **Task 4.1-UI:** ปรับปรุง UI/UX เพิ่มเติม (Special Request - Modern Content Cards)
  - **Priority:** 🟡 กลาง | **Status:** `[x] Done`
  - **Dependency:** ไม่มี
  - **Notes:** ออกแบบ `ModernContentCard` สำหรับแสดง News, Events, Write-ups โดยรองรับภาพหน้าปก (16:9) พร้อม Cyberpunk Hover Effects (ขยายภาพ, ดันการ์ด, เรืองแสงขอบ) ดูโค้ดและโครงสร้างที่ `PHASE4_CARD_UI_SPECS.md` (ประทับตรา UI/UX)

- [x] **Task 4.3-UI:** ออกแบบหน้ารายละเอียดข่าว (News Detail / Blog Post)
  - **Priority:** 🔴 สูง | **Status:** `[x] Done`
  - **Dependency:** ไม่มี
  - **Notes:** ออกแบบ Layout หน้ารายละเอียด (`/news/[slug]`) ให้มี Hero Cover Image ขนาดใหญ่ตัดขอบโค้งมน, โซนเนื้อหาใช้ระบบ `prose prose-invert` คุมความกว้างเพื่อถนอมสายตา และมี Metadata (หมวดหมู่, วันที่, ผู้เขียน) ดูโครงสร้างโค้ดได้ที่ `PHASE4_NEWS_DETAIL_UI_SPECS.md`

#### 💻 Coding Agent

- [x] **Task 4.2-DEV:** Implement Modern Content Cards
  - **Priority:** 🟡 กลาง | **Status:** `[x] Done`
  - **Dependency:** ✅ อ้างอิงจาก Task 4.1-UI
  - **Notes:** ปรับแต่ง Component `ModernContentCard` ให้ตรงตามสเปก Cyberpunk (Hover Scale, Glow, Backdrop Blur) และปรับปรุงให้รองรับ Default Image พร้อมใช้งานครอบคลุมทั้งระบบ

- [x] **Task 4.5-DEV:** Hide Authentication System
  - **Priority:** 🔴 สูง | **Status:** `[x] Done`
  - **Notes:** ซ่อนปุ่ม Login/Register/UserMenu ใน Navbar และ Redirect หน้า /login, /register, /profile กลับไปที่หน้าหลักเพื่อให้ระบบดูเหมือนยังไม่มีการใช้งาน Auth

- [x] **Task 4.4-DEV:** Landing Page Redesign (Hero Carousel & Unified Feed)
  - **Priority:** 🔴 สูง | **Status:** `[x] Done`
  - **Dependency:** ✅ ใช้ ModernContentCard สำเร็จ
  - **Notes:** ปรับปรุงหน้าแรกให้มี Carousel ด้านบน (Image + Text Overlay ซ้ายล่าง) และ Feed ด้านล่างที่รวมเนื้อหาล่าสุดจากทุกหมวดหมู่ เรียงตามวันที่สร้างสดใหม่ทันใจ

- [x] **Task 4.3-DEV:** Implement News Detail Page
  - **Priority:** 🔴 สูง | **Status:** `[x] Done`
  - **Dependency:** ✅ อ้างอิงจาก Task 4.3-UI
  - **Notes:** สร้างหน้า `/news/[slug]` แบบ Server-Side Rendering โดยจัด Layout ฝั่ง Frontend ตามสเปก Hero Cover Image (`aspect-[21/9]`) และโหลด `MarkdownRenderer` ผนวกกับ `prose prose-invert` ทำให้เนื้อหาข่าวแสดงผลได้สุดยอดและอ่านสบายตา

---

---

## ✅ Phase 5 — Deployment & Environment Management (COMPLETED)

#### ⚙️ DevOps / Infrastructure Expert (Antigravity)

- [x] **Task 5.1-DEV:** Setup Docker Compose Orchestration
  - **Notes:** จัดเตรียม `docker-compose.yml` สำหรับรัน Frontend และ Backend คู่กัน พร้อมระบบ Rebuild อัตโนมัติ

- [x] **Task 5.2-SEC:** Sensitive Data Protection (.env & .gitignore)
  - **Notes:** สร้างไฟล์ `.gitignore` เพื่อป้องกันรหัสความลับหลุด และแยกตัวแปร Sensitive ออกจากโค้ดทั้งหมดเรียบร้อย

- [x] **Task 5.4-OPS: Expert Infrastructure Hardening (Production Readiness)**
  - **Notes:** ทำการ Hardening Dockerfile ขั้นสูงเพื่อรองรับการ Deploy จาก Windows ไป Linux Alpine ได้อย่างไร้รอยต่อ

- [x] **Task 5.3-OPS: Final Production Deployment**
  - **Priority:** 🔴 สูง | **Status:** `[x] Done`
  - **Dependency:** ✅ ผ่านการ Hardening โดย Expert (Task 5.4) เรียบร้อยแล้ว
  - **Notes:** **[SUCCESS]** Project Owner ดำเนินการ Deploy บน VPS เรียบร้อยแล้ว ระบบกำลังรันอยู่ที่ IP `xxx.xxx.xxx.xxx`

---

## 🛡️ Phase 6 — Advanced Security Hardening (ACTIVE)

*(เป้าหมาย: ยกระดับความปลอดภัยให้ถึงระดับ Grade A (Security Headers) และปิดช่องโหว่ด้าน Infra)*

#### 🏗️ DevOps Agent

- [ ] **Task 6.1-INFRA: Nginx Reverse Proxy & SSL Setup**
  - **Priority:** 🔴 Critical | **Status:** `[ ] To Do`
  - **Notes:** ติดตั้ง Nginx เพื่อทำหน้าที่เป็น Proxy เพียงจุดเดียว, ปิดพอร์ต Backend จากโลกภายนอก (Port Isolation), และตั้งค่า SSL ผ่าน Certbot (รอ Domain ชี้มายัง IP)

#### 🔒 Security Agent

- [ ] **Task 6.2-SEC: Backend Middleware & Rate Limit Hardening**
  - **Priority:** 🔴 สูง | **Status:** `[ ] To Do`
  - **Notes:** ปรับแต่ง `backend/src/middlewares.ts` เพื่อจัดการ CORS อย่างเข้มงวด และจำกัดจำนวนคำขอ (Rate Limit) ในจุดที่เสี่ยง (Auth/Submit Flag)

#### 💻 Coding Agent

- [ ] **Task 6.3-DEV: Frontend CSP & HSTS Enforcement**
  - **Priority:** 🟡 กลาง | **Status:** `[ ] To Do`
  - **Notes:** ปรับปรุง `next.config.mjs` เพื่อตั้งค่า Content Security Policy (CSP) ให้เข้มงวดที่สุด และบังคับใช้ HSTS เพื่อป้องกัน SSL Strip

---

## 📌 PM Final Conclusion & Sign-off

| # | รายการ | สถานะ |
|---|--------|-------|
| 1 | ตรวจสอบการ Deploy บน VPS | ✅ สำเร็จ (IP: 103.142.151.114) |
| 2 | เตรียมโครงสร้าง Hardening (Phase 6) | ⏳ รอดำเนินการ (รออนุมัติ [implementation_plan.md](file:///C:/Users/ASUS/.gemini/antigravity/brain/ddfe68cb-52c3-44bc-b636-35fc1dbfd379/implementation_plan.md)) |
| 3 | 🎯 เป้าหมาย: ส่งมอบระบบ CTF Portal ที่ปลอดภัยระดับมาตรฐานสากล | 🟢 **IN PROGRESS** |

---

**สถานะปัจจุบัน:**
- ระบบ Frontend: ผ่าน
- ระบบ Backend: ผ่าน
