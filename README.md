# grunt-spm-build

> grunt tasks for spm build.


## Getting Started

> If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide.

Here are some tips to make things happen.

### Install `grunt-cli`:

```
$ npm install grunt-cli -g
```

Make changes of your `package.json`:

```json
"devDependencies: {
    "grunt-spm-build": "*",
    "grunt": "0.4.0rc7"
},
"spm": {
    "alias": {
        "class": "arale/class/1.0.0/class"
    },
    "output": {
        "widget.js": "."
    }
}
```

Create a `Gruntfile.js` in your project directory:

```js
module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  require('grunt-spm-build').init(grunt, {pkg: pkg});

  grunt.loadNpmTasks('grunt-spm-build');
  grunt.registerTask('default', ['spm-build']);
}
```

Install every dependencies, and run grunt:

```
$ npm install
$ grunt
```

A simple example talks more, have a look at `test/cases/relative`.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## The tasks

- spm-transport: transport js, css, tpl to cmd (with id and dependencies).
- spm-concat: concat files into one file.
- spm-beautify: save a pretty js or css source file.
- spm-css-minify: minify css files via clean-css.
- spm-js-minify: minify js files via uglify-js.

### spm-transport

In your project's Gruntfile, add a section named `spm-transport` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'spm-transport': {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### spm-concat


### spm-beautify


### spm-css-minify


### spm-js-minify
