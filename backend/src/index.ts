import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const publicPermissions = [
          'api::category.category.find',
          'api::category.category.findOne',
          'api::news.news.find',
          'api::news.news.findOne',
          'api::event.event.find',
          'api::event.event.findOne',
          'api::writeup.writeup.find',
          'api::writeup.writeup.findOne',
        ];

        for (const action of publicPermissions) {
          const permission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({ where: { role: publicRole.id, action } });

          if (!permission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id,
              },
            });
          }
        }
        strapi.log.info('Public permissions bootstrap complete.');
      }
    } catch (error) {
      strapi.log.error('Bootstrap permissions error:', error);
    }
  },
};
