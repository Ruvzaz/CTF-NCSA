export default {
  routes: [
    {
      method: 'GET',
      path: '/statistics/global',
      handler: 'statistics.globalStats',
      config: {
        auth: false,
      },
    },
  ],
};
