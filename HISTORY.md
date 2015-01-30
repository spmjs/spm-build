# History

---

## 1.2.0 (in dev)

- add `-o, --output-file` option to output single file, [spmjs/spm#1188](https://github.com/spmjs/spm/issues/1188)
- add scripts support
- don't add name and version in generated package.json

## 1.1.1

- fix require error, ali.gnode -> gnode

## 1.1.0

- improve include, [spmjs/spm#1086](https://github.com/spmjs/spm/issues/1086)
  - deprecated `--include`
  - add `--standalone`, `--umd [umd]`, `--sea <sea>`
- support 6to5
- support autoprefixer
- exports inner fns, more expandable, [#69](https://github.com/spmjs/spm-build/pull/69)
- deps: ali.gnode -> gnode
- deps: upgrade mixing to 0.2
- deps: gulp-cssmin -> gulp-minify-css

## 1.0.8

- fix(getArgs) ignore parse error

## 1.0.7

- fix(getArgs) read registry from package.json first

## 1.0.6

- fix(getArgs) read registry from cli

## 1.0.5

- fix(build) do install before build

## 1.0.4

- fix global

## 1.0.3

- can replace package name to global variable, format `name1:global1,name2,global2`

## 1.0.2

- can use `--with-deps`, `-O`, `--zip`, `--force` in buildArgs

## 1.0.1

- fix glob patten parse problem of `**/*`, [spm#1073](https://github.com/spmjs/spm/issues/1073)

## 1.0.0

1.x for spm3, 0.x for spm2.

- using gulp-spm
- improve performance (e.g. arale-dialog, from 1.5s to 0.6s)
- 95+ test coverage
- automatically generate package.json if not exist
- can build specify file directly, without add to output in package.json
- write in es6, with generator
