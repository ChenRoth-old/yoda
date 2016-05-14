'use strict';
const path = require('path');
const jslint = require('gulp-jslint');

module.exports = (gulp, opts) => {
  gulp.task(scripts);

  function scripts() {
    return gulp.src('**/*.js', {
        cwd: opts.paths.scripts,
        since: gulp.lastRun('scripts')
      })
      .pipe(jslint())
      // .pipe(jslint.reporter('default'))
      .pipe(gulp.dest(path.join(opts.paths.build, '_scripts')));
  };

  scripts.description = 'process all scripts source code';
}