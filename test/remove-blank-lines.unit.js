'use strict';

var Code = require('code');
var Lab = require('lab');
var async = require('async');
var concat = require('concat-stream');
var through = require('through');

var lab = exports.lab = Lab.script();

var beforeEach = lab.beforeEach;
var describe = lab.describe;
var expect = Code.expect;
var it = lab.it;

var equivalentDockerfiles = require('./fixtures/equivalent-dockerfiles');

describe('remove blank lines', function () {
  var ctx;

  describe('all combinations of chunks', function () {

    beforeEach(function (done) {
      ctx = {};
      var dockerfile = ctx.dockerfile = new Buffer(" \t\r\n \t\r\n \t\r\n \t\r\nFROM "+
                                  "dockerfile/nodejs \t\r\n \t\r\n "+
                                  "\t\r\n \t\r\nCMD tail -f /var/log/dpkg.log "+
                                  "\t\r\n \t\r\n \t\r\n \t\r\n");
      ctx.expected = "FROM dockerfile/nodejs \t\nCMD tail -f /var/log/dpkg.log \t";
      var chunkSets = ctx.chunkSets =  [];
      for (var i = 0; i+8 < dockerfile.length; i++) {
        var chunks = chunkSets[i] = [];
        if (i !== 0)  { chunks.push(dockerfile.slice(0, i)); }
        chunks.push(dockerfile.slice(i, i+8));
        chunks.push(dockerfile.slice(i+8, dockerfile.length));
      }
      done();
    });

    it('should correctly trim', function (done) {
      async.each(ctx.chunkSets, function (chunks, cb) {
        var replaceBlankLines = require('../lib/remove-blank-lines')();
        var data = '';
        replaceBlankLines.on('data', function (d) {
          data += d;
        });
        chunks.forEach(function (chunk) {
          replaceBlankLines.write(chunk);
        });
        replaceBlankLines.end();
        expect(data).to.equal(ctx.expected);
        cb();
      }, done);
    });
  });

  function toString (buffer) {
    return buffer.toString();
  }

});
