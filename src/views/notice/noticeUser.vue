<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="searchToggle">
        <!-- 搜索 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入名称"
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
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
          </el-col>
        </el-row>
      </el-button-group>
      <opts-right @toggle-search="toggleSearch" @refresh="handleQuery" />

    </div>

    <el-table ref="table" v-loading="loading" highlight-current-row style="width: 100%;" :data="sysNoticeUserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="tenantId" label="租户编号" />
      <el-table-column prop="noticeId" label="通知ID" />
      <el-table-column prop="userId" label="接收者ID" />
      <el-table-column prop="readStatus" label="阅读状态  0：未读  1：已读" />
      <el-table-column prop="readDate" label="阅读时间" />
      <el-table-column prop="delFlag" label="是否删除 0正常 1删除" />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateBy" label="修改人" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column prop="revision" label="乐观锁" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="160" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="ID" prop="id" label-width="120px">
              <el-input v-model="form.id" placeholder="请输入ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租户编号" prop="tenantId" label-width="120px">
              <el-input v-model="form.tenantId" placeholder="请输入租户编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="通知ID" prop="noticeId" label-width="120px">
              <el-input v-model="form.noticeId" placeholder="请输入通知ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接收者ID" prop="userId" label-width="120px">
              <el-input v-model="form.userId" placeholder="请输入接收者ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="阅读状态  0：未读  1：已读" prop="readStatus" label-width="120px">
              <el-input v-model="form.readStatus" placeholder="请输入阅读状态  0：未读  1：已读" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="阅读时间" prop="readDate" label-width="120px">
              <el-input v-model="form.readDate" placeholder="请输入阅读时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否删除 0正常 1删除" prop="delFlag" label-width="120px">
              <el-input v-model="form.delFlag" placeholder="请输入是否删除 0正常 1删除" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建人" prop="createBy" label-width="120px">
              <el-input v-model="form.createBy" placeholder="请输入创建人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建时间" prop="createTime" label-width="120px">
              <el-input v-model="form.createTime" placeholder="请输入创建时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="修改人" prop="updateBy" label-width="120px">
              <el-input v-model="form.updateBy" placeholder="请输入修改人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="修改时间" prop="updateTime" label-width="120px">
              <el-input v-model="form.updateTime" placeholder="请输入修改时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="乐观锁" prop="revision" label-width="120px">
              <el-input v-model="form.revision" placeholder="请输入乐观锁" />
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
import {
  listSysNoticeUser, addSysNoticeUser, delSysNoticeUser, updateSysNoticeUser, getSysNoticeUser } from '@/api/notice/noticeUser'
import Pagination from '@/components/Pagination'
import OptsRight from '@/components/OptsRight'

export default {
  name: 'SysNoticeUser',
  components: { Pagination, OptsRight },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索是否显示
      searchToggle: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      sysNoticeUserList: [],
      // 状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      queryParams: {
        name: undefined
      },
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
        tenantId: [
          { required: true, message: '租户编号不能为空', trigger: 'blur' }
        ],
        noticeId: [
          { required: true, message: '通知ID不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '接收者ID不能为空', trigger: 'blur' }
        ],
        readStatus: [
          { required: true, message: '阅读状态  0：未读  1：已读不能为空', trigger: 'blur' }
        ],
        readDate: [
          { required: true, message: '阅读时间不能为空', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '是否删除 0正常 1删除不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateBy: [
          { required: true, message: '修改人不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' }
        ],
        revision: [
          { required: true, message: '乐观锁不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.loading = true
      listSysNoticeUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        if (response.code === 0) {
          this.sysNoticeUserList = response.data.list
          // console.log(this.sysNoticeUserList)
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.sysNoticeUserList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.sysNoticeUserList = []
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
        tenantId: undefined,
        noticeId: undefined,
        userId: undefined,
        readStatus: undefined,
        readDate: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        revision: undefined
      }
      this.resetForm(formName)
    },
    // 新增
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加系统通知用户表 '
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      const sysNoticeUserId = row.id || this.ids
      getSysNoticeUser(sysNoticeUserId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改系统通知用户表 '
      })
    },

    // 删除
    handleDelete(row) {
      let sysNoticeUserIds = row.id || this.ids
      if (!Array.isArray(sysNoticeUserIds)) {
        sysNoticeUserIds = [sysNoticeUserIds]
      }

      this.$confirm('是否确认删除系统通知用户表 编号为"' + sysNoticeUserIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSysNoticeUser(sysNoticeUserIds)
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
      this.$confirm('确认要"' + text + '""' + row.name + '"系统通知用户表 吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        // return changeSysNoticeUserStatus(row.id, row.status)
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
            addSysNoticeUser(this.form).then(response => {
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
            updateSysNoticeUser(this.form).then(response => {
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

