function initConfig(grunt, options) {
  options = options || {};
  var pkg = options.pkg || 'package.json';
  if (grunt.util._.isString(pkg)) {
    pkg = grunt.file.readJSON(pkg);
  }
  options.pkg = pkg;

  var data = distConfig(pkg);
  data.transport = transportConfig(options, pkg);
  data.clean = {spm: ['.build']};

  grunt.util._.defaults(grunt.config.data, data);

  grunt.registerTask(
    'spm-build', [
      'transport:spm', 'concat:spm', 'uglify:spm', 'copy:spm',
      'clean:spm'
  ]);
}

module.exports = initConfig;

function transportConfig(options, pkg) {
  options = options || {};
  pkg = pkg || {spm: {}};
  options.source = options.source || pkg.spm.source;
  var config = {
    options: {
      pkg: pkg
    },
    files: [{
      cwd: options.source || 'src',
      src: '**/*',
      dest: '.build'
    }]
  };
  ['paths', 'format', 'debug', 'uglify'].forEach(function(key) {
    if (options.hasOwnProperty(key)) {
      config.options[key] = options[key]
    }
  });
  return {spm: config};
}

function distConfig(pkg) {
  var output = pkg.spm.output;

  var concats = {}, uglifies = {}, copies = [];
  output.forEach(function(name) {
    if (name.indexOf('*') === -1) {
      concats['dist/' + name] = ['.build/' + name];
      uglifies['dist/' + name] = ['dist/' + name];

      // debugfile
      name = name.replace(/\.js$/, '-debug.js');
      concats['dist/' + name] = ['.build/' + name];
    } else {
      copies.push({
        cwd: '.build',
        src: name,
        expand: true,
        dest: 'dist'
      })
    }
  });
  return {
    concat: {spm: {files: concats}},
    uglify: {spm: {files: uglifies}},
    copy: {spm: {files: copies}},
  }
}
