'use strict';
const markdown = require('gulp-markdown');

module.exports = function md2html() {
  /**
   * the implementation detail of converting md files to html
   * @return {Stream.Writable}   a writable stream to gulp.pipe to
   */

  let renderer = new markdown.marked.Renderer();
  renderer.table = function(header, body) {
    return `<div class="table"> \
              <table> \
                <thead>${header}</thead> \
                <tbody>${body}</tbody> \
              </table>\
            </div>`;
  }

  // modify the rule for inline link parsing to support nunjucks within
  // link url
  let pattern = /^!?\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\( *((?:{{[^}]*}})|(?:[^{})]*)) *\)/ig
  markdown.marked.prototype.constructor.Parser.prototype.parse = function(src) {
    this.inline = new markdown.marked.InlineLexer(src.links, this.options);
    this.inline.rules.link = pattern;
    this.tokens = src.reverse();
    var out = '';
    while (this.next()) {
      out += this.tok();
    }
    return out;
  };


  return markdown({
    renderer
  });
}