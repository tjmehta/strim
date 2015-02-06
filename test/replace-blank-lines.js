'use strict';
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;
var concat = require('concat-stream');

describe('remove blank lines', function() {
  var ctx;
  before(function (done) {
    ctx = {};
    var data = ' \n\t\n\r\n \t\r\n';
    ctx.chunks = data.split('').map(newBuffer);
    ctx.expected = data.replace(/^[\s]*\n$/gm, '');
    done();
  });
  it('should remove blank lines', function(done) {
    var replaceBlankLines = require('../lib/replace-blank-lines')();
    replaceBlankLines.pipe(concat(function (data) {
      expect(data.toString()).to.equal(ctx.expected);
      done();
    }));
    ctx.chunks.forEach(function (chunk) {
      replaceBlankLines.write(chunk);
    });
    replaceBlankLines.end();
  });
});

function newBuffer (s) {
  return new Buffer(s);
}