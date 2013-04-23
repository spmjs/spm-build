#!/usr/bin/env node

try {
  var spm = require('spm');
  spm.plugin.install({
    name: 'build',
    bin: 'spm-build',
    description: 'Build a standar cmd module.'
  });
} catch(e) {
  console.log(e.message || e);
  console.log('  you need install spm to register the program');
  console.log();
  console.log('    \x1b[31m$ npm install spm -g\x1b[0m');
  console.log();
  console.log("  if you have installed spm, it maybe you haven't set a NODE_PATH environment variable");
  console.log();
}
