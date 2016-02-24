'use strict';
const del = require('del');
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task('clean', () => {
    return del(opts.output);
  });
}
