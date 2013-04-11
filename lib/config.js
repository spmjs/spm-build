function initConfig(grunt, options, deepMerge) {
  var path = require('path');
  process.on('log.warn', function(msg) {
    grunt.log.warn('warn ' + msg);
  });
  process.on('log.info', function(msg) {
    grunt.log.writeln('info ' + msg);
  });

  options = options || {};

  var style = require('grunt-cmd-transport').style;

  // grunt-cmd-transport, css to js
  options.css2jsParser = style.init(grunt).css2jsParser;

  // grunt-cmd-concat, js concat css
  options.css2js = style.css2js;

  var pkg = options.pkg || 'package.json';
  if (grunt.util._.isString(pkg)) {
    pkg = grunt.file.readJSON(pkg);
  }
  options.pkg = pkg;

  var data = distConfig(options, pkg);

  // import transport rules
  data.transport = transportConfig(options, pkg);
  data.clean = {spm: ['.build'], dist: ['dist']};

  // deepMerge should merge to target
  if (deepMerge) {
    grunt.util._.merge(data, grunt.config.data);
    grunt.config.data = data;
  } else {
    grunt.util._.defaults(grunt.config.data, data);
  }

  grunt.registerTask('spm-install', function() {
    var done = this.async();
    try {
      var spm = require('spm');
      spm.install({query: []}, done);
    } catch (e) {
      grunt.log.warn('spm ' + e.message || e);
    }
  });

  grunt.registerTask('newline', function() {
    grunt.file.recurse('dist', function(f) {
      var extname = path.extname(f);
      if (extname === '.js' || extname === '.css') {
        var text = grunt.file.read(f);
        if (!/\n$/.test(text)) {
          grunt.file.write(f, text + '\n');
        }
      }
    });
  });

  grunt.registerTask(
    'spm-build', [
      'clean:dist', // delete dist direcotry first

      'spm-install', // install dependencies

      // build css
      'transport:spm',  // src/* -> .build/src/*
      'concat:css',   // .build/src/*.css -> .build/dist/*.css

      // build js (must be invoke after css build)
      'transport:css',  // .build/dist/*.css -> .build/src/*.css.js
      'concat:js',  // .build/src/* -> .build/dist/*.js

      // to dist
      'copy:spm',
      'cssmin:css',   // .build/dist/*.css -> dist/*.css
      'uglify:js',  // .build/dist/*.js -> dist/*.js

      'clean:spm',
      'newline'
  ]);
}

exports.initConfig = initConfig;

// transport everything:
//
// grunt.initConfig({
//   options: {
//     ...
//     pkg: pkg
//   },
//   files: [{
//     cwd: 'src',
//     src: '**/*',
//     filter: 'isFile',
//     dest: '.build/src
//   }]
// });
//
// transport concated css into js:
//
// grunt.initConfig({
//   options: {
//     ...
//     idleading: family/name/version/,
//     parsers: {
//       '.css': [css2jsParser]
//     },
//     files: [{
//       cwd: '.build/dist',
//       src: '**/*.css',
//       filter: 'isFile',
//       dest: '.build/src'
//     }]
//   }
// })
function transportConfig(options, pkg) {
  options = options || {};
  pkg = pkg || {spm: {}};
  if (!pkg.spm) {
    pkg.spm = {};
  }
  options.source = options.source || pkg.spm.source || 'src';
  options.idleading = options.idleading || pkg.spm.idleading;
  if (pkg.family && pkg.name && pkg.version) {
    options.idleading = options.idleading || (pkg.family + '/' + pkg.name + '/' + pkg.version + '/');
  }

  var spmConfig = {
    options: {
      alias: pkg.spm.alias || {}
    },
    files: [{
      cwd: options.source,
      src: '**/*',
      filter: 'isFile',
      dest: '.build/src'
    }]
  };

  // transport concated css into js
  var cssConfig = {
    options: {
      alias: pkg.spm.alias || {},
      parsers: {
        '.css': [options.css2jsParser]
      }
    },
    files: [{
      cwd: '.build/dist',
      src: '**/*.css',
      filter: 'isFile',
      dest: '.build/src'
    }]
  };
  ['paths', 'idleading', 'debug', 'handlebars', 'uglify'].forEach(function(key) {
    if (options.hasOwnProperty(key)) {
      spmConfig.options[key] = options[key];
      cssConfig.options[key] = options[key];
    }
  });
  return {spm: spmConfig, css: cssConfig};
}
exports.transportConfig = transportConfig;


// concat every css
//
// grunt.initConfig({
//   options: {
//     ...
//     paths: []
//   },
//   files: [{
//     cwd: '.build/src',
//     src: '**/*.css',
//     expand: true,
//     dest: '.build/dist'
//   }]
// })
//

function distConfig(options, pkg) {
  if (!pkg.spm) {
    process.emit('log.warn', 'missing `spm` in package.json');
    process.emit('log.info', 'read the docs at http://docs.spmjs.org/en/package');
    pkg.spm = {};
  }

  var output = pkg.spm.output || {};

  var jsconcats = {};
  var jsmins = [], cssmins = [];
  var copies = [];

  if (Array.isArray(output)) {
    var ret = {};
    output.forEach(function(name) {
      ret[name] = [name];
    });
    output = ret;
  }

  Object.keys(output).forEach(function(name) {
    if (name.indexOf('*') === -1) {
      if (/\.css$/.test(name)) {
        cssmins.push({
          dest: 'dist/' + name,
          src: output[name].map(function(key) {
            return '.build/dist/' + key;
          })
        });

        // copy debug css
        name = name.replace(/\.css$/, '-debug.css');
        copies.push({
          cwd: '.build/dist',
          src: name,
          expand: true,
          dest: 'dist'
        });

      } else if (/\.js$/.test(name)) {
        // concat js
        jsconcats['.build/dist/' + name] = output[name].map(function(key) {
          return '.build/src/' + key;
        });

        jsmins.push({
          src: ['.build/dist/' + name],
          dest: 'dist/' + name
        });

        // create debugfile
        jsconcats['dist/' + name.replace(/\.js$/, '-debug.js')] = output[name].map(function(key) {
          return '.build/src/' + key.replace(/\.js$/, '-debug.js');
        });
      } else {
        copies.push({
          cwd: '.build/src',
          src: name,
          expand: true,
          dest: 'dist'
        });
      }
    } else {
      copies.push({
        cwd: '.build/src',
        src: name,
        filter: function(src) {
          if (/-debug\.(js|css)$/.test(src)) {
            return true;
          }
          return !/\.(js|css)$/.test(src);
        },
        expand: true,
        dest: 'dist'
      });
      jsmins.push({
        cwd: '.build/src',
        src: name,
        filter: function(src) {
          if (/-debug.js$/.test(src)) {
            return false;
          }
          return /\.js$/.test(src);
        },
        expand: true,
        dest: 'dist'
      });
      cssmins.push({
        cwd: '.build/src',
        src: name,
        filter: function(src) {
          if (/-debug.css$/.test(src)) {
            return false;
          }
          return /\.css$/.test(src);
        },
        expand: true,
        dest: 'dist'
      });
    }
  });

  // for concat
  options.include = 'relative';
  return {
    concat: {
      // options should have css2js
      options: options,
      js: {files: jsconcats},
      css: {
        files: [{
          cwd: '.build/src/',
          src: '**/*.css',
          expand: true,
          dest: '.build/dist'
        }]
      }
    },
    cssmin: {
      options: {keepSpecialComments: 0},
      css: {files: cssmins}
    },
    uglify: {js: {files: jsmins}},
    copy: {spm: {files: copies}}
  };
}
exports.distConfig = distConfig;
