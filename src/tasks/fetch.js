'use strict';
const Download = require('download');
const path = require('path');
const fs = require('fs');
const promisify = require("promisify-node");

const verbose = require('./verbose');

module.exports = (gulp, basePath, sourcesPath) => {
  gulp.task(fetch);

  function fetch(done) {
    let sources = null;
    try {
      sources = require(sourcesPath);
    } catch (e) {
      verbose('no sources to fetch', 'Fetch');
      done();
      return;
    }
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
      if (fs.existsSync(destPath)) {
        verbose(`${destPath} already exists, skipping`, 'Fetch');
        return;
      }

      let pathIncludesFilenameMatch = destPath.match(/[^/]+\.\w+$/);
      let isSourceArchive = remotePath.match(/\.(zip|tar.gz|tar)$/)
      if (pathIncludesFilenameMatch && !isSourceArchive) {
        let fileName = pathIncludesFilenameMatch[0];
        destPath = path.dirname(destPath);
        downloadClient.get(remotePath, destPath).rename(fileName);
      } else {
        downloadClient.get(remotePath, destPath);
      }

      let promisedDownload = new Promise(function(resolve, reject) {
        downloadClient.run((err, files) => {
          if (err) {
            err = new Error(`couldn't fetch source ${remotePath}\n${err}`)
            reject(err);
            return;
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
      done()
    }, done);

  }

  fetch.description = 'fetch remote content referenced in sources.json'
}