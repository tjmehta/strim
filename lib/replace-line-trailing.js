'use strict';
var through = require('through');
var isString = require('101/is-string');
var concat   = Buffer.concat;
var isBuffer = Buffer.isBuffer;

var fullWhitespace = /^\s*$/;
var trailWhitespace = /^(.*[^\s]+)(\s+)$/;
var blacklight = require('blacklight');

module.exports = function () {
  var buffer = new Buffer(0);

  function write (data) {
    if (buffer.length) {
      data = isBuffer(data) ? data : new Buffer(data);
      data = concat([buffer, data]);
      buffer = new Buffer(0);
    }
    data = isString(data) ? data : data.toString();
    var pieces = data.split('\n');
    data = pieces.reduce(removeTrailingWhitespace, '');
    this.queue(new Buffer(data));
  }

  function removeTrailingWhitespace (joined, piece, i, pieces) {
    var delimeter = i === 0 ? '' : '\n';
    var isLastPiece = (i === (pieces.length - 1));
    if (fullWhitespace.test(piece)) {
      if (pieces.length === 1) {
        buffer = concat([buffer, new Buffer(piece)]);
        return joined;
      }
      if (isLastPiece) {
        buffer = concat([buffer, new Buffer(delimeter)]);
        return joined;
      }
      else {
        piece = '';
      }
    }
    var matches = piece.match(trailWhitespace);
    if (matches) {
      joined += delimeter + matches[1];
      buffer = concat([buffer, new Buffer(matches[2])]);
    }
    else {
      joined += delimeter + piece;
    }
    return joined;
  }

  function end () {
    if (buffer.length) {
      var bufferStr = buffer.toString();
      var endlines = bufferStr.match(/\n/g);
      // buffer will only contain whitespace, trim it to endlines only
      if (endlines) {
        this.queue(new Buffer(endlines.join('')));
      }
    }
    this.queue(null);
  }

  return through(write, end);
};

