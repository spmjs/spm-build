'use strict';

var extname = require('path').extname;

exports.isJs = function(file) {
  return extname(file.path) === '.js';
};

exports.isCSS = function(file) {
  return extname(file.path) === '.css';
};
