#!/usr/bin/env node

try {
  require('spm').plugin.uninstall('build');
} catch(e) {}
