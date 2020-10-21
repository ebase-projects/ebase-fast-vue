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
          <el-col :span="1.5" />
        </el-row>
      </el-button-group>
      <opts-right @toggle-search="toggleSearch" @refresh="handleQuery" />

    </div>

    <el-table ref="table" v-loading="loading" highlight-current-row style="width: 100%;" :data="sysNoticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" align="center" />
      <!--      <el-table-column prop="type" label="通知类型" />-->
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="receiverType" label="接收类型" :formatter="noticeReceiverTypeFormat" />
      <el-table-column prop="senderName" label="发送者" />
      <el-table-column prop="senderDate" label="发送时间" width="160" />
      <el-table-column prop="readStatus" label="阅读状态" :formatter="noticeReadFormat" />
      <el-table-column prop="readDate" label="阅读时间" width="160" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleView(scope.row)">查看</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="900px">

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="通知类型" prop="type" label-width="120px">-->
          <!--              <el-input v-model="form.type" placeholder="请输入通知类型" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="标题" prop="title" label-width="80px">
              <el-input v-model="form.title" disabled placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content" label-width="80px">
              <el-input v-model="form.content" disabled type="textarea" placeholder="请输入内容" maxlength="3000" show-word-limit />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="接收范围" prop="receiverType" label-width="80px">
              <el-select v-model="form.receiverType" placeholder="请选择接收范围" disabled>
                <el-option
                  v-for="item in noticeReceiverTypeOptions"
                  :key="item.value"
                  :label="item.desc"
                  :value="Number(item.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送者" prop="content" label-width="80px">
              <el-input v-model="form.senderName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送时间" prop="content" label-width="80px">
              <el-input v-model="form.createTime" disabled />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('form')">已 读</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listSysNoticeWithReceiver, getNoticeDictsByEnum } from '@/api/notice/notice'
import { noticeUserReaded } from '@/api/notice/noticeReceiver'
import Pagination from '@/components/Pagination'
import OptsRight from '@/components/OptsRight'

export default {
  name: 'MyNotice',
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
      sysNoticeList: [],
      // 状态数据字典
      noticeReadOptions: [],
      noticeReceiverTypeOptions: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],

      queryParams: {
        name: undefined
      },
      form: {
        noticeUserIds: [],
        noticeDeptIds: [],
        noticeReceivers: []
      },
      // 表单校验
      rules: {
        type: [
          { required: true, message: '通知类型不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        receiverType: [
          { required: true, message: '接收类型不能为空', trigger: 'blur' }
        ],
        senderName: [
          { required: true, message: '发送者不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()

    getNoticeDictsByEnum('NoticeReadEnum').then(response => {
      this.noticeReadOptions = response.data
    })
    getNoticeDictsByEnum('NoticeReceiverTypeEnum').then(response => {
      this.noticeReceiverTypeOptions = response.data
    })
  },
  methods: {
    noticeReadFormat(row, column) {
      return this.selectDictLabel(this.noticeReadOptions, row.readStatus)
    },
    noticeReceiverTypeFormat(row, column) {
      return this.selectDictLabel(this.noticeReceiverTypeOptions, row.receiverType)
    },

    // 获取列表
    getList() {
      this.loading = true
      listSysNoticeWithReceiver(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        if (response.code === 0) {
          this.sysNoticeList = response.data.list
          // console.log(this.sysNoticeList)
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.sysNoticeList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.sysNoticeList = []
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
    // 查看
    handleView(row) {
      this.open = true
      this.title = '查看'
      noticeUserReaded(row.noticeReceiverId)
      this.form = row
    },
    // 用户状态修改
    handleStatusChange(row) {
      // console.log(row.status)
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"系统通知表 吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        // return changeSysNoticeStatus(row.id, row.status)
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
    // 取消表单
    cancelForm(formName) {
      this.open = false
      this.getList()
    }
  }
}
</script>

