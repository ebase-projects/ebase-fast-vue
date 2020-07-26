<template>
  <div class="app-container">
    <div v-if="searchToggle">
      <!--用户数据-->
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="菜单" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入菜单"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          size="mini"
          plain
          type="info"
          icon="el-icon-search"
          @click="toggleSearch()"
        >搜索
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column label="图标" align="center" width="50">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="parentName" label="上级菜单" />-->
      <!--      <el-table-column prop="url" label="菜单URL" width="150" />-->
      <el-table-column prop="component" label="菜单组件" />
      <el-table-column prop="permissions" label="授权标识" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="status" label="状态" width="60" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.createTime) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            v-if="scope.row.pid != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.pid"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.type">
                <el-radio-button label="0">目录</el-radio-button>
                <el-radio-button label="1">菜单</el-radio-button>
                <el-radio-button label="2">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.type != 2" :span="24">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type != 2" :span="12">
            <el-form-item label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.type != 2" :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type == 1" :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type == 2" label="权限标识">
              <el-input v-model="form.permissions" placeholder="请输入权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item v-if="form.menuType != 0" label="菜单状态">-->
          <!--              <el-radio-group v-model="form.visible">-->
          <!--                <el-radio-->
          <!--                  v-for="dict in visibleOptions"-->
          <!--                  :key="dict.dictValue"-->
          <!--                  :label="dict.dictValue"-->
          <!--                >{{ dict.dictLabel }}</el-radio>-->
          <!--              </el-radio-group>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancelForm('form')">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getMenuTree, addMenu, delMenu, updateMenu, getMenu } from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索是否显示
      searchToggle: true,
      // 部门数据格式字段转换
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      queryParams: {
        keyword: undefined
      },
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      },
      menuList: [],
      menuOptions: []

    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      getMenuTree(this.queryParams).then(response => {
        if (response.code === 0) {
          this.menuList = response.data
        }
        this.loading = false
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      const _self = this
      getMenuTree().then(response => {
        this.menuOptions = []
        if (response.code === 0) {
          const menu = { id: 0, name: '顶级菜单', children: [] }
          menu.children = response.data
          _self.menuOptions.push(menu)
          // console.log(this.menuOptions)
        }
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    toggleSearch() {
      this.searchToggle = !this.searchToggle
    },
    // 查询
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    // 重置查询
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    reset(formName) {
      this.form = {
        id: undefined,
        type: 0,
        name: undefined,
        pid: 0,
        component: undefined,
        isFrame: 0,
        parentName: undefined,
        path: undefined,
        url: undefined,
        permissions: undefined,
        sort: 0,
        icon: undefined,
        status: 0
      }
      this.resetForm(formName)
    },
    // 新增
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.pid = row.id
      }
      this.open = true
      this.title = '添加菜单'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      const menuId = row.id
      getMenu(menuId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改菜单'
      })
    },
    // 删除
    handleDelete(row) {
      // console.log(row.id)
      let menuIds = [row.id] || this.ids
      this.$confirm('是否确认删除菜单编号为"' + menuIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (!Array.isArray(menuIds)) {
          menuIds = [menuIds]
        }
        return delMenu(menuIds)
      }).then(() => {
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      }).catch(function() {
      })
    },
    // 导入
    handleImport() {

    },
    // 导出
    handleExport() {

    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            // 新增
            addMenu(this.form).then(response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })
                this.open = false
                this.getList()
              } else {
                this.$message({ type: 'error', message: response.msg })
              }
            })
          } else {
            // 修改
            updateMenu(this.form).then(response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })
                this.open = false
                this.getList()
              } else {
                this.$message({ type: 'error', message: response.msg })
              }
            })
          }
        }
      })
    },
    // 取消表单
    cancelForm(formName) {
      this.open = false
      this.reset(formName)
    }
  }
}
</script>

<style scoped>

</style>
