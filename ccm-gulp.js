var through = require('through2');
var fs = require('fs');
var ccm = require('./ccm');

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    callback(null, ccm(file.contents, file.path));
  });
};