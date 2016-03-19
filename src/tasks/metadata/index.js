const verbose = require('../verbose');
const getVersions = require('./get-versions');
const prettyjson = require('prettyjson');
const path = require('path');

// TODO: separate metadata task to local and remote retrieval, so local metadata can be watched and refreshed
module.exports = (gulp, metadata, opts) => {
  gulp.task('metadata', gulp.series('toc', metadataTask));

  function metadataTask() {
    verbose('preparing metadata...');
    metadata.prepare('versions', getVersions, 'https://github.com/cloudify-cosmo/cloudify-manager.git');
    metadata.prepare('env', process.env['NODE_ENV'] || 'development');
    metadata.prepare('toc', require(path.join(opts.paths.base, 'tree.json')));
    return metadata.ready((fields) => {
      verbose('\n' + prettyjson.render(fields), 'Metadata');
    });
  };
  metadataTask.displayName ='metadata';
  metadataTask.description = 'retrieve remote metadata'
}