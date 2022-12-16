export const server = (done) => {
  app.plugins.browsersync.init({
    server: {
      baseDir: `${app.path.build.html}`
    },
    browser: 'firefox',
    notify: false,
    port: 3000,
  });
}
