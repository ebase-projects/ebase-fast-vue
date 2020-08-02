<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="searchToggle">
        <!-- 搜索 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="queryParams.createByName"
              placeholder="请输入用户名"
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
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
          </el-col>
        </el-row>
      </el-button-group>
      <opts-right @toggle-search="toggleSearch" @refresh="handleQuery" />

    </div>

    <el-table
      ref="table"
      v-loading="loading"
      highlight-current-row
      style="width: 100%;"
      :data="logOperationList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="operation" label="用户操作" />
      <el-table-column prop="requestUri" label="请求URI" />
      <el-table-column prop="requestMethod" label="请求方式" />
      <!--      <el-table-column prop="requestParams" label="请求参数" />-->
      <el-table-column prop="requestTime" label="请求时长(毫秒)" />
      <!--      <el-table-column prop="userAgent" label="用户代理" />-->
      <el-table-column prop="ip" label="操作IP" />
      <!--      <el-table-column prop="status" label="状态" />-->
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="160" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求参数">
              <span>{{ props.row.requestParams }}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户代理">
              <span>{{ props.row.userAgent }}</span>
            </el-form-item>
          </el-form>
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
  </div>
</template>

<script>
import { listLogOperation } from '@/api/log/logOperation'
import Pagination from '@/components/Pagination'
import OptsRight from '@/components/OptsRight'

export default {
  name: 'LogOperation',
  components: { Pagination, OptsRight },
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
      // 任务表格数据
      logOperationList: [],
      // 状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      queryParams: {
        page: 1,
        limit: 10,
        createByName: undefined
      },
      form: {}

    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.loading = true
      listLogOperation(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        if (response.code === 0) {
          this.logOperationList = response.data.list
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.logOperationList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.logOperationList = []
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
        beanName: undefined,
        params: undefined,
        cronExpression: undefined,
        remark: undefined,
        status: 0
      }
      this.resetForm(formName)
    },
    // 导出
    handleExport() {

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    }
  }
}
</script>

