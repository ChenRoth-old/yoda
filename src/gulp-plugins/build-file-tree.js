'use strict';
const through = require('through2');
const frontmatter = require('gulp-front-matter');
const path = require('path');
const _ = require('lodash');
const util = require('util');
const verbose = require('../tasks/verbose');

module.exports = function processTree() {

  return through.obj(function(file, encoding, cb) {

    let url = file.relative;
    let hierarchy = file.relative.split(path.sep).slice(0, -1);
    // console.log(hierarchy);
    let title = file.frontMatter.title || file.basename.replace(/\.\w+$/, '');
    let isDraft = !!file.frontMatter.draft;
    if (!isDraft) {
      appendToTree(null, hierarchy, title, url);
    }
    else {
      verbose(`excluded draft: ${file.relative}`, 'BuildFileTree');
    }
    return cb();
  });
}

function appendToTree(ref, hierarchy, title, url) {
  let tree = Object.assign({
    'name': 'root',
    'directories': [],
    'files': []
  }, ref);
  let pointer = tree;
  for (let level of hierarchy) {
    let next = _(pointer.directories).find(function(dir) {
      return dir.name == level
    });
    if (next) {
      pointer = next;
    } else {
      pointer.directories.push({
        'name': level,
        'directories': [],
        'files': []
      });
      pointer = pointer.directories[pointer.directories.length - 1];
    }
  }
  pointer.files.push({
    title,
    url
  });
  return tree;
}