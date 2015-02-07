'use strict';
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var expect = Code.expect;
var concat = require('concat-stream');

describe('remove line trailing whitespace', function () {
  var ctx;
  describe('blank lines', function () {
    beforeEach(function (done) {
      ctx = {};
      var data = ' \n\t\n\r\n \t\r\n';
      ctx.chunks = data.split('');
      ctx.expected = data.replace(/([^\s]*)((?!\n)\s)+$/gm, '$1');
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
        // ' \n',
        // '\t\n',
        // '\r\n',
        // ' \t\r\n',
        // ' \n',
        // 'hey\t\n',
        // 'hey\r\n',
        // 'hey \t\r\n',
        '\they\n',
        // '\rhey\n',
        // ' \they\r\n'
      ].join('');
      ctx.chunks = data.split('');
      ctx.expected = [
        // '\n',
        // '\n',
        // '\n',
        // '\n',
        // '\n',
        // 'hey\n',
        // 'hey\n',
        // 'hey\n',
        '\they\n',
        // '\rhey\n',
        // ' \they\n'
      ].join('');
      done();
    });
    describe('strings', function () {
      it('should trim trailing whitespace', shouldTrimLines);
    });
    // describe('buffers', function () {
    //   beforeEach(function (done) {
    //     ctx.chunks = ctx.chunks.map(newBuffer);
    //     done();
    //   });
    //   it('should trim trailing whitespace', shouldTrimLines);
    // });
  });
  function shouldTrimLines (done) {
    var replaceBlankLines = require('../lib/replace-line-trailing')();
    replaceBlankLines.pipe(concat(function (data) {
      console.log(
        data.toString()
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t'),
        ctx.expected
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
      );
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