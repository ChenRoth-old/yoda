'use strict';
const through = require('through2');
const nunjucks = require('nunjucks');
const str2stream = require('string-to-stream');
const path = require('path');
const gutil = require('gulp-util');
const util = require('util');

let env;

// TODO: unescaping nunjucks tags and passing the body as a nunjucks template
// to be {% include %}'d within the layout template
// is somehow causing re-compiling all files on a single file change
// this performance hit must be fixed

module.exports = function renderTemplate(templatesPath) {
  return through.obj(function(file, encoding, cb) {

    let template = (file.data && (file.data.template || 'default')) || null;

    // unescape html within nunjucks tags and compile body to a nunjucks template
    let body = nunjucks.compile(unescapeNunjucksTags(file.contents.toString()))

    // template data would be the file's metadata, with the file contents appended to it as 'body'
    let templateData = Object.assign({}, file.data, {
      url: '/' + file.relative.replace(/\.md$/, '.html').replace(/index\.html$/, ''),
      hierarchy: file.relative.split(path.sep).slice(0, -1),
      body
    });

    // load templates dir
    if (!env) {
      env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templatesPath, {
        watch: false // setting this to true causes the build task to hang
      }));
    }

    let onRender = function(err, output) {
      if (err) {
        err = new gutil.PluginError('renderTemplate', `${file.relative}\n${err.message}`);
        return cb(err);
      }
      // update file with the newly rendered content
      file.contents = str2stream(output);
      return cb(null, file);
    };

    if (template) {
      env.render(`${template}.html`, templateData, onRender);
    }
    else {
      env.renderString(file.contents.toString(), templateData, onRender);
    }
    
  });
}


function unescapeHtml(s) {
  return s
    .replace(/&#39;/g, '\'')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<');
}

function unescapeNunjucksTags(content) {
  let nunjucksTagsPattern = /({[{%]-? *.+ *-?[%}]})/g
  let tokens = content.split(nunjucksTagsPattern);
  for (let i = 1; i < tokens.length; i += 2) {
    tokens[i] = unescapeHtml(tokens[i]);
  }
  return tokens.join('');
}