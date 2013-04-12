# spm-build

> the build tools for spmjs.org

-----

spm build is designed to build standard cmd modules.

**自定义构建，请不要用这个库**


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

Learn more on [package.json](docs.spmjs.org/en/package).


## Install

Install spm-build with npm:

    $ npm install spm-build -g


## Usage
