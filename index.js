'use strict';

var through = require('through');

module.exports = createStrim;

var streams = {
  removeLineTrailing: require('./lib/remove-line-trailing')(),
  removeBlankLines:   require('./lib/remove-blank-lines')()
};

/**
 * Create a strim - stream whitespace trimmer
 * @return {DuplexStream} strim - stream whitespace trimmer
 */
function createStrim () {
  return through(identity)
    .pipe(streams.removeBlankLines)
    .pipe(streams.removeLineTrailing);
/*
  return [
    'removeLineTrailing',
    'removeBlankLines'
  ].reduce(function (stream, transform) {
    return stream.pipe(streams[transform]);
  }, through(identity));
*/
}

function identity (data) {
  this.queue(data);
}
