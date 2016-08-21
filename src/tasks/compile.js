'use strict';
const frontmatter = require('gulp-front-matter');
const injectMetadata = require('../gulp-plugins/inject-metadata');
const interpolate = require('../gulp-plugins/interpolate');
const md2html = require('../gulp-plugins/md2html');
const skipDraft = require('../gulp-plugins/skip-draft');
const prettyUrl = require('../gulp-plugins/pretty-url');
const gutil = require('gulp-util');

const renderTemplate = require('../gulp-plugins/render-template');
const path = require('path');

module.exports = (gulp, metadata, opts) => {
  gulp.task(compile);
  gulp.task('compile:all', compileAll);

  function compile(compileAll) {
    // compile only added/changed files by default
    var compileAll = compileAll || false;

    return gulp.src(path.join(opts.paths.content, '**/*.md'), {
        follow: true,
        since: compileAll ? null : gulp.lastRun('compile')
      })
      .pipe(frontmatter())
      .pipe(injectMetadata(metadata))
      .pipe(skipDraft())
      .pipe(md2html())
      .pipe(renderTemplate(opts))
      .pipe(opts.prettyUrl ? prettyUrl() : gutil.noop())
      .pipe(gulp.dest(opts.paths.build));

  }

  function compileAll() {
    return compile.call(this, true);
  }
  compileAll.description = 'process all content files by interpolating placeholders with metadata and converting to html'
  compile.description = 'process added/changed content files by interpolating placeholders with metadata and converting to html'
}