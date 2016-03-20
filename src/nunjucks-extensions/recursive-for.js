'use strict';
const nunjucks = require('nunjucks');

module.exports = function RecursiveForExtension() {
  var self = this;

  self.tags = ['recursivefor'];

  self.parse = function(parser, nodes, lexer) {

    var tok = parser.nextToken();

    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    var body_recursiveif = parser.parseUntilBlocks('recursiveif', 'recursive', 'endrecursiveif', 'endrecursivefor');

    if (parser.skipSymbol('recursiveif')) {
      parser.skip(lexer.TOKEN_BLOCK_END);
      var body_recursive = parser.parseUntilBlocks('recursive');
    }

    if (parser.skipSymbol('recursive')) {
      parser.skip(lexer.TOKEN_BLOCK_END);
      var body_endrecursiveif = parser.parseUntilBlocks('endrecursiveif');
    }

    if (parser.skipSymbol('endrecursiveif')) {
      parser.skip(lexer.TOKEN_BLOCK_END);
      var body_endrecursivefor = parser.parseUntilBlocks('endrecursivefor');
    }

    parser.advanceAfterBlockEnd();

    //See above for notes about CallExtension
    return new nodes.CallExtension(this, 'run', args, [body_recursiveif, body_recursive, body_endrecursiveif, body_endrecursivefor]);
  };

  self.run = function(context, args, body_recursiveif, body_recursive, body_endrecursiveif, body_endrecursivefor) {

    let ret = [];

    let recursionHandler = function(node) {

      context.ctx.node = node;
      let bodyProcess = body_recursiveif();
      let endBodyProcess = body_endrecursivefor();
      ret.push(bodyProcess);
      if (node.children) {
        node.children.forEach(function(child) {
          ret.push(body_recursive());
          recursionHandler(child);
        })
      }
      ret.push(body_endrecursiveif());
      ret.push(endBodyProcess)
    }

    recursionHandler(args);

    return new nunjucks.runtime.SafeString(ret.join(''));
  };
}