'use strict';
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task(assets);

  function assets() {
    return gulp.src('**/*.*', {
        cwd: opts.paths.assets,
        since: gulp.lastRun('assets')
      })
      .pipe(gulp.dest(path.join(opts.paths.build, '_assets')));
  };

  assets.description = 'copy all assets';
}