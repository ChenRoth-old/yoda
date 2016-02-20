'use strict';
const del = require('del');
const path = require('path');

let BUILD_PATH = './build/';

module.exports = (gulp) => {
  gulp.task('clean', () => {
    del(path.join(BUILD_PATH, '**'));
  });
}
