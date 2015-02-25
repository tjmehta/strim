'use strict';
var through = require('through');
var isString = require('101/is-string');
var last     = require('101/last');
var concat   = Buffer.concat;
var isBuffer = Buffer.isBuffer;

module.exports = function () {
  var buffer = new Buffer(0);
  return through(function (data) {
    if (buffer.length) {
      data = isBuffer(data) ? data : new Buffer(data);
      data = concat([buffer, data]);
      buffer = new Buffer(0);
    }
    data = isString(data) ? data : data.toString();
    data = data.split('\n').reduce(removeFullWhitespaceItems, '');
    if (last(data) === '\n') {
      data   = data.slice(0, -1);
      buffer = concat([ buffer, new Buffer('\n') ]);
    }
    this.queue(new Buffer(data));
  });
};

var fullWhitespace = /^\s$/;
function removeFullWhitespaceItems (joined, piece, i, pieces) {
  if (!fullWhitespace.test(piece)) {
    var delimeter = i === 0 ? '' : '\n';
    joined = joined + delimeter + piece;
  }
  if (i === pieces.length-1) {
    joined = joined.replace(/[\n]{2,}/g, '');
  }
  return joined;
}