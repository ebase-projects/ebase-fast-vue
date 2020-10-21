<template>
  <el-dialog
    v-if="noticeReceiverOpen"
    :title="title"
    :visible.sync="noticeReceiverOpen"
    :width="width"
    :before-close="handleDialogClose"
  >
    <div class="app-container">
      <el-table
        ref="table"
        v-loading="loading"
        highlight-current-row
        style="width: 100%;"
        :data="sysNoticeList"
      >
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
      <!--        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">-->
      <!--          <template slot-scope="scope">-->
      <!--            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleView(scope.row)">查看</el-button>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
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
  </el-dialog>

</template>

<script>
import { listSysNoticeReceiver } from '@/api/notice/noticeReceiver'
import Pagination from '@/components/Pagination'
import { getNoticeDictsByEnum } from '@/api/notice/notice'
// import { getNoticeDictsByEnum } from '@/api/notice/notice'

export default {
  name: 'NoticeReciver',
  components: { Pagination },
  props: {
    title: {
      type: String,
      default: '查看通知用户'
    },
    width: {
      type: String,
      default: '900px'
    },
    noticeId: {
      type: String,
      required: true
    },
    noticeReceiverOpen: {
      type: Boolean,
      required: true
    }

  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      sysNoticeList: [],
      // 状态数据字典
      noticeReadOptions: [],
      noticeReceiverTypeOptions: [],
      // 日期范围
      dateRange: [],
      queryParams: {
        name: undefined,
        noticeId: undefined

      }
    }
  },
  watch: {
    noticeId(val) {
      if (val) {
        this.queryParams.noticeId = this.noticeId
        this.getList()
      }
    }
    // noticeReceiverOpen(val) {
    //   if (val) {
    //     this.noticeReceiverOpen = !this.noticeReceiverOpen
    //   }
    // }
  },
  created() {
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
      listSysNoticeReceiver(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /**
     * 点击 X 关闭对话框的回调
     **/
    handleDialogClose() {
      this.$emit('on-change', !this.noticeReceiverOpen)
    }

  }
}
</script>

