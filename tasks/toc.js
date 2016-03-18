'use strict';
const gulpFileTree = require('gulp-file-tree');
const frontmatter = require('gulp-front-matter');
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task(toc);

  function toc() {

    let gft = gulpFileTree({
      transform: function(tree) {
        return tree.traverse(function(node) {
          let file = node.data;
          node.data = {
            url: file.relative.replace(/\.md$/, '.html'),
            title: (file.frontMatter && file.frontMatter.title) || file.stem
          }
          return node.data;
        });
      },
      emitFiles: true,
      emitTree: 'toc'
    });

    return gulp.src('**/*.md', {
        cwd: opts.paths.content,
        since: gulp.lastRun('toc')
      })
      .pipe(frontmatter())
      .pipe(gft)
      .pipe(gulp.dest(opts.paths.base));
  };

  toc.description = 'build table of contents';
}