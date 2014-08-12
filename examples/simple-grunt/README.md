# 使用 grunt 进行构建

## 安装

安装 grunt 以及插件

```
$ npm install grunt-cli -g
$ npm install
```

安装 spm，可以用来下模块

```
$ npm install spm@2.x -g
```

## 使用说明

确认上线后静态文件的目录，比如 spm 使用 sea-modules。

去 https://spmjs.org 查看需要使用的模块，然后下载下来，在 simple-grunt 目录下操作

```
$ spm install seajs/seajs
$ spm install jquery/jquery
```

index.html 设置了开发环境和线上环境的判断，在页面上添加 ?online 就会引用线上文件。

执行 grunt 将文件生成到 sea-modules 中。
