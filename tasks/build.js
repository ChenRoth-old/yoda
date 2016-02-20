'use strict';
const nunjucks = require('gulp-nunjucks');
const gulpMarked = require('gulp-marked-mustache');
const markdown = require('gulp-markdown');
const frontmatter = require('gulp-front-matter');

let BUILD_PATH = './build/';

module.exports = (gulp, metadata) => {
  gulp.task('build', ['metadata', 'clean'], () => {
    gulp.src('content/**/*.md')
      .pipe(frontmatter())
      .pipe(interpolate(metadata))
      .pipe(md2html())
      .pipe(gulp.dest(BUILD_PATH));
  });
}

function interpolate(metadata) {
  /**
   * template interpolation in md files
   * @param  {object} metadata data to interpolate
   * @return {Stream.Writable}          a writable stream to gulp.pipe to
   */

  return nunjucks.compile(metadata.fields);
}

function md2html() {
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
    //templatePath: './templates/',
    renderer: renderer

  });
}
