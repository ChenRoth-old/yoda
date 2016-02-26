'use strict';
const through = require('through2');
const nunjucks = require('nunjucks');
const str2stream = require('string-to-stream')

let env;

module.exports = function insertTemplate(templatesPath) {

  templatesPath = templatesPath || 'templates';
  return through.obj(function(file, encoding, cb) {

    let template = file.data.template || 'default';

    // template data would be the file's metadata, with the file contents appended to it as 'body'
    let templateData = Object.assign({}, file.data, {
      body: file.contents.toString().trim()
    });

    // load templates dir
    if (!env) {
      env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templatesPath));
    }

    // render file contents within template
    let output = env.render(`${template}.html`, templateData);

    // update file with the newly rendered content
    file.contents = str2stream(output);
    return cb(null, file);
  });
}