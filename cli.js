#!/usr/bin/env node --harmony

'use strict';

require('colorful').colorful();
var program = require('commander');
var log = require('spm-log');
var join = require('path').join;
var exists = require('fs').existsSync;
var readFile = require('fs').readFileSync;
var Build = require('./').Build;

program
  .option('-I, --input-directory <dir>', 'input directory, default: current working directory')
  .option('-O, --output-directory <dir>', 'output directory, default: dist')
  .option('--include <include>', 'Deprecated. determine which files will be included, optional: self, relative, all, standalone, umd')
  .option('--sea <sea>', 'file include mode with seajs, optional: self, relative, all')
  .option('--standalone', 'standalone version')
  .option('--umd [umd]', 'UMD-wrapped version with given global name')
  .option('--global <global>', 'replace package name to global variable, format jquery:$,underscore:_')
  .option('--ignore <ignore>', 'determine which id will not be transported')
  .option('--skip <skip>', 'determine which id will not be parsed when analyse')
  .option('-f, --force', 'force to clean dest directory first')
  .option('-r, --registry <url>', 'registry url of yuan server')
  .option('--idleading [idleading]', 'prefix of module name, default: {{name}}/{{version}}')
  .option('--with-deps', 'build package in dependencies')
  .option('--zip', 'archive by zip')
  .option('--verbose', 'show more logging')
  .option('--no-color', 'disable colorful print')
  .option('--no-install', 'disable install')
  .parse(process.argv);

log.config(program);

var cwd = join(process.cwd(), program.inputDirectory || '');
var file = join(cwd, 'package.json');
var pkg = exists(file) && JSON.parse(readFile(file, 'utf-8'));
var entry = program.args;

var info = '';
if (entry.length) {
  info = 'build ' + entry.join(',');
} else if (!pkg || !pkg.spm) {
  log.error('miss', 'package.json or "spm" key');
  process.exit(2);
} else {
  info = ('build ' + pkg.name + '@' + pkg.version).to.magenta.color;
}

var begin = Date.now();
console.log();
log.info('start', info);

var args = {
  dest: program.outputDirectory,
  cwd: cwd,

  include: program.include,
  sea: program.sea,
  standalone: program.standalone,
  umd: program.umd,
  ignore: program.ignore,
  global: program.global,
  skip: program.skip,
  idleading: program.idleading,
  registry: program.registry || (pkg.spm && pkg.spm.registry),

  withDeps: program.withDeps,
  zip: program.zip,
  force: program.force,
  install: program.install,

  entry: entry
};

new Build(args)
  .getArgs()
  .installDeps()
  .parsePkg()
  .addCleanTask()
  .run(function(err) {
    if (err) {
      log.error(err.message);
      log.error(err.stack);
      process.exit(1);
    }

    log.info('finish', info + showDiff(begin));
    console.log();
  });

function showDiff(time) {
  var diff = Date.now() - time;
  return (' (' + diff + 'ms)').to.gray.color;
}
