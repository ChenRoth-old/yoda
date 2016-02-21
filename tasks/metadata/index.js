const verbose = require('../verbose');
const getVersions = require('./get-versions');

module.exports = (gulp, metadata) => {
  gulp.task('metadata', () => {
    verbose('preparing metadata...');
    metadata.prepare('versions', getVersions, 'https://github.com/cloudify-cosmo/docs.getcloudify.org.git');
    metadata.prepare('env', process.env['NODE_ENV'] || 'development');
    return metadata.ready((fields) => {
      verbose(metadata);
    });
  });
}
