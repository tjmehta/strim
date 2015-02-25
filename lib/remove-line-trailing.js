'use strict';
var through = require('through');
var isString = require('101/is-string');
var concat   = Buffer.concat;
var isBuffer = Buffer.isBuffer;

var fullWhitespace = /^\s*$/;
var trailWhitespace = /^(.*[^\s]+)(\s+)$/;

module.exports = function () {
  var buffer = new Buffer(0);

  function write (data) {
    if (buffer.length) {
      data = isBuffer(data) ? data : new Buffer(data);
      data = concat([buffer, data]);
      buffer = new Buffer(0);
    }
    data = isString(data) ? data : data.toString();
    var lines = data.split('\n');
    var memo = { trimmed: [], bufferAppend: [] };
    memo = lines.reduce(removeLineTrailingWhitespace, memo);
    data = memo.trimmed.join('\n');
    buffer = concat([
      buffer,
      new Buffer(memo.bufferAppend.join(''))
    ]);

    this.queue(new Buffer(data));
  }

  function removeLineTrailingWhitespace (memo, line, i, lines) {
    var isLastLine = (i === (lines.length - 1));
    if (fullWhitespace.test(line)) {
      if (lines.length === 1) {
        memo.bufferAppend.push(line);
        return memo;
      }
      if (isLastLine) {
        memo.bufferAppend.push('\n');
        return memo;
      }
      else {
        line = '';
      }
    }
    var matches = line.match(trailWhitespace);
    if (matches) {
      memo.trimmed.push(matches[1]);
      memo.bufferAppend.push(matches[2]);
    }
    else {
      memo.trimmed.push(line);
    }
    return memo;
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
    this.queue(null); // end
  }

  return through(write, end);
};

