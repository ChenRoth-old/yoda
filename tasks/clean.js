'use strict';
const del = require('del');
const path = require('path');

module.exports = (gulp, dest) => {
  gulp.task('clean', () => {
    del(path.join(dest, '**'));
  });
}
