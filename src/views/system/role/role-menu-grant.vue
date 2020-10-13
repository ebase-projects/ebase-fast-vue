<template>
  <div slot="footer">
    <div>
      <el-button icon="el-icon-check" size="mini" type="primary" @click="handleGrantRoleMenu">保存</el-button>
    &nbsp;
      <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
      <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
      <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>

    </div>
    <el-tree
      ref="menuTree"
      class="tree-style"
      :data="menuList"
      :default-checked-keys="menuIds"
      :props="defaultProps"
      default-expand-all
      accordion
      show-checkbox
      node-key="id"
      empty-text="加载中，请稍后"
      :check-strictly="!form.menuCheckStrictly"
      :render-content="renderContent"
    />
  </div>
</template>

<script>
import { getMenuListByRoleId, grantRoleMenu } from '@/api/system/role'
import { getMenuTree } from '@/api/system/menu'

export default {
  name: 'RoleMenuGrant',
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 部门数据格式字段转换
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuExpand: false,
      menuNodeAll: false,
      menuList: [],
      menuIds: [],
      form: {
        menuCheckStrictly: true
      }
    }
  },
  watch: {
    roleId(val) {
      if (val) {
        this.getSelectedMenus(this.roleId)
        this.getMenuTree()
      }
    }
  },
  methods: {
    getMenuTree() {
      this.loading = true
      getMenuTree().then(response => {
        if (response.code === 0) {
          this.menuList = response.data
          this.loading = false
        } else {
          this.menuList = []
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.roleList = []
        this.loading = false
      })
    },
    // 右侧回显菜单
    getSelectedMenus(id) {
      if (id) {
        // 清空菜单的选中
        this.$nextTick(function() {
          this.$refs.menuTree.setCheckedKeys([])
        })
        // 保存当前的角色id
        this.currentId = id
        getMenuListByRoleId(id).then(response => {
          if (response.code === 0) {
            // 初始化
            this.menuIds = response.data.menuIds
            // // 菜单数据需要特殊处理
            // roleMenus.menuIds.forEach(function(data, index) {
            //   _this.menuIds.push(data)
            // })
          } else {
            this.$message({ type: 'error', message: response.msg })
          }
        })
      }
    },
    // 角色授权
    handleGrantRoleMenu() {
      const menuIds = this.$refs.menuTree.getCheckedKeys()
      grantRoleMenu(this.currentId, menuIds).then(response => {
        if (response.code === 0) {
          this.$message({ type: 'success', message: '操作成功' })
          // this.grantMenuOpen = false
          this.getList()
        } else {
          this.$message({ type: 'error', message: response.msg })
        }
      })
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      const treeList = this.menuList
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menuTree.store.nodesMap[treeList[i].id].expanded = value
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      this.$refs.menuTree.setCheckedNodes(value ? this.menuList : [])
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      this.form.menuCheckStrictly = !!value
    },
    // 内容区渲染后执行 判断底层 赋 class
    // vue的横向树形菜单 https://blog.csdn.net/ying940718/article/details/98219905
    renderContent(h, { node, data, store }) {
      // console.log(node.label + ',' + node.childNodes.length)
      let classname = ''
      // // 第三层节点添加className
      if (node.level === 3) {
        classname = 'levelname'
      }
      //
      // // 由于项目中有二级菜单也有三级菜单，就要在此做出判断。
      // if (node.level === 2 && node.childNodes.length === 0) {
      //   classname = 'levelname'
      // }

      // if (node.childNodes.length === 0) {
      //   classname = 'levelname'
      // }
      return (<p class={classname}>{node.label}</p>)
    }

  }

}
</script>

<style >
.tree-style .el-tree-node__children .el-tree-node__children .el-tree-node__content {
  float: left;
}
</style>
