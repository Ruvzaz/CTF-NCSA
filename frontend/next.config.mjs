/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend', // used in docker-compose
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '103.142.151.114', // VPS IP
        port: '1337',
        pathname: '/uploads/**',
      }, // 👈 [จุดที่แก้ไข] เติมวงเล็บปีกกาปิดตรงนี้ครับ
    ],
  },
  eslint: {
    // เตือน: การตั้งค่านี้จะทำให้ Next.js ยอม build ผ่านแม้จะมี ESLint error ก็ตาม
    ignoreDuringBuilds: true,
  },
  /**
   * §7 Security Headers
   * Configured per SECURITY_POLICIES.md
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent Clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Force HTTPS (1 year)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Referrer Policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Next.js requires unsafe-eval in dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: http://103.142.151.114:1337 http://localhost:1337",
              "connect-src 'self' http://103.142.151.114:1337 http://localhost:1337",
            ].join('; '),
          },
          // Prevent leaking info via Permissions-Policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // XSS Protection (legacy browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;