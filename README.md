# spm-build

> the build tools for spmjs.org

-----

spm build is designed to build standard cmd modules.

**自定义构建，请不要用这个库，除非你清楚自己在做什么！**

Customized building should use these grunt tasks:

- https://github.com/spmjs/grunt-cmd-transport
- https://github.com/spmjs/grunt-cmd-concat

## Standard Module

A standard module contains:

- a package.json
- a src directory
- a dist directory

```
package.json
src/
  module-name.js
dist/
  module-name.js   <-- will be created by spm-build
```

Learn more on [package.json](http://docs.spmjs.org/en/package).


## Install

Install spm-build with npm:

    $ npm install spm-build -g


## API

```
var builder = require('spm-build')
```

### builder.loadTasks()

It will load all tasks of the default build. Including:

- grunt-cmd-transport
- grunt-cmd-concat
- grunt-contrib-uglify
- grunt-contrib-copy
- grunt-contrib-cssmin
- grunt-contrib-clean
- spm-install
- spm-newline

If you are using `spm-build` to run the grunt task, you can also load these tasks with:

    grunt.loadGlobalTasks('spm-build')


## Changelog

**April 16, 2013** `0.1.1`

Update dependencies.

**April 15, 2013** `0.1.0`

First version.
