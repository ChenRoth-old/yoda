'use strict';
const through = require('through2');
const path = require('path');
const _ = require('lodash');
const verbose = require('../tasks/verbose');
const blc = require('broken-link-checker');

var brokenLinks = [];

module.exports = function checkLinks(baseUrl) {
  return through.obj(
    function transform(file, encoding, cb) {

      let checker = new blc.HtmlChecker({ excludeExternalLinks: true }, {
        link: function(result) {
          if (result.broken) {
            let url = result.url.resolved,
              reason = blc[result.brokenReason] || result.brokenReason,
              line = result.html.location.line,
              col = result.html.location.col;
            let error = `${file.relative.white} [${line.toString().white}:${col.toString().white}] ${url.red.bold} is broken (${reason})`;
            verbose(error, 'Check link')
            brokenLinks.push(error);
          }
        },
        complete: function() {
          cb && cb();
        }
      });
      checker.scan(file.contents.toString(), baseUrl, cb);
    },
    function flush(cb) {
      this.push(brokenLinks.join('\n'));
      cb && cb();
    });
}