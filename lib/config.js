var grunt = require('spm-grunt');
var fs = require('fs');
var path = require('path');

function getConfig(options) {
  options = options || {};
  options.dest = options.dest || 'dist';

  var css2js = require('grunt-cmd-transport').css2js;

  // grunt-cmd-transport, css to js
  options.css2jsParser = css2js.init(grunt).cssParser;

  // grunt-cmd-concat, js concat css
  options.css2js = css2js.css2js;

  var pkg = options.pkg || 'package.json';

  if (typeof pkg === 'string' && grunt.file.exists(pkg)) {
    pkg = grunt.file.readJSON(pkg);
    options.pkg = pkg;
  }

  // import transport rules
  var transport = transportConfig(options, pkg);

  var data = distConfig(options, pkg);
  data.transport = transport;
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
  var hasHash = pkg.spm.hash === true;
  options.src = options.src || pkg.spm.source || 'src';
  options.idleading = options.idleading || pkg.spm.idleading;
  var defaultIdleading = hasHash ? (pkg.family + '/' + pkg.name + '/') :
    (pkg.family + '/' + pkg.name + '/' + pkg.version + '/');
  if (pkg.family && pkg.name && pkg.version) {
    options.idleading = options.idleading || defaultIdleading;
  }

  var spmConfig = {
    options: {
      styleBox: pkg.spm.styleBox,
      alias: pkg.spm.alias || {},
      debug: !hasHash,
      hash: hasHash
    },
    files: [{
      expand: true,
      cwd: options.src,
      src: '**/*',
      filter: 'isFile',
      dest: '.build/src'
    }]
  };

  // transport concated css into js
  var cssConfig = {
    options: {
      styleBox: pkg.spm.styleBox,
      alias: pkg.spm.alias || {},
      debug: false,
      parsers: {
        '.css': [options.css2jsParser]
      }
    },
    files: [{
      expand: true,
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
  var hasHash = pkg.spm.hash === true;

  var jsconcats = {};
  var jsmins = [], cssmins = [];
  var copies = [];

  console.log();
  if (Array.isArray(output)) {
    var ret = {};
    output.forEach(function(name) {
      ret[name] = [name];
      if (name.indexOf('*') === -1 && !fs.existsSync(path.join(options.src, name))) {
        grunt.log.warn('output ' + path.join(options.src, name) + ' not existed');
      }
    });
    output = ret;
  }

  if (!hasHash) {
  Object.keys(output).forEach(function(name) {
    var outs = output[name];
    if (!Array.isArray(outs)) {
      if (outs === '.') {
        outs = [name];
      } else {
        outs = [outs];
      }
    }

    if (name.indexOf('*') === -1) {
      if (/\.css$/.test(name)) {
        cssmins.push({
          dest: '.build/dist/' + name,
          src: outs.map(function(key) {
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
        jsconcats['.build/tmp/' + name] = outs.map(function(key) {
          return '.build/src/' + key;
        });

        jsmins.push({
          src: ['.build/tmp/' + name],
          dest: '.build/dist/' + name
        });

        // create debugfile
        jsconcats['.build/dist/' + name.replace(/\.js$/, '-debug.js')] = outs.map(function(key) {
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
        dest: '.build/dist'
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
        dest: '.build/dist'
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
        dest: '.build/dist'
      });
    }
  });
  } else {

    jsconcats = [
      // need compress
      // .build/src/xxx-{hash}.js => .build/tmp/xxx-{hash}.js
      {
        expand: true,
        cwd: '.build/src',
        src: '*.js',
        filter: function(src) {
          var m = src.match(/^.*\/((.*?)-[a-z0-9]{8}\.js)$/);
          if (!m) {
            return false;
          }
          return typeof output[m[2] + '.js'] !== 'undefined';
        },
        dest: '.build/tmp'
      },
      // .build/src/xxx.js => .build/dist/xxx.js
      {
        expand: true,
        cwd: '.build/src',
        src: '*.js',
        filter: function(src) {
          var m = src.match(/^.*\/(.*?\.js)$/);
          if (!m) {
            return false;
          }
          return typeof output[m[1]] !== 'undefined';
        },
        dest: '.build/dist'
      }
    ];

    // .build/tmp/xxx-{hash}.js => .build/dist/xxx-{hash}.js
    jsmins = [{
      expand: true,
      cwd: '.build/tmp',
      src: '*.js',
      dest: '.build/dist'
    }];

    // .build/tmp/xxx-{hash}.css => .build/dist/xxx-{hash}.css
    cssmins = [{
      expand: true,
      cwd: '.build/tmp',
      src: '*.css',
      filter: function(src) {
          var m = src.match(/^.*\/((.*?)-[a-z0-9]{8}\.css)$/);
          if (!m) {
            return false;
          }
          return typeof output[m[2] + '.js'] !== 'undefined';
        },
      dest: '.build/dist'
    }];

    copies = [
      // .build/tmp/xxx.css => .build/dist/xxx.js
      {
        expand: true,
        cwd: '.build/tmp',
        src: '*.css',
        filter: function(src) {
          var m = src.match(/^.*\/(.*?\.css)$/);
          if (!m) {
            return false;
          }
          return typeof output[m[1]] !== 'undefined';
        },
        dest: '.build/dist'
      },
      {
        expand: true,
        cwd: '.build/src',
        src: '*.*',
        filter: function(src) {
          return !/\.(js|css)$/.test(src);
        },
        dest: '.build/dist'
      }
    ];
  }

  // for concat
  options.include = grunt.option('include') || pkg.spm.include || 'relative';
  return {
    'spm-install': {
      options: {
        force: options.force
      }
    },
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
          dest: options.dest || 'dist'
        }]
      }
    }
  };
}
exports.distConfig = distConfig;
