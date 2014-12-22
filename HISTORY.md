# History

---

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
