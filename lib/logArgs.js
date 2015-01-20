'use strict';

var log = require('spm-log');

module.exports = function(args) {
  Object.keys(args).forEach(function(key) {
    if (key === 'pkg' || key === '_') return;
    var val = args[key];
    if (typeof(val) === 'object') {
      val = JSON.stringify(val);
    }
    log.info('arguments', key + ' = ' + val);
  });
};
