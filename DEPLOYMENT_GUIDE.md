# 🚀 คู่มือ Deploy บน Windows Server 2022

## ขั้นตอนที่ 1 — เตรียม Windows Server 2022

### 1.1 ติดตั้ง WSL2
เปิด PowerShell **ในฐานะ Administrator** แล้วรัน:
```powershell
wsl --install
# รีสตาร์ทเครื่องหลังติดตั้ง
Restart-Computer
```

### 1.2 ติดตั้ง Docker Engine
```powershell
# ดาวน์โหลด Docker Desktop for Windows Server
# https://docs.docker.com/desktop/install/windows-install/
# หรือใช้ Docker Engine โดยตรง (แนะนำสำหรับ Server):
winget install Docker.DockerDesktop
```

ตรวจสอบว่า Docker ทำงานบน Linux containers:
```powershell
docker info | findstr "OS Type"
# ต้องขึ้นว่า: OS Type: linux
```

### 1.3 เปิด Windows Firewall
```powershell
# เปิด Port สำหรับ Strapi
New-NetFirewallRule -DisplayName "CTF-Strapi" -Direction Inbound -Protocol TCP -LocalPort 1337 -Action Allow

# เปิด Port สำหรับ Next.js (ถ้าไม่ใช้ Reverse Proxy)
New-NetFirewallRule -DisplayName "CTF-Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

---

## ขั้นตอนที่ 2 — เตรียมโค้ดบนเซิร์ฟเวอร์

### 2.1 Clone Repository
```powershell
git clone https://github.com/Ruvzaz/CTF-NCSA.git
cd CTF-NCSA
```

### 2.2 สร้างไฟล์ `.env` [สำคัญมาก!]
```powershell
# สร้างจาก template
copy .env.example .env

# แก้ไขค่าใน .env (ใช้ Notepad หรือ VS Code)
notepad .env
```

**สร้าง Secret Keys ด้วยคำสั่งนี้:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
รันซ้ำ 5 รอบเพื่อสร้างค่าสำหรับ `APP_KEYS` (4 ค่า), `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`

### 2.3 Backup ฐานข้อมูล SQLite (ถ้ามีข้อมูลเดิม)
```powershell
# ก่อน deploy ให้ backup ไว้ก่อน!
mkdir backup
copy backend\.tmp\data.db backup\data.db.bak
```

---

## ขั้นตอนที่ 3 — Build และ Deploy

```powershell
docker compose up -d --build
```

ตรวจสอบสถานะ:
```powershell
docker compose ps
# ต้องเห็น ctf-strapi และ ctf-nextjs อยู่ในสถานะ "running (healthy)"

docker compose logs -f
# ดู log แบบ real-time
```

---

## ขั้นตอนที่ 4 — ตั้งค่า Strapi หลัง Deploy

1. เปิดเบราว์เซอร์ไปที่ `http://[SERVER_IP]:1337/admin`
2. สร้าง Admin Account (ครั้งแรก)
3. ไปที่ **Settings → Users & Permissions → Roles → Public**
4. เปิด `find` และ `findOne` สำหรับ: `challenge`, `event`, `news`, `writeup`, `category`
5. กด **Save**

---

## คำสั่งที่ใช้บ่อย

```powershell
# หยุดทุก container
docker compose down

# หยุดและลบ Image ด้วย (สำหรับ rebuild ใหม่ทั้งหมด)
docker compose down --rmi all

# ดู log ของ backend เฉพาะตัว
docker compose logs backend -f

# เข้าไปใน container
docker exec -it ctf-strapi sh
```

---

## ⚠️ ข้อควรระวัง

- **อย่า** `docker compose down -v` — จะลบ Volume ทำให้ข้อมูล SQLite หายหมด
- ถ้า Strapi start ช้ามาก ให้เพิ่ม `start_period` ใน healthcheck
- ถ้าต้องการใช้ HTTPS ให้ติดตั้ง Nginx + Certbot เป็น Reverse Proxy ด้านหน้า
