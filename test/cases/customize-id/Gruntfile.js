module.exports = function(grunt) {
  var pkg = grunt.file.readJSON(__dirname + '/package.json');

  var init = require('../../_init')

  init.lib().init(grunt, {pkg: pkg});
  init.loadTasks(grunt);

  grunt.registerTask('build', ['spm-build']);
};
