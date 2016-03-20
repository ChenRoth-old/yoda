'use strict';
const _ = require('lodash');
const nunjucks = require('nunjucks');

module.exports = function renderTree(tree) {

  function traverse(node, depth) {
    let ret = [];
    if (depth) {
      ret.push(`<li node-depth="${depth}"><div class="node-body">`);
      if (node.children) {
        ret.push(`<label><i class="fa fa-fw"></i> <span>${node.title}</span></label>`);
      }
      else {
        ret.push(`<a href="${node.url}"><span>${node.title}</span></a>`);
      }
      ret.push('</div>');
    }
    if (node.children) {
      depth && ret.push('<ul class="node-children">');
      node.children.forEach(function(child) {
        ret = _.concat(ret, traverse(child, depth + 1));
      });
      depth && ret.push('</ul>');
    }
    ret.push('</li>');
    return ret;
  }

  let ret = [];
  ret.push('<div class="toc2"><ul class="root">');
  ret = _.concat(ret, traverse(tree, 0));
  ret.push('</ul></div>');
  return new nunjucks.runtime.SafeString(ret.join(''));
};