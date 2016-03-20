'use strict';
const through = require('through2');
const frontmatter = require('gulp-front-matter');
const path = require('path');
const _ = require('lodash');
const verbose = require('../tasks/verbose');

module.exports = function processToc() {

  let tree = null;

  return through.obj(
    function transform(file, encoding, cb) {
      let isDraft = !!file.frontMatter.draft;
      if (isDraft) {
        verbose(`excluded draft: ${file.relative}`, 'TOC');
        return cb();
      }
      let url = '/' + file.relative.replace(/\.md$/, '.html');;
      let hierarchy = file.relative.split(path.sep).slice(0, -1);
      let title = file.frontMatter.title || file.stem;
      let keywords = file.frontMatter.keywords || [];
      let attributes = {
        title,
        url,
        keywords
      }
      tree = appendToTree(tree, hierarchy, attributes);
      return cb();
    },
    function flush(cb) {
      this.push(JSON.stringify(tree));
      cb();
    });
}

function appendToTree(root, hierarchy, attributes) {
  let tree = Object.assign({
    'name': 'root',
    'children': [],
  }, root);
  let pointer = tree;
  for (let level of hierarchy) {
    let next = _(pointer.children).find(function(dir) {
      return dir.title == level
    });
    if (next) {
      pointer = next;
    } else {
      pointer.children.push({
        'title': level,
        'children': [],
      });
      pointer = pointer.children[pointer.children.length - 1];
    }
  }
  pointer.children.push(attributes);
  return tree;
}