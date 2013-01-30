# grunt-spm-build

> grunt tasks for spm build.


## Getting Started

> If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide.

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```
$ npm install grunt-spm-build --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-spm-build');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The tasks

- spm-transport
- spm-concat
- spm-beautify
- spm-css-minify
- spm-js-minify

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
