exports.lib = function() {
  if (process.env.COVERAGE) {
    return require('../lib-cov');
  }
  return require('../lib');
};

exports.loadTasks = function(grunt) {
  grunt.log.muted = true;
  var tasks = __dirname + '/../tasks';
  if (process.env.COVERAGE) {
    grunt.loadTasks(tasks + '-cov');
  } else {
    grunt.loadTasks(tasks);
  }
};
