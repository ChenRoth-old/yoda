'use strict';
const frontmatter = require('gulp-front-matter');
const injectMetadata = require('../gulp-plugins/inject-metadata');
const interpolate = require('../gulp-plugins/interpolate');
const md2html = require('../gulp-plugins/md2html');

module.exports = (gulp, metadata, dest) => {
  gulp.task('build', ['metadata', 'clean'], () => {
    gulp.src('content/**/*.md')
      .pipe(frontmatter())
      .pipe(injectMetadata(metadata))
      .pipe(interpolate())
      .pipe(md2html())
      .pipe(gulp.dest(dest));
  });
}
