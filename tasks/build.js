'use strict';
const frontmatter = require('gulp-front-matter');
const injectMetadata = require('../gulp-plugins/inject-metadata');
const interpolate = require('../gulp-plugins/interpolate');
const md2html = require('../gulp-plugins/md2html');
const renderTemplate = require('../gulp-plugins/render-template');
const path = require('path');

module.exports = (gulp, metadata, opts) => {
  gulp.task('build', ['metadata', 'fetch'], () => {
    gulp.src(path.join(opts.paths.content, '**/*.md'))
      .pipe(frontmatter())
      .pipe(injectMetadata(metadata))
      .pipe(interpolate())
      .pipe(md2html())
      .pipe(renderTemplate('/home/chen/code/yoda/templates'))
      .pipe(gulp.dest(opts.paths.build));
  });
}
