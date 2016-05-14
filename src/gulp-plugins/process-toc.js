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
      let excludeFromToc = !!file.frontMatter.hidetoc;
      if (excludeFromToc) {
        verbose(`excluded from TOC: ${file.relative}`, 'TOC');
        return cb();
      }
      let url = '/' + file.relative.replace(/\.md$/, '.html');;
      let hierarchy = file.relative.split(path.sep).slice(0, -1);
      let title = file.frontMatter.title || file.stem;
      let keywords = file.frontMatter.keywords || [];
      let weight = file.frontMatter.weight || 0;
      let attributes = {
        title,
        url,
        keywords,
        weight
      }
      tree = appendToTree(tree, hierarchy, attributes);
      return cb();
    },
    function flush(cb) {
      // sort tree by weight and name
      sortTreeRecursive(tree);

      this.push(JSON.stringify(tree));
      cb();
    });
}

function sortTreeRecursive(node) {
  if (!node.children) {
    return;
  }

  node.children.forEach(function(child) {
    sortTreeRecursive(child);
  })
  node.children.sort(sortBranch);
}

function appendToTree(root, hierarchy, attributes) {
  let tree = Object.assign({
    'title': 'root',
    'children': [],
  }, root);
  let pointer = tree;
  let depth = 0;
  for (let level of hierarchy) {
    let next = _(pointer.children).find(function(dir) {
      return dir.name == level
    });
    if (next) {
      pointer = next;
    } else {
      pointer.children.push({
        title: level.replace('_', ' '),
        name: level,
        children: [],
        weight: 0,
        depth: depth
      });
      pointer = pointer.children[pointer.children.length - 1];
    }
    depth++;
  }
  pointer.children.push(attributes);
  return tree;
}

function sortBranch(node1, node2) {
  if (node1.weight < node2.weight) {
    return -1;
  } else if (node1.weight > node2.weight) {
    return 1;
  } else if (node1.url < node2.url) {
    return -1;
  } else if (node1.url > node2.url) {
    return 1;
  }
  return 0;
}