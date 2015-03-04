'use strict';

var combine = require('stream-combiner');
var defaults = require('101/defaults');

module.exports = createStrim;

var streams = {
  removeLineTrailing: require('./lib/remove-line-trailing'),
  removeBlankLines:   require('./lib/remove-blank-lines')
};

/**
 * Create a strim - stream whitespace trimmer
 * @return {DuplexStream} strim - stream whitespace trimmer
 */
function createStrim (opts) {
  var selectedStreams = [];
  var settings = {
    blank: true,
    trailing: true
  };
  settings = defaults(settings, opts);
  if (settings.blank) {
    selectedStreams.push(streams.removeBlankLines());
  }
  if (settings.trailing) {
    selectedStreams.push(streams.removeLineTrailing());
  }
  return combine.apply(this, selectedStreams);
}
