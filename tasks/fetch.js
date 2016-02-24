'use strict';
const Download = require('download');
const path = require('path');
const verbose = require('./verbose');

module.exports = (gulp, basePath, sourcesPath) => {
  gulp.task('fetch', () => {
    let sources = require(sourcesPath);
    let downloadClient = null

    let downloadOpts = {
      mode: '664',
      extract: true,
      strip: true
    };

    Object.keys(sources).forEach((targetPath) => {
      downloadClient = new Download(downloadOpts);
      let remotePath = sources[targetPath];
      let destPath = path.join(basePath, targetPath);

      let pathIncludesFilenameMatch = destPath.match(/[^/]+\.\w+$/);
      if (pathIncludesFilenameMatch) {
        let fileName = pathIncludesFilenameMatch[0];
        destPath = path.dirname(destPath);
        downloadClient.get(remotePath, destPath).rename(fileName);
      } else {
        downloadClient.get(remotePath, destPath);
      }

      downloadClient.run((err, files) => {
        if (err) {
          throw (err);
        }
        if (files.length == 1) {
          verbose(`* downloaded ${remotePath} => ${files[0].path}`);
        } else {
          verbose(`* extracted ${remotePath} => ${files[0].dirname}:`);
          files.forEach(function(file) {
            verbose(`- ${file.relative}`);
          });
        }
      });
    });
  });
}
