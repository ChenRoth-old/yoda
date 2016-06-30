'use strict';
const Download = require('download');
const path = require('path');
const fs = require('fs-extra');
const promisify = require("promisify-node");
const _ = require('lodash');
const verbose = require('./verbose');
const os = require('os');
const uuid = require('uuid');
const untildify = require('untildify');

module.exports = (gulp, basePath, sourcesPath) => {
  gulp.task(fetch);

  function fetch(done) {
    let sources = null;
    try {
      sources = require(sourcesPath);
    } catch (e) {
      verbose(`no sources to fetch at ${sourcesPath}`, 'Fetch');
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

      let source = sources[targetPath];
      let url = null;
      let remotePath = null;

      if (_(source).isObject()) {
        url = source.url;
        remotePath = source.path
      } else {
        url = source;
      }

      let destPath = path.join(basePath, targetPath);
      if (fs.existsSync(destPath)) {
        verbose(`${destPath} already exists, skipping`, 'Fetch');
        return;
      }
      // remote http(s) source
      if (url.startsWith('http')) {

        let tmpdir = remotePath ? createRandomTmpDir() : null;
        downloadClient = new Download(downloadOpts);
        let pathIncludesFilenameMatch = destPath.match(/[^/]+\.\w+$/);
        let isSourceArchive = url.match(/\.(zip|tar.gz|tar)$/)
        if (pathIncludesFilenameMatch && !isSourceArchive) {
          let fileName = pathIncludesFilenameMatch[0];
          destPath = path.dirname(destPath);
          downloadClient.get(url, destPath).rename(fileName);
        } else {
          // download to temp dir or dest dir, depending on whether
          // remote path has been specified
          downloadClient.get(url, tmpdir || destPath);
        }

        let promisedDownload = new Promise(function(resolve, reject) {
          downloadClient.run((err, files) => {
            if (err) {
              err = new Error(`couldn't fetch source ${remotePath}\n${err}`)
              reject(err);
              return;
            }

            if (files.length == 1) {
              verbose(`downloaded ${url} => ${files[0].path}`, 'Fetch');
              resolve(files);
            } else {
              verbose(`extracted ${url} => ${files[0].dirname}:`, 'Fetch');
              files.forEach(function(file) {
                verbose(`${file.relative}`, 'Fetch');
              });
              // if a remote path has been specified, move only remote path
              // from tmp dir to dest dir
              if (remotePath) {
                fs.move(
                  path.join(tmpdir, remotePath),
                  destPath, {
                    clobber: true
                  },
                  function(err) {
                    // remove temp contents anyway
                    fs.removeSync(tmpdir);

                    if (err) {
                      reject(err);
                      return;
                    }

                    resolve(files);

                  });
              } else {
                resolve(files);
              }
            }
          });
        });

        promisedDownloads.push(promisedDownload);
      }
      // local filesystem source
      else {
        let localPath = untildify(url);
        let isSymbolic = source.symbolic || false;
        fs.mkdirpSync(path.dirname(destPath));
        isSymbolic ? fs.symlinkSync(localPath, destPath) : fs.copySync(localPath, destPath);
      }
    });

    Promise.all(promisedDownloads).then(function() {
      done()
    }, done);

  }

  fetch.description = 'fetch remote content referenced in a json file'
}

function createRandomTmpDir() {
  return path.join(os.tmpdir(), 'yoda', uuid.v4());
}