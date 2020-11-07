# wangEditor

至于这款编辑器并不想做过多的介绍，自信查阅官方文档

> 官网：[www.wangEditor.com](http://www.wangeditor.com/) 文档：[www.kancloud.cn/wangfupeng/wangeditor3/332599](http://www.kancloud.cn/wangfupeng/wangeditor3/332599)

# 结合 Vue.js 项目

## 建立 Vue.js 项目

首先该项目是基于 webpack 的一个项目，如果已经是了请忽略

```bash
vue init webpack demo
cd demo
npm i
```

## 安装 wangEditor 依赖

```bash
npm install wangeditor
```

## 编写组件代码

在组件目录下新建 `EditorBar.vue`，然后就可以编写代码了

这边使用菜单与编辑器区域分离作为 demo，这边也列出了在 vue 中常见几种 API 调用方法

```html
<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Editorbar',
  data () {
    return {
      editor: null,
      info_: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear (val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value (val) {
      // 使用 v-model 时，设置初始值
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.seteditor()
  },
  methods: {
    seteditor () {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)

      this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
      this.editor.customConfig.uploadImgServer = ''// 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {      }// 自定义 header
      this.editor.customConfig.uploadFileName = '' // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
        }
      }
      this.editor.customConfig.onchange = (html) => {
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }

      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>

<style lang="css">
.editor {
  width: 80%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
```

## 编辑父组件代码

```html
<template lang="html">
  <div>
    <editor-bar v-model="editor.info" :isClear="isClear"></editor-bar>
  </div>
</template>

<script>

import EditorBar from '@/components/EditorBar'
export default {
  data () {
    return {
      editor: {
        info: ''
      },
      isClear: false
    }
  },
  components: {
    EditorBar
  }
}
</script>
```





https://my.oschina.net/u/3992201/blog/2240237

http://www.wangeditor.com/