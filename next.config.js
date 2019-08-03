const withCSS = require('@zeit/next-css');
const withWorkers = require('@zeit/next-workers');

module.exports = withWorkers(
  withCSS({
    webpack(config, { isServer }) {
      if (!isServer) {
        // Without this, web workers doesn't work properly
        config.output.globalObject = 'self';
      }

      return config;
    }
  })
);
