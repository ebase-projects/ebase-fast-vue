<template>
  <div class="app-container">
    <!--列表-->
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">字典列表</span>
          </div>
          <div class="head-container">
            <!--字典列表-->
            <el-form ref="queryForm" :model="queryParams" :inline="true">
              <el-form-item prop="keyword">
                <el-input
                  v-model="queryParams.keyword"
                  placeholder="请输入要查询的类型/名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
              </el-form-item>
            </el-form>

          </div>
          <el-table
            v-loading="loading"
            highlight-current-row
            :data="dictList"
            @current-change="handleCurrentChange"
          >
            <el-table-column label="字典名称" align="center" prop="name" :show-overflow-tooltip="true" />
            <el-table-column label="字典类型" align="center" prop="type" :show-overflow-tooltip="true" />
            <el-table-column label="是否系统" align="system" prop="sort" />
            <!--            <el-table-column label="状态" align="center">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-switch-->
            <!--                  v-model="scope.row.status"-->
            <!--                  active-color="#13ce66"-->
            <!--                  inactive-color="#ff4949"-->
            <!--                  :active-value="1"-->
            <!--                  :inactive-value="0"-->
            <!--                  @change="handleStatusChange(scope.row)"-->
            <!--                />-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="备注" align="center" prop="remark" width="120" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
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
        </el-card>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="字典名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入字典名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="字典别名" prop="type">
                  <el-input v-model="form.type" placeholder="请输入字典别名" />
                </el-form-item>
              </el-col>
              <!--              <el-col :span="24">-->
              <!--                <el-form-item label="状态">-->
              <!--                  <el-radio-group v-model="form.status">-->
              <!--                    <el-radio-button-->
              <!--                      v-for="dict in statusOptions"-->
              <!--                      :key="dict.value"-->
              <!--                      :label="dict.value"-->
              <!--                    >{{ dict.desc }}-->
              <!--                    </el-radio-button>-->
              <!--                  </el-radio-group>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
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

      </el-col>

      <el-col :span="12" :xs="24">
        <!--字典详情-->
        <dictItem :dict-model="currentDict" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { listDict, addDict, delDict, updateDict, getDict, changeDictStatus } from '@/api/system/dict'
import Pagination from '@/components/Pagination'
import DictItem from './dictItem'

export default {
  name: 'Dict',
  components: { Pagination, DictItem },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索是否显示
      searchToggle: true,
      currentId: undefined,
      currentDict: {},
      // 总条数
      total: 0,
      // 菜单列表
      dictList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      queryParams: {
        page: 1,
        limit: 10,
        keyword: undefined
      },
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '字典名不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '字典别名不能为空', trigger: 'blur' }
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
      listDict(this.queryParams).then(response => {
        if (response.code === 0) {
          this.dictList = response.data.list
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.dictList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.dictList = []
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
        name: '',
        type: undefined,
        system: 0,
        remark: '',
        status: 0,
        sort: 0
      }
      this.resetForm(formName)
    },
    // 新增
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加字典'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      const dictId = row.id
      getDict(dictId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改字典'
      })
    },
    // 删除
    handleDelete(row) {
      let dictIds = []
      if (!Array.isArray(row.id)) {
        dictIds = [row.id]
      }
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDict(dictIds)
      }).then(() => {
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
        this.currentDict = {}
      }).catch(function() {
      })
    },
    // 状态修改
    handleStatusChange(row) {
      // console.log(row.status)
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.name + '"字典吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeDictStatus(row.id, row.status)
      }).then(() => {
        this.$message({ type: 'success', message: text + '成功' })
      }).catch(function() {
        row.status = row.status === 0 ? 1 : 0
      })
    },
    // 导出
    handleExport() {

    },
    // 右侧回显
    handleCurrentChange(val) {
      if (val) {
        // const _this = this
        // 清空菜单的选中
        // 保存当前的字典id
        this.currentDict = val
        // console.log('----------------' + val)
      }
    },
    // 提交表单
    submitForm(formName) {
      // const _self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id === undefined) {
            // 新增
            addDict(this.form).then(response => {
              // const data = response.data.data
              // console.log(data)
              // console.log(_self.$refs[formName].fields)
              //
              // data.forEach(tmp => {
              //   console.log(tmp.fieldName)
              //   const filterElement = _self.$refs[formName].fields.filter((item) => (item.prop === tmp.fieldName))
              //   filterElement.message = tmp.message
              //   console.log(filterElement)
              // })

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
            updateDict(this.form).then(response => {
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
