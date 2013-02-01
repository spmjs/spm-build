var path = require('path');

exports.lib = function() {
  if (process.env.SPM_COVERAGE) {
    return require(path.resolve(__dirname, '../lib-cov'));
  }
  return require(path.resolve(__dirname, '../lib'));
};

exports.loadTasks = function(grunt) {
  grunt.log.muted = true;
  var tasks = path.resolve(__dirname, '../tasks');
  if (process.env.SPM_COVERAGE) {
    grunt.loadTasks(tasks + '-cov');
  } else {
    grunt.loadTasks(tasks);
  }
};
