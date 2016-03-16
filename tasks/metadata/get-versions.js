'use strict';
const subprocess = require('child_process').exec;
const verbose = require('../verbose');

function getVersions(repoUrl, cb) {
  repoUrl = repoUrl || 'https://github.com/cloudify-cosmo/cloudify-manager.git';
  subprocess(`git ls-remote ${repoUrl}`, (err, stdout, stderr) => {

    if (err) {
      cb && cb(stderr);
    }

    // filter out any branches that aren't *-build
    let refs = stdout.trim().split('\n').filter((ref) => {
      return ref.match(/-build$/);
    });

    // extract version from x.x.x-build
    let versions = refs.map((ref) => {
      let match = ref.match(/(\d+\.\d+(\.\d+)?)-build/);
      return match && match[1];
    }).filter((ref) => { return ref; });
    cb && cb(null, versions);
  });
}


module.exports = getVersions;

// run this file directly to demonstrate it
if (require.main === module) {
  getVersions(null, (err, versions) => {
    if (err) throw err;
    verbose(versions);
  });
}
