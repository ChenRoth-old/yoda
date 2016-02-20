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
  return markdown({
    renderer: renderer
  });
}
