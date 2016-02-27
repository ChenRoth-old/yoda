#!/usr/bin/node

'use strict';
const gulp = require('gulp');
const prettyjson = require('prettyjson');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const path = require('path');
const fs = require('fs');
let quotes = [];
try {
  quotes = require('./yoda-quotes');
} catch (e) {}

const argv = require('yargs')
  .alias('v', 'verbose')
  .default({
    verbose: false
  })
  .demand('d')
  .alias('d', 'dir')
  .describe('verbose', 'show verbose output')
  .usage('Usage: yoda -d base_dir [-v]')
  .help('h')
  .argv;

const Metadata = require('./src/Metadata');
const pretty = (input) => {
  console && console.log(prettyjson.render(input));
}

let opts = {
  verbose: argv.verbose,
  base: path.resolve(argv.dir)
};

let paths = {
  base: opts.base,
  content: path.join(opts.base, 'content'),
  build: path.join(opts.base, 'build'),
  templates: path.join(opts.base, 'templates')
}
opts.paths = paths;

// check base dir exists before starting out
validateDirectoryExists(opts.paths.base);

// a pearl of wisdom for broadening your knowledge...
pretty(randomQuote(quotes));

let metadata = new Metadata();

// try to load a predefined metadata
try {
  let initialMetadata = require(path.join(opts.base, 'metadata.json'));
  metadata = new Metadata(initialMetadata);
} catch (e) {
  pretty(`metadata file wasn't found`);
}

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: opts.paths.build,
      directory: true
    }
  });
});

require('./tasks/metadata')(gulp, metadata, opts);
require('./tasks/clean')(gulp, opts);
require('./tasks/build')(gulp, metadata, opts);
require('./tasks/fetch')(gulp, opts.paths.content, path.join(opts.paths.base, 'sources.json'));

gulp.task('default', ['watch', 'browser-sync']);

gulp.task('watch', function() {
  gulp.watch([path.join(opts.paths.content, '**/*.md')], ['build']);
  gulp.watch([path.join(opts.paths.build, '**')]).on('changed', reload);
});

function validateDirectoryExists(dir) {
  try {
    fs.statSync(dir);
  } catch (e) {
    pretty(`${dir} doesn't exist`);
    process.exit(1);
  }
}

function randomQuote(quotes) {
  if (!quotes.length) {
    return;
  }
  let index = Math.floor(Math.random() * (quotes.length))
  return `${'Yoda'.green.bold} says, ${('“' + quotes[index] + '”').red}`;
}