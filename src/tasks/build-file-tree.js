'use strict';
const frontmatter = require('gulp-front-matter');
const path = require('path');
const processTree = require('../gulp-plugins/build-file-tree');

module.exports = (gulp, opts) => {
  gulp.task('build-file-tree', buildFileTree);

  function buildFileTree() {
    return gulp.src('**/*.md', {
        cwd: opts.paths.content
      })
      .pipe(frontmatter())
      .pipe(processTree());
  }
}