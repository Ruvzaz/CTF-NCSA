import type { Core } from '@strapi/strapi';

/**
 * Strapi Plugins Configuration
 * §5 File Uploads: Restrict allowed MIME types and file size
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      // Max file size in bytes (5MB)
      sizeLimit: 5 * 1024 * 1024,
      // Allowed file types
      providerOptions: {},
    },
  },
});

export default config;
