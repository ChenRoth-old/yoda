'use strict';
const gulp = require('gulp');
const git = require('gulp-git');
const marked = require('gulp-marked-mustache');
const del = require('del');
const path = require('path');
const nunjucks = require('gulp-nunjucks');

const getVersions = require('./tasks/get-versions');


let metadata = {};

// try to load a predefined metadata
try {
 metadata = require('./content/metadata.json');
}
catch (e) {
  console.warn(`metadata file wasn't found`);
}

let docsUrl = 'https://github.com/cloudify-cosmo/docs.getcloudify.org.git';
let BUILD_PATH = './build/';

function interpolate() {
  /**
   * template interpolation in md files
   * @param  {object} metadata data to interpolate
   * @return {Stream.Writable}          a writable stream to gulp.pipe to
   */
  return nunjucks.compile(metadata);
}

function md2html() {
  /**
   * the implementation detail of converting md files to html
   * @return {Stream.Writable}   a writable stream to gulp.pipe to
   */
  return marked({
    templatePath: './templates/'
  });
}

gulp.task('versions', (cb) => {
  getVersions(null, (err, versions) => {
    if (err) return cb(err);
    metadata.versions = versions;
    cb();
  });
});

gulp.task('metadata', ['versions'], (cb) => {
  console.log(metadata);
  cb();
});

gulp.task('build', ['metadata', 'clean'], () => {
  gulp.src('content/**/*.md')
    .pipe(interpolate())
    .pipe(md2html())
    .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('clean', () => {
  del(path.join(BUILD_PATH, '**'));
});

gulp.task('default', ['build']);

gulp.task('watch', () => {
  gulp.watch(['content/**', 'templates/**'], ['build']);
});
