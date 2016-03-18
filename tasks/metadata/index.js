const verbose = require('../verbose');
const getVersions = require('./get-versions');
const prettyjson = require('prettyjson');
const path = require('path');

module.exports = (gulp, metadata, opts) => {
  gulp.task('metadata', metadataTask);

  function metadataTask() {
    verbose('preparing metadata...');
    metadata.prepare('versions', getVersions, 'https://github.com/cloudify-cosmo/cloudify-manager.git');
    metadata.prepare('env', process.env['NODE_ENV'] || 'development');
    metadata.prepare('toc', require(path.join(opts.paths.base, 'toc.json')));
    return metadata.ready((fields) => {
      verbose('\n' + prettyjson.render(fields), 'Metadata');
    });
  };
  metadataTask.displayName ='metadata';
  metadataTask.description = 'retrieve remote metadata'
}