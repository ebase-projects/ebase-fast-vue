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
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
          </el-col>
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
      <el-table-column prop="status" label="发送状态" :formatter="noticeStatusFormat" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="160" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status==0" size="mini" type="text" icon="el-icon-delete" @click="handlePublish(scope.row)">发布</el-button>
          <el-button v-if="scope.row.status==1" size="mini" type="text" icon="el-icon-delete" @click="handleRevoke(scope.row)">撤销</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleViewReciver(scope.row)">查看通知人员</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="通知类型" prop="type" label-width="120px">-->
          <!--              <el-input v-model="form.type" placeholder="请输入通知类型" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="标题" prop="title" label-width="120px">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content" label-width="120px">
              <el-input v-model="form.content" type="textarea" placeholder="请输入内容" maxlength="3000" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接收范围" prop="receiverType" label-width="120px">
              <el-select v-model="form.receiverType" placeholder="请选择接收范围">
                <el-option
                  v-for="item in noticeReceiverTypeOptions"
                  :key="item.value"
                  :label="item.desc"
                  :value="Number(item.value)"
                />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col v-if="form.receiverType==1" :span="24">
            <el-form-item label="指定部门" prop="receiverTypeIds" label-width="120px">
              <treeselect
                v-model="form.receiverTypeIds"
                :multiple="true"
                value-consists-of="ALL"
                :options="deptOptions"
                :normalizer="normalizer"
                :flatten-search-results="true"
                placeholder="请选择部门"
              />
            </el-form-item>
          </el-col>

          <!--          <el-col v-if="form.receiverType==2" :span="24">-->
          <!--            <el-form-item label="指定用户" prop="noticeUserId" label-width="120px">-->
          <!--              <el-select v-model="form.receiverTypeIds" multiple placeholder="请选择部门">-->
          <!--                <el-option-->
          <!--                  v-for="item in noticeReceiverTypeOptions"-->
          <!--                  :key="item.value"-->
          <!--                  :label="item.desc"-->
          <!--                  :value="item.value"-->
          <!--                />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->

          <!--          <el-select v-model="form.noticeReceivers.noticeUserId" multiple placeholder="请选择">-->
          <!--            <el-option-->
          <!--              v-for="item in noticeReceiverTypeOptions"-->
          <!--              :key="item.id"-->
          <!--              :label="item.name"-->
          <!--              :value="item.id"-->
          <!--            />-->
          <!--          </el-select>-->
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="发送者" prop="senderName" label-width="120px">-->
          <!--              <el-input v-model="form.senderName" placeholder="请输入发送者" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">草 稿</el-button>
        <el-button @click="cancelForm('form')">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listSysNotice,
  addSysNotice,
  delSysNotice,
  updateSysNotice,
  getSysNotice,
  getNoticeDictsByEnum,
  publishSysNotice,
  revokeSysNotice
} from '@/api/notice/notice'
import Pagination from '@/components/Pagination'
import OptsRight from '@/components/OptsRight'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listDept } from '@/api/system/dept'

export default {
  name: 'SysNotice',
  components: { Pagination, OptsRight, Treeselect },
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
      noticeReceiverTypeOptions: [],
      noticeStatusOptions: [],
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
  watch: {
    'form.receiverType': function(newValue, oldValue) {
      if (newValue === 0) {
        this.form.receiverTypeIds = []
      }
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
    getNoticeDictsByEnum('NoticeReceiverTypeEnum').then(response => {
      // const data = response.data
      // data.forEach(p => {
      //   p.value = Number(p.value)
      // })
      this.noticeReceiverTypeOptions = response.data
    })

    getNoticeDictsByEnum('NoticeStatusEnum').then(response => {
      // const data = response.data
      // data.forEach(p => {
      //   p.value = Number(p.value)
      // })
      this.noticeStatusOptions = response.data
    })
  },
  methods: {
    noticeReceiverTypeFormat(row, column) {
      return this.selectDictLabel(this.noticeReceiverTypeOptions, row.receiverType)
    },
    noticeStatusFormat(row, column) {
      return this.selectDictLabel(this.noticeStatusOptions, row.status)
    },
    // 转换部门数据结构
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
    // 获取部门树列表
    getTreeselect() {
      listDept().then(response => {
        this.deptOptions = response.data
      })
    },
    // 获取列表
    getList() {
      this.loading = true
      listSysNotice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
    reset(formName) {
      this.form = {
        id: undefined,
        tenantId: undefined,
        type: undefined,
        title: undefined,
        content: undefined,
        receiverType: undefined,
        receiverTypeIds: undefined,
        senderName: undefined,
        senderDate: undefined,
        status: undefined,
        noticeReceivers: []
      }
      this.resetForm(formName)
    },
    // 新增
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加系统通知表 '
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      const sysNoticeId = row.id || this.ids
      getSysNotice(sysNoticeId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改系统通知表 '
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('是否确认「删除」系统通知为"' + row.title + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSysNotice(row.id)
      }).then((resp) => {
        console.log(resp)

        if (resp.code !== 0) {
          this.$message({ type: 'error', message: resp.msg })
        } else {
          this.getList()
          this.$message({ type: 'success', message: '操作成功' })
        }
      }).catch(function() {
      })
    },
    // 查看通知人员
    handleViewReciver(row) {

    },

    // 发布
    handlePublish(row) {
      this.$confirm('是否确认「发布」系统通知为"' + row.title + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return publishSysNotice(row.id)
      }).then((resp) => {
        if (resp.code !== 0) {
          this.$message({ type: 'error', message: resp.msg })
        } else {
          this.getList()
          this.$message({ type: 'success', message: '操作成功' })
        }
      }).catch(function() {
      })
    },
    // 撤销
    handleRevoke(row) {
      this.$confirm('是否确认「撤销」系统通知为"' + row.title + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return revokeSysNotice(row.id)
      }).then((resp) => {
        if (resp.code !== 0) {
          this.$message({ type: 'error', message: resp.msg })
        } else {
          this.getList()
          this.$message({ type: 'success', message: '操作成功' })
        }
      }).catch(function() {
      })
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

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            // 新增
            addSysNotice(this.form).then(response => {
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
            updateSysNotice(this.form).then(response => {
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

