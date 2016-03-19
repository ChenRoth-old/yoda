'use strict';
const nunjucks = require('gulp-nunjucks');

module.exports = function interpolate() {
  /**
   * template interpolation in md files using data from file.data
   * @return {Stream.Writable}          a writable stream to gulp.pipe to
   */

   return nunjucks.compile();
}
