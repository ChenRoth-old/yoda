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

let BUILD_DIR = '/home/chen/code/build';

// try to load a predefined metadata
try {
  let initialMetadata = require('./content/metadata.json');
  metadata = new Metadata(initialMetadata);
} catch (e) {
  pretty(`metadata file wasn't found`);
}

require('./tasks/metadata')(gulp, metadata, opts);
require('./tasks/clean')(gulp, BUILD_DIR);
require('./tasks/build')(gulp, metadata, BUILD_DIR);

gulp.task('default', ['build']);

gulp.task('watch', () => {
  gulp.watch(['./content/**', './templates/**'], ['build']);
});
