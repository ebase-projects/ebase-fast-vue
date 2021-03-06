# ebase-fast-vue 

这是一个`ebase-fast` 管理后台。我们原始克隆了 [vue-admin-template](http://panjiachen.github.io/vue-admin-template) 脚手架。

> 目前版本为 `v4.0+` 基于 `vue-cli` 进行构建。

## 浏览器支持

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## 构建启动

```bash
# 克隆项目
git clone git@github.com:ebase-projects/ebase-fast-vue.git

# 进入项目目录
cd ebase-fast-vue 

# 安装依赖
npm install 或者 yarn install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev 或者 yarn run dev
```

浏览器访问 [http://127.0.0.1:9528](http://127.0.0.1:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## 预览图

![jietu-20200828112405](./doc/images/jietu-20200828112405.jpg)
![jietu-20200828112405](./doc/images/jietu-20200828112425.jpg)
![jietu-20200828112405](./doc/images/jietu-20200828112445.jpg)
![jietu-20200828112405](./doc/images/jietu-20200828112454.jpg)
![jietu-20200828112405](./doc/images/jietu-20200828112501.jpg)
![jietu-20200828112405](./doc/images/jietu-20200828112517.jpg)

## 版权

[MIT](https://github.com/ebase-projects/ebase-fast-vue/blob/master/README.md) license.

Copyright (c) 2020-present ebase

## 开源支持
<a href="https://www.jetbrains.com/?from=ebase-projects"><img src="http://blogimage.dwliu.me/image/20200709103201-2ZxFX7.jpg" width="100" heith="100"/></a>


