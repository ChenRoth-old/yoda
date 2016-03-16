const verbose = require('../verbose');
const getVersions = require('./get-versions');
const prettyjson = require('prettyjson');

module.exports = (gulp, metadata) => {
  gulp.task('metadata', metadataTask);

  function metadataTask() {
    verbose('preparing metadata...');
    metadata.prepare('versions', getVersions, 'https://github.com/cloudify-cosmo/cloudify-manager.git');
    metadata.prepare('env', process.env['NODE_ENV'] || 'development');
    return metadata.ready((fields) => {
      verbose('\n' + prettyjson.render(fields), 'Metadata');
    });
  };
  metadataTask.displayName ='metadata';
  metadataTask.description = 'retrieve remote metadata'
}