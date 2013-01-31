/*
 * grunt-spm-build
 * https://github.com/spmjs/grunt-spm-build
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

var path = require('path');
var util = require('util');
var ast = require('cmd-util').ast;
var iduri = require('cmd-util').iduri;
var cleancss = require('clean-css');

module.exports = function(grunt) {

  grunt.registerMultiTask('spm-transport', 'transport everything to js.', function() {

    var options = this.options({
      paths: ['sea-modules'],
      pkg: 'package.json',
      src: 'src',
      dest: 'tmp-transport'
    });

    if (grunt.util._.isString(options.pkg)) {
      options.pkg = grunt.file.readJSON(options.pkg);
    }

    if (!options.format) {
      if (options.pkg.spm && options.pkg.spm.format) {
        options.format = options.pkg.spm.format;
      } else if (options.pkg.format) {
        options.format = pkg.format;
      }
    }

    var id, fname, destfile, data;
    this.filesSrc.forEach(function(fpath) {
      if (!/\.(js|css|tpl|json)$/.test(fpath)) return;

      fname = fpath.replace(options.src, '').replace(/^\//, '');
      id = iduri.idFromPackage(options.pkg, fname, options.format);

      destfile = path.join(options.dest, fname);

      if (/\.js$/.test(fname)) {
        transportJS(fpath, destfile, options);
      } else if (/\.css$/.test(fname)) {
        data = css2js(grunt.file.read(fpath), id);
        grunt.file.write(destfile + '.js', data);
      } else if (/\.tpl$/.test(fname)) {
        data = tpl2js(grunt.file.read(fpath), id);
        grunt.file.write(destfile + '.js', data);
      } else if (/\.json$/.test(fname)) {
        data = json2js(grunt.file.read(fpath), id);
        grunt.file.write(destfile + '.js', data);
      }
    });

    if (this.errorCount) return false;

    grunt.log.ok('tranport success.');
  });

  function transportJS(fpath, destfile, options) {
    var data = grunt.file.read(fpath);
    var fname = fpath.replace(options.src, '').replace(/^\//, '');
    var astCache = ast.getAst(data);

    if (ast.parseFirst(data).id) {
      // this is a compiled module
      grunt.log.verbose.warn(fpath + ' is a compiled module.');
      return grunt.file.write(destfile, data);
    }

    var deps = recursiveDependencies(fpath, options);
    if (deps.length) {
      grunt.log.verbose.writeln(fpath + ' depends on: ' + deps);
    }

    var id = iduri.idFromPackage(options.pkg, fname, options.format);
    data = ast.modify(astCache, {
      id: id,
      dependencies: deps,
      require: function(v) {
        return iduri.parseAlias(options.pkg, v);
      }
    });
    return grunt.file.write(destfile, data);
  }

  function recursiveDependencies(fpath, options) {
    return relativeDependencies(fpath, options);
  }

  function moduleDependencies(id, options) {
    var alias = iduri.parseAlias(options.pkg, id);
    // usually this is "$"
    if (alias === id) return [];

    var file = iduri.appendext(alias);

    var fpath;
    options.paths.some(function(base) {
      var filepath = path.join(base, file);
      if (grunt.file.exists(filepath)) {
        fpath = filepath;
        return true;
      }
    });
    if (!fpath) {
      grunt.log.warn("can't find module " + alias);
      return [];
    }
    var data = grunt.file.read(fpath);
    var parsed = ast.parse(data);
    var deps = [];

    parsed.forEach(function(meta) {
      meta.dependencies.forEach(function(dep) {
        dep = iduri.absolute(alias, dep);
        if (!grunt.util._.contains(deps, dep)) {
          deps.push(dep);
        }
      });
    });
    return deps;
  }

  function relativeDependencies(fpath, options, basefile) {
    if (basefile) {
      fpath = path.join(path.dirname(basefile), fpath);
    }
    fpath = iduri.appendext(fpath);

    var deps = [];
    var moduleDeps = {};

    var data = grunt.file.read(fpath);
    var parsed = ast.parseFirst(data);
    parsed.dependencies.forEach(function(id) {
      deps.push(id);
      if (id.charAt(0) === '.') {
        if (/\.js$/.test(iduri.appendext(id))) {
          deps = grunt.util._.union(deps, relativeDependencies(id, options, fpath));
        }
      } else {
        if (!moduleDeps.hasOwnProperty(id)) {
          var mdeps = moduleDependencies(id, options);
          moduleDeps[id] = mdeps;
          deps = grunt.util._.union(deps, mdeps);
        }
      }
    });
    return deps;
  }
};

// transform css to js
// spmjs/spm#581
function css2js(code, id) {
  var tpl = [
    'define("%s", [], function() {',
    'function importStyle(cssText) {',
    'var element = document.createElement("style");',
    'doc.getElementsByTagName("head")[0].appendChild(element);',
    'if (element.styleSheet) {',
    'element.styleSheet.cssText = cssText;',
    '} else {',
    'element.appendChild(doc.createTextNode(cssText));',
    '}',
    '}',
    "importStyle('%s')",
    '});'
  ].join('\n');
  code = cleancss.process(code, {
    keepSpecialComments: 0,
    removeEmpty: true
  });
  code = util.format(tpl, id, code.replace(/\'/g, '\\\''));
  return ast.getAst(code).print_to_string({beautify: true});
}

function tpl2js(code, id) {
  // TODO minifier code
  code = util.format('define("%s", [], "%s")', id, code.replace(/\"/g, '\\\"'));
  return ast.getAst(code).print_to_string({beautify: true});
}

// transform json to js
function json2js(code, id) {
  code = util.format('define("%s", [], %s)', id, code);
  return ast.getAst(code).print_to_string({beautify: true});
}
