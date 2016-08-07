'use strict';
const awspublish = require('gulp-awspublish');
const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const parallelize = require('concurrent-transform');

module.exports = (gulp, opts) => {
  gulp.task(publish);

  function publish() {

    let accessKeyId = process.env.YODA_AWS_ACCESS_ID;
    let secretAccessKey = process.env.YODA_AWS_SECRET_KEY;
    let bucket = process.env.YODA_AWS_BUCKET;
    let region = process.env.YODA_AWS_REGION;
    if (!accessKeyId) {
      throw new gutil.PluginError('publish', `YODA_AWS_ACCESS_ID env var is undefined`);
    }
    else if (!secretAccessKey) {
      throw new gutil.PluginError('publish', `YODA_AWS_SECRET_KEY env var is undefined`);
    }
    else if (!bucket) {
      throw new gutil.PluginError('publish', `YODA_AWS_BUCKET env var is undefined`);
    }
    else if (!region) {
      throw new gutil.PluginError('publish', `YODA_AWS_REGION env var is undefined`);
    }

    // create a new publisher using S3 options
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    let publisher = awspublish.create({
      region,
      accessKeyId,
      secretAccessKey,
      params: {
        Bucket: bucket
      }
    });

    // define custom headers
    let headers = {
      'Cache-Control': 'max-age=315360000, no-transform, public'
        // ...
    };

    return gulp.src(path.join(opts.paths.build, '**'))

    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(parallelize(publisher.publish(headers), 10))

    // create a cache file to speed up consecutive uploads
    // .pipe(publisher.cache())

    // print upload updates to console
    .pipe(awspublish.reporter());

  };

  publish.description = 'publish build to AWS S3';

}