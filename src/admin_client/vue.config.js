module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.plugin('html').tap(args => {
        args[0].fbConfig = `
          <script>
            window.__FIREBASE_CONFIG__ = {{{fbConfig.stringify}}};
          </script>
        `;
        return args;
      });
    }
  },
  outputDir: '../../dist/admin_client',
  baseUrl: process.env.NODE_ENV === 'development' ? '/' : '/admin/'
};
