<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="role-span">字典属性</span>
      </div>
      <div v-if="JSON.stringify(dictModel) === '{}'">
        <div class="my-code">点击左侧字典查看属性</div>
      </div>
      <div v-else>
        <!--字典列表-->
        <!--        <el-form ref="queryForm" :model="queryParams" :inline="true">-->
        <!--          <el-form-item label="字典名称" prop="name">-->
        <!--            <el-input-->
        <!--              v-model="queryParams.name"-->
        <!--              placeholder="请输入字典名称"-->
        <!--              clearable-->
        <!--              size="small"-->
        <!--              @keyup.enter.native="handleQuery"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--          <el-form-item>-->
        <!--            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <!--            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        <!--            -->
        <!--          </el-form-item>-->
        <!--        </el-form>-->

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <el-table
          v-loading="loading"
          highlight-current-row
          :data="dictItemList"
        >
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column label="字典类型" align="center" prop="dictType" :show-overflow-tooltip="true" />
          <el-table-column label="字典标签" align="center" prop="label" :show-overflow-tooltip="true" />
          <el-table-column label="字典值" align="center" prop="value" :show-overflow-tooltip="true" />
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
          <el-table-column label="排序" align="center" prop="sort" width="120" />
          <!--          <el-table-column label="备注" align="center" prop="remark" width="120" />-->
          <!--          <el-table-column label="创建时间" align="center" prop="createTime" width="160">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span>{{ parseTime(scope.row.createTime) }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
    </el-card>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典类型" prop="dictType">
              <el-input v-model="form.dictType" placeholder="请输入字典类型" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典标签" prop="label">
              <el-input v-model="form.label" placeholder="请输入字典标签" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典值" prop="value">
              <el-input v-model="form.value" placeholder="请输入字典值" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="状态">-->
          <!--              <el-radio-group v-model="form.status">-->
          <!--                <el-radio-button-->
          <!--                  v-for="dict in statusOptions"-->
          <!--                  :key="dict.value"-->
          <!--                  :label="dict.value"-->
          <!--                >{{ dict.desc }}-->
          <!--                </el-radio-button>-->
          <!--              </el-radio-group>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
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
import { listDictItem, addDictItem, delDictItem, updateDictItem, getDictItem, changeDictItemStatus } from '@/api/system/dict'
import Pagination from '@/components/Pagination'

export default {
  name: 'DictItem',
  components: { Pagination },
  props: {
    dictModel: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索是否显示
      searchToggle: true,
      currentId: undefined,
      // 总条数
      total: 0,
      // 菜单列表
      dictItemList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      queryParams: {
        page: 1,
        limit: 10,
        dictType: undefined,
        name: undefined
      },

      form: {},
      // 表单校验
      rules: {
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '字典标签不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dictModel(val) {
      this.getList()
    }
  },
  created() {

  },
  methods: {
    // 获取列表
    getList() {
      this.loading = true
      this.queryParams.dictType = this.dictModel.type
      listDictItem(this.queryParams).then(response => {
        if (response.code === 0) {
          this.dictItemList = response.data.list
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.dictItemList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.dictItemList = []
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
    reset(formName) {
      this.form = {
        id: undefined,
        dictType: undefined,
        label: '',
        value: '',
        remark: '',
        status: 1,
        sort: 0
      }
      this.resetForm(formName)
    },
    // 新增
    handleAdd() {
      this.reset()
      this.form.dictType = this.dictModel.type
      this.open = true
      this.title = '添加字典属性'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      const dictItemId = row.id
      getDictItem(dictItemId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '添加字典属性'
      })
    },
    // 删除
    handleDelete(row) {
      let dictItemIds = []
      if (!Array.isArray(row.id)) {
        dictItemIds = [row.id]
      }
      this.$confirm('是否确认删除字典编号为"' + dictItemIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDictItem(dictItemIds)
      }).then(() => {
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      }).catch(function() {
      })
    },
    // 状态修改
    handleStatusChange(row) {
      console.log(row)
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.label + '"字典吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeDictItemStatus(row.id, row.status)
      }).then(() => {
        this.$message({ type: 'success', message: text + '成功' })
      }).catch(function() {
        row.status = row.status === 0 ? 1 : 0
      })
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
            addDictItem(this.form).then(response => {
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
            updateDictItem(this.form).then(response => {
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
