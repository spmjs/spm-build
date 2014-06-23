#!/usr/bin/env node

try {
  var spm = require('spm');
  var firstVersion = spm.version.split('.')[0];
  if (firstVersion !== '2') {
    console.log('  This package is compatible with spm@2.x but ' + spm.version);
    console.log('  you need install spm@2.x to register the program');
    console.log();
    console.log('    \x1b[31m$ npm install spm@2.x -g\x1b[0m');
    console.log();
    process.exit();
  }
  spm.plugin.install({
    name: 'build',
    bin: 'spm-build',
    description: 'Build a standar cmd module.'
  });
} catch(e) {
  console.log(e.message || e);
  console.log('  you need install spm@2.x to register the program');
  console.log();
  console.log('    \x1b[31m$ npm install spm@2.x -g\x1b[0m');
  console.log();
  console.log("  if you have installed spm, it maybe you haven't set a NODE_PATH environment variable");
  console.log();
}
