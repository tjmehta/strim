'use strict';

var through = require('through');
var defaults = require('101/defaults');

/**
 * Create a strim - stream whitespace trimmer
 * @param  {object} opts
 * @param  {boolean} opts.removeLineTrailing - whether line-trailing whitespace
 * @param  {boolean} opts.removeBlankLines   - whether or not to remove blank lines
 * @return {DuplexStream} strim - stream whitespace trimmer
 */

var streams = {
  // TODO: removeLineLeading  : require('remove-line-leading')(),
  trimLineTrailing : require('trim-line-trailing')(),
  trimBlankLines   : require('trim-blank-lines')()
};

module.exports = function createStrim (opts) {
  opts = defaults(opts)
  return [
    // TODO: 'removeLineLeading',
    'trimLineTrailing',
    'trimBlankLines'
  ].reduce(function (stream, transform) {
    return opts[transform] ?
      stream.pipe(streams[transform]) :
      stream;
  }, through(identity));
};

function identity (data) {
  this.queue(data);
}