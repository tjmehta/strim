'use strict';

var Code = require('code');
var Lab = require('lab');
var concat = require('concat-stream');

var lab = exports.lab = Lab.script();
var trailWhitespace = /^(.*[^\s]+)(\s+)$/;

var beforeEach = lab.beforeEach;
var describe = lab.describe;
var expect = Code.expect;
var it = lab.it;

describe('remove line leading whitespace', function () {
  var ctx;
  describe('blank lines', function () {
    beforeEach(function (done) {
      ctx = {};
      var data = ' \n\t\n\r\n \t\r\n';
      ctx.chunks = data.split('');
      ctx.expected = replaceLineTrailingWhitespaceInString(data);
      done();
    });
    describe('strings', function () {
      it('should trim blank lines', shouldTrimLines);
    });
    describe('buffers', function () {
      beforeEach(function (done) {
        ctx.chunks = ctx.chunks.map(newBuffer);
        done();
      });
      it('should trim blank lines', shouldTrimLines);
    });
  });
  describe('trailing whitespace lines', function () {
    beforeEach(function (done) {
      ctx = {};
      var data = [
        ' \n',
        '\t\n',
        '\r\n',
        ' \t\r\n',
        ' \n',
        'hey\t\n',
        'hey\r\n',
        'hey \t\r\n',
        '\they\n',
        '\rhey\n',
        ' \they'
      ];
      ctx.chunks = data;
      ctx.expected = replaceLineTrailingWhitespaceInString(data.join(''));
      done();
    });
    describe('strings', function () {
      it('should trim trailing whitespace', shouldTrimLines);
    });
    describe('buffers', function () {
      beforeEach(function (done) {
        ctx.chunks = ctx.chunks.map(newBuffer);
        done();
      });
      it('should trim trailing whitespace', shouldTrimLines);
    });
    describe('ends with whitespace after end line', function() {
      beforeEach(function (done) {
        ctx.chunks.push('\nhey ');
        ctx.expected += '\nhey';
        done();
      });
      describe('strings', function () {
        it('should trim trailing whitespace', shouldTrimLines);
      });
    });
  });
  function shouldTrimLines (done) {
    var replaceBlankLines = require('../lib/remove-line-trailing')();
    replaceBlankLines.pipe(concat(function (data) {
      expect(data.toString()).to.equal(ctx.expected);
      done();
    }));
    ctx.chunks.forEach(function (chunk) {
      replaceBlankLines.write(chunk);
    });
    replaceBlankLines.end();
  }
});

function newBuffer (s) {
  return new Buffer(s);
}

function replaceLineTrailingWhitespaceInString (str) {
  return str.split('\n').map(function (line) {
    return line.replace(trailWhitespace, '$1').replace(/^\s+$/, '');
  }).join('\n');
}
