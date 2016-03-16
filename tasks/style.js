'use strict';
const sass = require('gulp-sass');
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task(style);

  function style() {
    return gulp.src('**/*.scss', {
        cwd: opts.paths.style,
        since: gulp.lastRun('style')
      })
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(path.join(opts.paths.build, '_css')));
  };

  style.description = 'process all style source code';
}