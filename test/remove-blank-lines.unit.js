'use strict';

var Code = require('code');
var Lab = require('lab');
var concat = require('concat-stream');

var lab = exports.lab = Lab.script();

var beforeEach = lab.beforeEach;
var describe = lab.describe;
var expect = Code.expect;
var it = lab.it;

describe('remove blank lines', function () {
  var ctx;
  beforeEach(function (done) {
    ctx = {};
    var data = ' \n\t\n\r\n \t\r\n';
    ctx.chunks = data.split('');
    ctx.expected = data.replace(/^[\s]*\n$/gm, '');
    done();
  });
  describe('strings', function () {
    it('should remove blank lines', shouldRemoveBlankLines);
  });
  describe('buffers', function () {
    beforeEach(function (done) {
      ctx.chunks = ctx.chunks.map(newBuffer);
      done();
    });
    // failing test
    it('should remove blank lines', shouldRemoveBlankLines);
  });
  function shouldRemoveBlankLines (done) {
    var replaceBlankLines = require('../lib/remove-blank-lines')();
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
