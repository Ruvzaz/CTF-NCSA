import type { Core } from '@strapi/strapi';

/**
 * Strapi Middlewares Configuration
 * Configured per SECURITY_POLICIES.md:
 * - CORS: Whitelist only frontend origins
 * - Security (Helmet): X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy
 * - Rate Limiting: via custom middleware (see ./middlewares/rate-limit.ts)
 */
const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  // §7 Security Headers (Helmet)
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'script-src': ["'self'"],
          upgradeInsecureRequests: null,
        },
      },
      xframe: 'DENY',                        // Prevent Clickjacking
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xContentTypeOptions: 'nosniff',         // Prevent MIME sniffing
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    },
  },
  // §1 CORS Configuration
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        // Add production domain here: 'https://ctf.example.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  // §5 File Upload Size Limit
  {
    name: 'strapi::body',
    config: {
      formLimit: '5mb',    // Form body limit
      jsonLimit: '5mb',    // JSON body limit
      textLimit: '5mb',    // Text body limit
      formidable: {
        maxFileSize: 5 * 1024 * 1024, // 5MB max file upload
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
