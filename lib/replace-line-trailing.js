'use strict';
var through = require('through');
var isString = require('101/is-string');
var concat   = Buffer.concat;
var isBuffer = Buffer.isBuffer;

var fullWhitespace = /^((?!\n)\s)+$/;
var trailWhitespace = /((?!\n)\s)+$/;

module.exports = function () {
  var buffer = new Buffer(0);
  return through(function (data) {
    if (buffer.length) {
      console.log('B "'+ buffer.toString().replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r') + '"');
      console.log('D "'+ data.toString().replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r') + '"');
      data = isBuffer(data) ? data : new Buffer(data);
      data = concat([buffer, data]);
    }
    data = isString(data) ? data : data.toString();
    var pieces = data.split('\n');
    var lastPiece = pieces.pop();
    if (fullWhitespace.test(lastPiece)) {
      buffer = concat([ buffer, new Buffer('\n'+lastPiece) ]);
    }
    else {
      lastPiece = lastPiece.replace(trailWhitespace, '');
      pieces.push(lastPiece);
    }
    data = pieces.reduce(removeFullWhitespaceItems, '');
    console.log('C "'+ data.toString().replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r') + '"');
    this.queue(new Buffer(data));
  });
};

function removeFullWhitespaceItems (joined, piece, i, pieces) {
  if (!fullWhitespace.test(piece)) {
    console.log('not full whitespace', '"' + piece + '"');
    var delimeter = i === 0 ? '' : '\n';
    joined = joined + delimeter + piece;
  }
  if (i === pieces.length-1) {
    joined = joined.replace(/[\n]{2,}/g, '');
  }
  return joined;
}