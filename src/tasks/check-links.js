'use strict';
const checker = require('../gulp-plugins/check-links');

module.exports = (gulp, opts) => {
  gulp.task('check-links', checkLinks);

  function checkLinks(done) {
    return gulp.src('**/*.html', {
      cwd: opts.paths.build,
      since: gulp.lastRun('check-links')
    })
    .pipe(checker(opts.localServerUrl))
  };
  checkLinks.description = 'check links'
}