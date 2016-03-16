'use strict';
const Download = require('download');
const path = require('path');
const promisify = require("promisify-node");

const verbose = require('./verbose');

module.exports = (gulp, basePath, sourcesPath) => {
  gulp.task(fetch);

  function fetch(done) {
    let sources = require(sourcesPath);
    let downloadClient = null

    let downloadOpts = {
      mode: '664',
      extract: true,
      strip: true
    };

    let promisedDownloads = [];

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

      let promisedDownload = new Promise(function(resolve, reject) {
        downloadClient.run((err, files) => {
          if (err) {
            reject(err);
          }
          if (files.length == 1) {
            verbose(`downloaded ${remotePath} => ${files[0].path}`, 'Fetch');
          } else {
            verbose(`extracted ${remotePath} => ${files[0].dirname}:`, 'Fetch');
            files.forEach(function(file) {
              verbose(`${file.relative}`, 'Fetch');
            });
          }

          resolve(files);

        });
      });

      promisedDownloads.push(promisedDownload);

    });

    Promise.all(promisedDownloads).then(function() {
      done();
    });

  }

  fetch.description = 'fetch remote content referenced in sources.json'
}