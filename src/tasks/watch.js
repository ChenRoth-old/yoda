'use strict';
const del = require('del');
const path = require('path');
const browserSync = require('browser-sync');

const verbose = require('./verbose');

module.exports = (gulp, opts) => {

  gulp.task(watch);

  function watch() {

    let assetsWatcher = gulp.watch('**/*.*', {
      cwd: opts.paths.assets
    },
    gulp.task('assets'));
    
    // watch for content changes
    let contentWatcher = gulp.watch('**/*.md', {
        cwd: opts.paths.content
      },
      gulp.task('compile'));

    contentWatcher.on('unlink', delBuildFile);

    // watch for style changes
    let styleWatcher = gulp.watch('**/*.scss', {
        cwd: opts.paths.style
      },
      gulp.task('style'));

    let templatesWatcher = gulp.watch('**/*.html', {
        cwd: opts.paths.templates
      },
      gulp.task('compile:all'));

    // watch for script changes
    let scriptsWatcher = gulp.watch('**/*.js', {
        cwd: opts.paths.scripts
      },
      gulp.task('scripts'));

    // reload browser on changes in build
    gulp.watch([path.join(opts.paths.build, '**')]).on('change', browserSync.get('browser').reload);
  }

  watch.description = 'watch changes in content and style files and process them again'


  function delBuildFile(srcPath) {
    /**
    receives a relative path of a source file and deletes its corresponding built file
    */
    let buildPath = path.join(opts.paths.build, srcPath).replace(/\.\w+$/, '.html');
    verbose(`File ${buildPath} was removed`);
    del(buildPath, {
      force: true
    });
  }
};