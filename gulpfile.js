'use strict';
const gulp = require('gulp');
const prettyjson = require('prettyjson');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const argv = require('yargs').argv;

const Metadata = require('./src/Metadata');
const pretty = (input) => {
  console && console.log(prettyjson.render(input));
}

let opts = {
  verbose: argv.verbose || false,
  output: argv.output || 'build'
};
let metadata = new Metadata();


// try to load a predefined metadata
try {
  let initialMetadata = require('./content/metadata.json');
  metadata = new Metadata(initialMetadata);
} catch (e) {
  pretty(`metadata file wasn't found`);
}

gulp.task('browser-sync', function() {
  browserSync.init(
    {
      server: {
        baseDir: 'build',
        directory: true
      }
    }
  );
});

require('./tasks/metadata')(gulp, metadata, opts);
require('./tasks/clean')(gulp, opts);
require('./tasks/build')(gulp, metadata, opts);
require('./tasks/fetch')(gulp, '/home/chen/code/yoda/content', '../content/sources.json');

gulp.task('default', ['watch', 'browser-sync']);

gulp.task('watch', function() {
  gulp.watch(['content/**/*.md'], ['build']);
  gulp.watch('build/**').on('changed', reload);
});
