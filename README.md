# spm-build

[![NPM version](https://img.shields.io/npm/v/spm-build.svg?style=flat)](https://npmjs.org/package/spm-build)
[![Build Status](https://img.shields.io/travis/spmjs/spm-build.svg?style=flat)](https://travis-ci.org/spmjs/spm-build)
[![Coverage Status](https://img.shields.io/coveralls/spmjs/spm-build.svg?style=flat)](https://coveralls.io/r/spmjs/spm-build)
[![NPM downloads](http://img.shields.io/npm/dm/spm-build.svg?style=flat)](https://npmjs.org/package/spm-build)

Build tool for spm3. If you're still using spm2, go branch [spm2](https://github.com/spmjs/spm-build/tree/spm2).

---

## Install

```bash
$ npm install spm-build -g
```

## Usage

```bash
$ spm-build [option] [file]
```

## OPTION

- `-I, --input-directory <dir>`, input directory, default: current working directory
- `-O, --output-directory <dir>`, output directory, default: dist
- `--include <include>`, determine which files will be included, optional: self, relative, all, standalone, umd
- `--ignore <ignore>`, determine which id will not be transported
- `--skip <skip>`, determine which id will not be parsed when analyse
- `-f, --force`, force to clean dest directory first
- `-r, --registry <url>`, registry url of yuan server
- `--idleading [idleading]`, prefix of module name, default: {{name}}/{{version}}
- `--with-deps`, build package in dependencies
- `--zip`, archive by zip
- `--verbose`, show more logging
- `--no-color`, disable colorful print
- `--no-install`, disable install

## LISENCE

Copyright (c) 2014 chencheng. Licensed under the MIT license.
