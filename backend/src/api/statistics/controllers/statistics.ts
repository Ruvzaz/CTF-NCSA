export default {
  async globalStats(ctx: any) {
    try {
      // Direct raw count queries bypassing permissions safely on the backend
      const usersCount = await strapi.db.query('plugin::users-permissions.user').count();
      const challengesCount = await strapi.db.query('api::challenge.challenge').count();
      const submissionsCount = await strapi.db.query('api::submission.submission').count();
      
      // We only return anonymous aggregate data
      ctx.send({
        users: usersCount,
        challenges: challengesCount,
        submissions: submissionsCount,
        ping: 'ok'
      });
    } catch (err: any) {
      ctx.throw(500, err);
    }
  }
};
