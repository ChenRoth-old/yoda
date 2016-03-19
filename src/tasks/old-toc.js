'use strict';
const gulpFileTree = require('gulp-file-tree');
const frontmatter = require('gulp-front-matter');
const path = require('path');

module.exports = (gulp, opts) => {
  gulp.task(toc);

  function transform(tree) {

    const path = require('path');

    return tree.traverse(function(node) {
      let file = node.data;
      let isFile = !!file.stem;
      let draft = isFile && file.frontMatter.draft;
      let url = '/' + file.relative.replace(/\.md$/, '.html');
      let title = isFile ? (file.frontMatter.title || file.stem) : path.basename(url);
      node.data = {
        url,
        title,
        draft
      }
      return node.data;
    });
  };


  function toc() {

    let gft = gulpFileTree({
      transform: transform,
      emitFiles: true,
      emitTree: 'toc'
    });


    return gulp.src('**/*.md', {
        cwd: opts.paths.content,
        since: gulp.lastRun('toc')
      })
      .pipe(frontmatter())
      .pipe(gft)
      .pipe(gulp.dest(path.join(opts.paths.base, '.toc')));
  };

  toc.description = 'build table of contents';
}