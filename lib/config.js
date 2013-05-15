var grunt = require('spm-grunt');

function getConfig(options) {
  options = options || {};

  var style = require('grunt-cmd-transport').style;

  // grunt-cmd-transport, css to js
  options.css2jsParser = style.init(grunt).css2jsParser;

  // grunt-cmd-concat, js concat css
  options.css2js = style.css2js;

  var pkg = options.pkg || 'package.json';

  if (typeof pkg === 'string' && grunt.file.exists(pkg)) {
    pkg = grunt.file.readJSON(pkg);
    options.pkg = pkg
  }

  var data = distConfig(options, pkg);

  // import transport rules
  data.transport = transportConfig(options, pkg);
  data.clean = {build: ['.build'], dist: [options.dest]};
  return data;
}
exports.getConfig = getConfig;


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
  options.src = options.src || pkg.spm.source || 'src';
  options.idleading = options.idleading || pkg.spm.idleading;
  if (pkg.family && pkg.name && pkg.version) {
    options.idleading = options.idleading || (pkg.family + '/' + pkg.name + '/' + pkg.version + '/');
  }

  var spmConfig = {
    options: {
      alias: pkg.spm.alias || {}
    },
    files: [{
      cwd: options.src,
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
      cwd: '.build/tmp',
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
  return {src: spmConfig, css: cssConfig};
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
          dest: '.build/dist/' + name,
          src: output[name].map(function(key) {
            return '.build/tmp/' + key;
          })
        });

        // copy debug css
        name = name.replace(/\.css$/, '-debug.css');
        copies.push({
          cwd: '.build/tmp',
          src: name,
          expand: true,
          dest: '.build/dist'
        });

      } else if (/\.js$/.test(name)) {
        // concat js
        jsconcats['.build/tmp/' + name] = output[name].map(function(key) {
          return '.build/src/' + key;
        });

        jsmins.push({
          src: ['.build/tmp/' + name],
          dest: '.build/dist/' + name
        });

        // create debugfile
        jsconcats['.build/dist/' + name.replace(/\.js$/, '-debug.js')] = output[name].map(function(key) {
          return '.build/src/' + key.replace(/\.js$/, '-debug.js');
        });
      } else {
        copies.push({
          cwd: '.build/src',
          src: name,
          expand: true,
          dest: '.build/dist'
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
        dest: './build/dist'
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
        dest: './build/dist'
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
        dest: './build/dist'
      });
    }
  });

  // for concat
  options.include = grunt.option('include') || 'relative';
  return {
    concat: {
      // options should have css2js
      options: options,
      js: {files: jsconcats},
      css: {
        files: [{
          cwd: '.build/src',
          src: '**/*.css',
          expand: true,
          dest: '.build/tmp'
        }]
      }
    },
    cssmin: {
      options: {keepSpecialComments: 0},
      css: {files: cssmins}
    },
    uglify: {js: {files: jsmins}},
    copy: {
      build: {files: copies},
      dist: {
        files: [{
          cwd: '.build/dist',
          src: '**/*',
          expand: true,
          filter: 'isFile',
          dest: options.dest
        }]
      }
    }
  };
}
exports.distConfig = distConfig;
