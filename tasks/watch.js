'use strict';
const del = require('del');
const path = require('path');
const browserSync = require('browser-sync');

const verbose = require('./verbose');

module.exports = (gulp, opts) => {

  gulp.task('watch', () => {
    let sourceWatcher = gulp.watch('**/*.md', {
        cwd: opts.paths.content
      },
      gulp.task('compile'));
    sourceWatcher.on('unlink', delBuildFile);

    gulp.watch([path.join(opts.paths.build, '**')]).on('change', browserSync.get('browser').reload);
  });

  function delBuildFile(srcPath) {
    /**
    receives a relative path of a source file and deletes its corresponding built file
    */
    let buildPath = path.join(opts.paths.build, srcPath).replace(/\.\w+$/, '.html');
    verbose(`File ${buildPath} was removed`);
    del(buildPath);
  }
};