'use strict';
const del = require('del');
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task('clean', (cb) => {
    return del(path.join(opts.output, '/**/*.*'));
  });
}
