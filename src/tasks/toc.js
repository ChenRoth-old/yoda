'use strict';
const frontmatter = require('gulp-front-matter');
const path = require('path');
const processTree = require('../gulp-plugins/process-toc');
const fs = require('fs');

module.exports = (gulp, opts) => {
  gulp.task('toc', toc);

  function toc() {
    return gulp.src('**/*.md', {
        follow: true,
        cwd: opts.paths.content
      })
      .pipe(frontmatter())
      .pipe(processTree())
      .pipe(fs.createWriteStream(path.join(opts.paths.base, 'tree.json')));
  }

  toc.description = 'build table of contents';
}