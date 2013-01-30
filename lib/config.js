/* generate config for grunt-spm-build */


function transport(options) {
  var srcdir = options.src || 'src';

  return {
    all: {
      options: {
        src: srcdir || 'src',
        dest: options.dest || 'tmp-transport'
      },
      src: [srcdir + '/**/*']
    }
  };
}
exports.transport = transport;


function concat(options) {
  var relativeFiles = {};
  var allFiles = {};
  var listFiles = {};

  var config = {
    src: options.src || 'tmp-transport',
    dest: options.dest || 'tmp-concat'
  };

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


function beautify(options) {
  var srcdir = options.src || 'tmp-concat';

  return {
    all: {
      options: {
        src: srcdir,
        dest: options.src || 'dist'
      },
      src: srcdir + '/**/*'
    }
  };
}
exports.beautify = beautify;


function cssminify(options) {
  var srcdir = options.src || 'tmp-concat';

  return {
    all: {
      options: {
        src: srcdir,
        dest: options.dest || 'dist'
      },
      src: srcdir + '/**/*.css'
    }
  }
}
exports.cssminify = cssminify;


function jsminify(options) {
  var srcdir = options.src || 'tmp-concat';

  return {
    all: {
      options: {
        src: srcdir,
        dest: options.dest || 'dist'
      },
      src: srcdir + '/**/*.js'
    }
  }
}
exports.jsminify = jsminify;
