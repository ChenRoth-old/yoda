#!/usr/bin/node

'use strict';
const gulp = require('gulp');
const prettyjson = require('prettyjson');
const browserSync = require('browser-sync').create('browser');
const path = require('path');
const fs = require('fs');

const verbose = require('./tasks/verbose');

let quotes = [];
try {
  quotes = require('./yoda-quotes');
} catch (e) {}

const argv = require('yargs')
  .alias('v', 'verbose')
  .default({
    verbose: false,
    silent: true,
    port: 3000,
    sources: 'sources.json'
  })
  .demand('d')
  .alias('d', 'dir')
  .describe('sources', 'specify a json file path to fetch sources')
  .describe('verbose', 'show verbose output')
  .describe('port', 'local web server port for site preview')
  .usage('Usage: yoda -d base_dir [-v]')
  .help('h')
  .argv;

const Metadata = require('./Metadata');
const pretty = (input) => {
  console && console.log(prettyjson.render(input));
}

let opts = {
  verbose: argv.verbose,
  localServerPort: argv.port,
  localServerUrl: `http://localhost:${argv.port}`,
  base: path.resolve(argv.dir),
};

opts.sourcesFile = path.resolve(opts.base, argv.sources);

let paths = {
  base: opts.base,
  content: path.join(opts.base, 'content'),
  scripts: path.join(opts.base, 'scripts'),
  style: path.join(opts.base, 'style'),
  build: path.join(opts.base, 'build'),
  assets: path.join(opts.base, 'assets'),
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
  verbose(`metadata file wasn't found`, 'Metadata');
}

gulp.task('browser-sync', browserSyncTask);

function browserSyncTask(done) {
  browserSync.init({
    server: {
      baseDir: opts.paths.build,
      //directory: true
    },
    port: opts.localServerPort,
    ui: false,
    logLevel: opts.verbose ? 'info' : 'silent',
    notify: false

  }, done);
}
browserSyncTask.description = 'live preview of your website in the browser!'

require('./tasks/assets')(gulp, opts);
require('./tasks/style')(gulp, opts);
require('./tasks/scripts')(gulp, opts);
require('./tasks/toc')(gulp, opts);
require('./tasks/metadata')(gulp, metadata, opts);
require('./tasks/clean')(gulp, opts);
require('./tasks/fetch')(gulp, opts.paths.base, opts.sourcesFile);
require('./tasks/compile')(gulp, metadata, opts);
require('./tasks/watch')(gulp, opts);
require('./tasks/check-links')(gulp, opts);

// register 'build' task
let build = gulp.series('clean', gulp.series('fetch', 'metadata'), gulp.parallel('compile', 'assets', 'style', 'scripts'));
build.displayName = 'build';
build.description = 'clean, fetch remote metadata and content, compile content and process style';
gulp.task(build);

// register 'default' task
let defaultTask = gulp.series('build', gulp.parallel('browser-sync', 'watch'));
defaultTask.description = 'build and watch';
gulp.task('default', defaultTask);

gulp.task('check-live-links', gulp.series('browser-sync', 'check-links'));

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