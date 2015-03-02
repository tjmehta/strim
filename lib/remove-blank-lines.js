/**
 * @module lib/remove-blank-lines
 */
'use strict';
var isString = require('101/is-string');
var through = require('through');
var last = require('101/last');

var fullWhitespace = /^[\s\t]*$/;

module.exports = function () {

  var lastChunkLastLine = null;
  var lastParsedChunk = null;
  var atLeastOneLine = false;

  return through(write);

  function toString (chunk) {
    return isString(chunk) ?
      chunk : chunk.toString();
  }

  function write (chunk) {
    var chunkString = toString(chunk);
    var lines = chunkString.split(/\r\n|\n/);
    if (lastChunkLastLine !== null) {
      // concatenate last line of previous chunk with
      // first line of current chunk
      lines[0] = lastChunkLastLine + lines[0];
    }
    lastChunkLastLine = last(lines);
    lines.splice(lines.length-1, 1); // -1, 1 is OK
    var trimmedLines = lines.filter(function (line) {
      return !fullWhitespace.test(line);
    });
    var parsedChunkString = trimmedLines.join('\n');
    /**
     * Must conditionally prepend output of this method with \n to properly divide string
     * 1. Both this and the lastast parsed chunk were at least 1 line and length > 0,
     *    must separate with \n
     * 2. There were chunks that consisted of entirely blank lines, but we've already
     *    seen a non-whitespace line and we must prepend \n to divide
     */
    if ((lastParsedChunk && parsedChunkString) ||
        (!lastParsedChunk && !lastChunkLastLine && parsedChunkString && atLeastOneLine)) {
      parsedChunkString = '\n' + parsedChunkString;
    }
    lastParsedChunk = parsedChunkString.substr(1); // remove the prepended \n
    if (lastParsedChunk) {
      // we have at least one line
      atLeastOneLine = true;
    }
    this.queue(parsedChunkString);
  }
};
