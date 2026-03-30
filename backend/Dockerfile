# Stage 1: Build
FROM node:20-alpine AS build

# เพิ่ม python3 และ make เข้ามาเพื่อให้คอมไพล์ better-sqlite3 บน Linux ได้ผ่านฉลุย
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev python3 make > /dev/null 2>&1

WORKDIR /opt/app

# 1. ก๊อปปี้ทุกอย่างจากเครื่องเราเข้ามาก่อน
COPY . .

# 2. 📍 ท่าไม้ตาย: สั่งระเบิดโฟลเดอร์ node_modules ของ Windows ทิ้งไปเลย! (กันเหนียวสุดๆ)
RUN rm -rf node_modules build dist

# 3. ติดตั้ง Dependencies ใหม่ทั้งหมด ให้เป็นเวอร์ชันของ Linux 100%
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install

ENV NODE_ENV=production
RUN npm run build

# ==========================================

# Stage 2: Production
FROM node:20-alpine
RUN apk add --no-cache vips-dev
WORKDIR /opt/app

# ยกมาทั้งก้อนจาก Stage 1
COPY --from=build /opt/app ./

ENV NODE_ENV=production
ENV PATH=/opt/app/node_modules/.bin:$PATH

EXPOSE 1337
CMD ["npm", "run", "start"]