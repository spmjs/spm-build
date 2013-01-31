/* generate config for grunt-spm-build */


function init(grunt, options) {
  options = options || {};

  grunt.initConfig(config(options));
  grunt.registerTask(
    'spm-build',
    [
      'spm-transport', 'spm-concat', 'spm-beautify',
      'spm-css-minify', 'spm-js-minify'
    ]
  );
}
exports.init = init;


function config(options) {
  options = options || {};

  var paths = options.paths || ['sea-modules'];
  var pkg = options.pkg || 'package.json';
  var src = options.src || 'src';
  var dest = options.dest || 'dist';
  var suffix = options.suffix || '-debug';
  var uglify = options.uglify || {};
  var cleancss = options.cleancss || {};
  return {
    'spm-transport': transport({paths: paths, pkg: pkg, src: src}),
    'spm-concat': concat({paths: paths, pkg: pkg, dest: dest}),
    'spm-beautify': beautify({suffix: suffix, src: dest, dest: dest}),
    'spm-css-minify': cssminify({src: dest, dest: dest, cleancss: cleancss}),
    'spm-js-minify': jsminify({src: dest, dest: dest, uglify: uglify})
  };
}
exports.config = config;


function transport(options) {
  options = options || {};
  options.src = options.src || 'src';
  options.dest = options.dest || 'tmp-transport';

  return {
    all: {
      options: options,
      src: [options.src + '/**/*']
    }
  };
}
exports.transport = transport;


function concat(options) {
  options = options || {};
  options.src = options.src || 'tmp-transport';
  options.dest = options.dest || 'dist';

  var relativeFiles = {};
  var allFiles = {};
  var listFiles = {};

  var output = options.output;
  Object.keys(output).forEach(function(k) {
    var v = output[k];

    if (v === '.') {
      relativeFiles[k] = config.src + '/' + k;
    } else if (v === '*') {
      allFiles[k] = config.src + '/' + k;
    } else if (Array.isArray(v)) {
      listFiles[k] = v.map(function(value) {
        return config.src + '/' + value;
      });
    } else {
      listFiles[k] = [config.src + '/' + v];
    }
  });

  return {
    options: options,
    relative: {
      options: {
        type: 'relative'
      },
      files: relativeFiles
    },
    all: {
      options: {
        type: 'all'
      },
      files: allFiles
    },
    list: {
      files: listFiles
    }
  };
}
exports.concat = concat;


function beautify(options) {
  options = options || {};
  options.src = options.src || 'dist';
  options.dest = options.dest || 'dist';

  return {
    all: {
      options: options,
      src: options.src + '/**/*'
    }
  };
}
exports.beautify = beautify;


function cssminify(options) {
  options = options || {};
  options.src = options.src || 'dist';
  options.dest = options.dest || 'dist';

  return {
    all: {
      options: options,
      src: options.src + '/**/*.css'
    }
  }
}
exports.cssminify = cssminify;


function jsminify(options) {
  options = options || {};
  options.src = options.src || 'dist';
  options.dest = options.dest || 'dist';

  return {
    all: {
      options: options,
      src: options.src + '/**/*.js'
    }
  }
}
exports.jsminify = jsminify;
