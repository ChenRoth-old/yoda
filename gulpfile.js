'use strict';
const gulp = require('gulp');
const prettyjson = require('prettyjson');
const argv = require('yargs').argv;

const Metadata = require('./src/Metadata');
const pretty = (input) => {
  console && console.log(prettyjson.render(input));
}

let opts = {
  verbose: argv.verbose
};
let metadata = new Metadata();

// try to load a predefined metadata
try {
  let initialMetadata = require('./content/metadata.json');
  metadata = new Metadata(initialMetadata);
} catch (e) {
  pretty(`metadata file wasn't found`);
}

require('./tasks/metadata')(gulp, metadata, opts);
require('./tasks/clean')(gulp, opts);
require('./tasks/build')(gulp, metadata, opts);

gulp.task('default', ['build']);

gulp.task('rebuild', () => {
  console.log(metadata);
})

gulp.task('watch', ['build'], () => {
    gulp.watch(['content/**', 'templates/**'], ['rebuild']);
});

// gulp.task('watch', () => {
//   gulp.watch(['content/**', 'templates/**'], ['build']);
// });
