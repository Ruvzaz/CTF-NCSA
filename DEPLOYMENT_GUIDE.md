### Step 1: เตรียมเครื่อง Windows Server 2022
1. เชื่อมต่อเข้าเครื่องผ่าน **Remote Desktop (RDP)**
2. เปิด **PowerShell (Run as Administrator)** แล้วรันคำสั่งเพื่อติดตั้ง WSL2 (ฐานระบบรองรับ Docker):
   ```powershell
   wsl --install
   ```
   *(ทำการ Restart เครื่องหนึ่งครั้งเพื่อให้ระบบพร้อมใช้งาน)*

---

### Step 2: ติดตั้ง Docker
1. ดาวน์โหลดและติดตั้ง **[Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)**
2. ในตอนติดตั้ง ให้ติ๊กเลือก **"Use the WSL 2 based engine"** (เลือกตัวเลือกนี้สำคัญมาก!)
3. เมื่อติดตั้งเสร็จ ให้เปิดโปรแกรม Docker Desktop และรอจนกว่าสถานะด้านมุมซ้ายล่างจะเป็นสีเขียว (Engine Running)

---

### Step 3: นำโค้ดขึ้น Server
คุณสามารถใช้ **Git for Windows** หรือจะ Zip ไฟล์โปรเจกต์ทั้งหมดแล้วก๊อปปี้ไปวางในโฟลเดอร์ที่ต้องการได้เลยครับ (เช่น `C:\CTF-Portal`)

---

### Step 4: ตั้งค่ารหัสความลับ (.env)
เพื่อให้ระบบปลอดภัย คุณควรใช้รหัสผ่านที่สุ่มขึ้นมาใหม่ครับ (ห้ามใช้ 'random_key' ตามตัวอย่าง)

1. **วิธีสุ่มรหัสผ่าน (รันใน PowerShell ของคุณ):**
   ```powershell
   # รันคำสั่งนี้ซ้ำๆ เพื่อเอาค่าไปใส่ใน .env
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   ```

2. **สร้างไฟล์ `.env` ไว้ในโฟลเดอร์โปรเจกต์ และใส่ค่าดังนี้:**
   ```env
   # --- [1] Strapi Secrets (ส่วนของหลังบ้าน) ---
   # ใส่รหัสสุ่ม 4 ชุด คั่นด้วยเครื่องหมายจุลภาค (,)
   APP_KEYS=รหัสสุ่ม1,รหัสสุ่ม2,รหัสสุ่ม3,รหัสสุ่ม4
   # ใส่รหัสสุ่มยาวๆ ช่องละ 1 ชุด
   API_TOKEN_SALT=รหัสสุ่มยาวๆ
   ADMIN_JWT_SECRET=รหัสสุ่มยาวๆ
   TRANSFER_TOKEN_SALT=รหัสสุ่มยาวๆ
   JWT_SECRET=รหัสสุ่มยาวๆ

   # --- [2] Next.js Setup (ส่วนของหน้าบ้าน) ---
   # สำคัญมาก! เปลี่ยน your-server-ip เป็นเลข IP จริงของเครื่อง VPS คุณ (เช่น 103.xx.xx.xx)
   # หากรันเพื่อทดสอบในเครื่องตัวเอง ให้ใช้ http://localhost:1337
   NEXT_PUBLIC_STRAPI_URL=http://your-server-ip:1337

   # ค่านี้ให้ใส่ 'temporary_token' ไปก่อน แล้วค่อยกลับมาแก้ใน Step 6
   STRAPI_API_TOKEN=temporary_token
   ```

---

### Step 5: สั่งรันระะบบ (PowerShell)
เปิด PowerShell ในโฟลเดอร์โปรเจกต์แล้วรัน:

```powershell
docker-compose up -d --build
```
*ระบบจะเริ่มดาวน์โหลดและ Build ไฟล์ต่างๆ (อาจใช้เวลา 2-5 นาทีในครั้งแรก)*

---

### Step 6: ตั้งค่า API Token (ครั้งสุดท้าย!)
หลังจากระบบรันเสร็จ คุณต้องเชื่อม Next.js กับ Strapi:

1. เข้าเว็บไปที่ `http://your-server-ip:1337/admin`
2. สร้างไอดี Admin และล็อกอินเข้าไป
3. ไปที่ **Settings > API Tokens > Create new API Token**
   - **Name:** NextJS-Frontend
   - **Token duration:** Unlimited
   - **Token type:** Full Access
4. **Copy ค่า Token ที่ได้** มาเก็บไว้
5. กลับไปที่เครื่อง Server (SSH) แล้วแก้ไขไฟล์ `.env` อีกครั้ง:
   ```bash
   nano .env
   # แก้ไขบรรทัด STRAPI_API_TOKEN=ค่าที่ก๊อปมา
   ```
6. **สั่ง Restart เฉพาะหน้าบ้าน:**
   ```bash
   docker compose restart frontend
   ```

---

### 🎉 เรียบร้อย!
ตอนนี้คุณสามารถเข้าชมหน้าเว็บได้ที่ `http://your-server-ip:3000` และจัดการเนื้อหาได้ที่ `http://your-server-ip:1337/admin` ครับ!

**คำสั่งที่มีประโยชน์:**
- `docker compose logs -f`: ดู Log การทำงานถ้าเกิด Error
- `docker compose down`: สั่งหยุดการทำงานทั้งหมด
- `docker compose ps`: ดูสถานะว่า Container ตัวไหนรันอยู่บ้าง
