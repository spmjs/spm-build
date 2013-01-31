/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

var ast = require('cmd-util').ast;
var iduri = require('cmd-util').iduri;
var path = require('path');


module.exports = function(grunt) {

  grunt.registerMultiTask('spm-concat', 'Concat modules to one file.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      paths: ['sea-modules'],
      pkg: 'package.json',
      type: 'list',
      dest: 'tmp-concat'
    });

    if (grunt.util._.isString(options.pkg)) {
      options.pkg = grunt.file.readJSON(options.pkg);
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(fileObj) {
      // Only concat js, css, and tpl
      if (!/\.(js|css|tpl)$/.test(fileObj.dest)) return;
      var destfile = path.join(options.dest, fileObj.dest);

      // The source files to be concatenated. The "nonull" option is used
      // to retain invalid files/patterns so they can be warned about.
      var files = grunt.file.expand({nonull: true}, fileObj.src);
      grunt.log.writeln('Concating "' + files + '" => ' + destfile);

      // Concat specified files.
      var data = files.map(function(filepath) {
        // Warn if a source file/pattern was invalid.
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return '';
        }
        return grunt.file.read(filepath);
      }).join('\n\n');

      if ((options.type === 'relative' || options.type === 'all') && files.length === 1) {
        grunt.log.write('Including: ');
        data = concat(data, files[0], options);
        grunt.log.ok();
      }

      // Write the destination file.
      grunt.file.write(destfile, data);
    });
  });

  function concat(data, fpath, options) {
    if (!/\.js$/.test(fpath)) return data;

    var meta = ast.parseFirst(data), filepath;

    var rv = meta.dependencies.map(function(id) {
      if (id.charAt(0) === '.') {

        filepath = path.join(path.dirname(fpath), iduri.appendext(id));
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return '';
        }
        grunt.log.write(filepath + ' ');
        return grunt.file.read(filepath);

      } else if (options.type === 'all') {

        id = iduri.parseAlias(options.pkg, id);
        id = iduri.appendext(id);
        var ret = '';

        options.paths.some(function(base) {
          filepath = path.join(base, id);
          if (grunt.file.exists(filepath)) {
            grunt.log.write(filepath + ' ');
            ret = grunt.file.read(filepath);
            return true;
          } else {
            grunt.log.warn("can't find module " + id);
          }
        });
        return ret;

      }
    }).join('\n\n');

    return data + '\n\n' + rv;
  }
};
