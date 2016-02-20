const through = require('through2');

module.exports = function injectMetadata(metadata) {

  return through.obj(function(file, encoding, cb) {

    // copy global metadata and override with file's local metadata
    file.data = Object.assign({}, metadata.fields, file.frontMatter);
    cb(null, file);
  });
}
