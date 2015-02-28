/**
 * @module lib/remove-blank-lines
 */
'use strict';
var equals = require('101/equals');
var isString = require('101/is-string');
var last = require('101/last');
var through = require('through');

var concat = Buffer.concat;
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
    console.log('p3', data.split(/\r\n|\n/));
    data = data.split(/\r\n|\n/).reduce(removeFullWhitespaceItems, '');
    console.log('p4', data.split(/\r\n|\n/));
    if (last(data) === '\n') {
      console.log('data last is \\n');
      data   = data.slice(0, -1);
      buffer = concat([ buffer, new Buffer('\n') ]);
    }
    this.queue(new Buffer(data));
  });
};

var fullWhitespace = /^[\s\t]*$/;
function removeFullWhitespaceItems (joined, piece, i, pieces) {
  if (!fullWhitespace.test(piece)) {
    // we found some text
    //   if yes, do not split with \n
    var delimeter = equals(i, 0) ? '' : '\n';
    joined = joined + delimeter + piece;
  }
  if (i === pieces.length-1) {
    joined = joined
      .replace(/^\n/, '')
      .replace(/[\n]{2,}/g, '');
  }
  return joined;
}
