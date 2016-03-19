'use strict';
const gulpIgnore = require('gulp-ignore');

module.exports = function skipDraft() {
  /**
   * a gulp plugin for skipping files with data.draft == true
   * @type {[type]}
   */
  let file = arguments[0];
  return gulpIgnore.exclude((file) => {
    return file.data && !!file.data.draft;
  });
}