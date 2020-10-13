<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="searchToggle">
        <!-- 搜索 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="角色名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入角色名"
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

      <el-button-group>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
          </el-col>
        </el-row>
      </el-button-group>

      <!--      <el-button-group class="opts-right">-->
      <!--        <el-button size="mini" plain type="info" icon="el-icon-search" @click="toggleSearch()" />-->
      <!--        <el-button size="mini" icon="el-icon-refresh" @click="handleQuery()" />-->
      <!--      </el-button-group>-->

      <opts-right @toggle-search="toggleSearch" @refresh="handleQuery" />

    </div>

    <el-table
      ref="table"
      v-loading="loading"
      highlight-current-row
      style="width: 100%;"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="name" label="角色名" />
      <el-table-column prop="alias" label="角色别名" />
      <el-table-column prop="remark" label="描述" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        :show-overflow-tooltip="true"
        width="160"
        prop="createTime"
        label="创建日期"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleGrantMenu(scope.row)">配置菜单权限</el-button>
          <el-button size="mini" type="text" icon="el-icon-user" @click="handleGrantUser(scope.row)">查看授权人员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <!-- 查看授权人员对话框-->
    <el-dialog :title="title" :visible.sync="grantUserOpen" width="800px">
      <role-user-list :role-id="roleId" />
    </el-dialog>

    <!-- 授权菜单对话框-->
    <el-dialog :title="title" :visible.sync="grantMenuOpen" width="800px">
      <role-menu-grant :role-id="roleId" />
    </el-dialog>

    <!-- 添加或修改参数配置对话框  -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色别名" prop="alias">
              <el-input v-model="form.alias" placeholder="请输入角色别名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio-button
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.desc }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
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
import { listRole, addRole, delRole, updateRole, getRole, getRoleDictsByEnum, changeRoleStatus, exportExcelRole } from '@/api/system/role'
import Pagination from '@/components/Pagination'
import OptsRight from '@/components/OptsRight'
import RoleUserList from './role-user-list'
import RoleMenuGrant from './role-menu-grant'

export default {
  name: 'Role',
  components: { Pagination, OptsRight, RoleUserList, RoleMenuGrant },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索是否显示
      searchToggle: true,
      currentId: undefined,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      roleId: '',
      // 状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      grantUserOpen: false,
      grantMenuOpen: false,
      // 日期范围
      dateRange: [],
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined
      },

      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '角色别名不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '归属部门不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    getRoleDictsByEnum('roleStatus').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    // 获取列表
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        if (response.code === 0) {
          this.roleList = response.data.list
          // console.log(this.roleList)
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.roleList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.roleList = []
        this.total = 0
        this.loading = false
      })
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
        name: '',
        alias: '',
        remark: '',
        status: 0
      }
      this.resetForm(formName)
    },
    // 新增
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加角色'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      const roleId = row.id || this.ids
      getRole(roleId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改角色'
      })
    },
    // 删除
    handleDelete(row) {
      let roleIds = row.id || this.ids
      if (!Array.isArray(roleIds)) {
        roleIds = [roleIds]
      }

      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      }).catch(function() {
      })
    },
    // 用户状态修改
    handleStatusChange(row) {
      // console.log(row.status)
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.id, row.status)
      }).then(() => {
        this.$message({ type: 'success', message: text + '成功' })
      }).catch(function() {
        row.status = row.status === 0 ? 1 : 0
      })
    },
    // 导入
    handleImport() {

    },
    // 导出
    handleExport() {
      exportExcelRole(this.addDateRange(this.queryParams, this.dateRange), '系统角色')
    },
    // 授权菜单
    handleGrantMenu(row) {
      this.grantMenuOpen = true
      this.title = '菜单权限分配'
      setTimeout(() => {
        this.roleId = row.id
      }, 0)
    },
    // 查看授权人员
    handleGrantUser(row) {
      this.grantUserOpen = true
      this.title = '查看授权人员'
      setTimeout(() => {
        this.roleId = row.id
      }, 0)
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            // 新增
            addRole(this.form).then(response => {
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
            updateRole(this.form).then(response => {
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

