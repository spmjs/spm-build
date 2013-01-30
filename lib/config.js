/* generate config for grunt-spm-build */


function transport(grunt, pkg, options) {
  if (!options) {
    options = pkg;
  }
  var srcdir = options.transportSrc || 'src';

  return {
    all: {
      options: {
        src: srcdir || 'src',
        dest: options.transportDest || 'tmp-transport'
      },
      src: [srcdir + '/**/*']
    }
  };
}
exports.transport = transport;


function concat(grunt, pkg, options) {
  var relativeFiles = {};
  var allFiles = {};
  var listFiles = {};

  var config = {
    src: options.concatSrc || 'tmp-transport',
    dest: options.concatDest || 'tmp-concat'
  };

  var output = pkg.spm ? pkg.spm.output || {} : {};
  grunt.util._.each(output, function(v, k) {
    if (v === '.') {
      relativeFiles[k] = config.src + '/' + k;
    } else if (v === '*') {
      allFiles[k] = config.src + '/' + k;
    } else if (grunt.util._.isArray(v)) {
      listFiles[k] = v.map(function(value) {
        return config.src + '/' + value;
      });
    } else if (grunt.util._.isString(v)) {
      listFiles[k] = [config.src + '/' + v];
    }
  });

  return {
    options: config,
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


function beautify(grunt, pkg, options) {
  if (!options) {
    options = pkg;
  }
  var srcdir = options.beautifySrc || 'tmp-concat';

  return {
    all: {
      options: {
        src: srcdir,
        dest: options.beautifyDest || 'dist'
      },
      src: srcdir + '/**/*'
    }
  };
}
exports.beautify = beautify;


function cssminify(grunt, pkg, options) {
  if (!options) {
    options = pkg;
  }
  var srcdir = options.minifySrc || 'tmp-concat';

  return {
    all: {
      options: {
        src: srcdir,
        dest: options.minifyDest || 'dist'
      },
      src: srcdir + '/**/*.css'
    }
  }
}
exports.cssminify = cssminify;


function jsminify(grunt, pkg, options) {
  if (!options) {
    options = pkg;
  }
  var srcdir = options.minifySrc || 'tmp-concat';

  return {
    all: {
      options: {
        src: srcdir,
        dest: options.minifyDest || 'dist'
      },
      src: srcdir + '/**/*.js'
    }
  }
}
exports.jsminify = jsminify;
