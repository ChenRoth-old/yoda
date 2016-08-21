'use strict';
const path = require('path');
const rename = require('gulp-rename');

function prettyUrl(file) {
  file.extname = ".html";

  if (file.basename !== "index") {
    file.dirname = path.join(file.dirname, file.basename);
    file.basename = "index";
  }

  return file;
}

module.exports = function() {
  return rename(prettyUrl);
};