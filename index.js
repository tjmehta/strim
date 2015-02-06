'use strict';

/**
 * [exports description]
 * @param  {object} opts
 * {
 *   removeLineLeading
 *   removeLineTrailing
 *   removeBlankLines
 * }
 * @return {DuplexStream} strim - stream whitespace trimmer
 */

var streams = {
  removeLineLeading  : require('remove-line-leading')(),
  removeLineTrailing : require('remove-line-trailing')(),
  removeBlankLines   : require('remove-blank-lines')()
};

module.exports = function createStrim (opts) {
  return [
    'removeLineLeading',
    'removeLineTrailing',
    'removeBlankLines'
  ].reduce(function (stream, transform) {
    return opts[transform] ?
      stream.pipe(streams[transform]) :
      stream;
  }, through(identity));
};

function identity (data) {
  this.queue(data);
}