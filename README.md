# grunt-spm-build

> grunt tasks collection for spm build.


## Getting Started

> If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide.

Here are some tips to make things happen.

### Install `grunt-cli`:

```
$ npm install grunt-cli -g
```


## Collection

This is a collection of these tasks:

- grunt-cmd-transport: https://github.com/spmjs/grunt-cmd-transport
- grunt-cmd-concat: https://github.com/spmjs/grunt-cmd-concat
- grunt-contrib-uglify: https://github.com/gruntjs/grunt-contrib-uglify
- grunt-contrib-cssmin: https://github.com/gruntjs/grunt-contrib-cssmin
- grunt-contrib-copy: https://github.com/gruntjs/grunt-contrib-copy
- grunt-contrib-clean: https://github.com/gruntjs/grunt-contrib-clean


## Build Process

Understanding the build process. Take javascript as the example:

### transport

Transport the writable module into full stack module.

Before transport:

```js
define(function(require, exports, module) {
    var jquery = require('jquery');
    var foo = require('./foo');
    module.exports = doSomething;
});
```

After transport:

```js
define('family/name/version/name', ['jquery/jquery/1.7.2/jquery', './foo'], function(require, exports, module) {
    var jquery = require('jquery/jquery/1.7.2/jquery');
    var foo = require('./foo');
    module.exports = doSomething;
});
```

### concat

Concatenate relative dependencies. The js file will contain every relative dependencies:

```js
define('....', ['...', './foo'], function(require, exports, module) {
    // ....
    var foo = require('./foo');
    // ....
});

define('.../foo', [], function(require, exports, module) {
    // ....
});
```

### minify

We can use uglify to compress the code.


## Config

This collection has a built-in config system, it will generate a config for you. That means you can set your `Gruntfile.js` as:

```js
grunt.initConfig({
  // your other configs
})

var init = require('grunt-spm-build')
init(grunt, {pkg: 'package.json'})

grunt.loadNpmTasks('grunt-spm-build')

grunt.registerTask('default', ['spm-build'])
```

## Changelog

**2013-03-22** `0.2.0b1`

The beta version.
