'use strict';

var combine = require('stream-combiner');

module.exports = createStrim;

var streams = {
  removeLineTrailing: require('./lib/remove-line-trailing'),
  removeBlankLines:   require('./lib/remove-blank-lines')
};

/**
 * Create a strim - stream whitespace trimmer
 * @return {DuplexStream} strim - stream whitespace trimmer
 */
function createStrim () {
  return combine(streams.removeBlankLines(),
    streams.removeLineTrailing());
}
