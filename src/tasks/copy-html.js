'use strict';
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task(copyHtml);

  function copyHtml() {

    return gulp.src(path.join(opts.paths.content, '**/*.html'), {
        since: gulp.lastRun('copyHtml')
      })
      .pipe(gulp.dest(opts.paths.build));

  }

  copyHtml.description = 'copy all html files without any processing'
}