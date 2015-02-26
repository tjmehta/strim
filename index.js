'use strict';

var through = require('through');
var defaults = require('101/defaults');

module.exports = createStrim;

var streams = {
  removeLineTrailing: require('./lib/remove-line-trailing')(),
  removeBlankLines:   require('./lib/remove-blank-lines')()
};

/**
 * Create a strim - stream whitespace trimmer
 * @param {object} opts
 * @return {DuplexStream} strim - stream whitespace trimmer
 */
function createStrim (opts) {
  opts = defaults(opts);
  return [
    'removeLineTrailing',
    'removeBlankLines'
  ].reduce(function (stream, transform) {
    return opts[transform] ?
      stream.pipe(streams[transform]) :
      stream;
  }, through(identity));
}

function identity (data) {
  this.queue(data);
}
