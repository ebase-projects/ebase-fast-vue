<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="searchToggle">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="部门名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入部门名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择部门状态" clearable size="small">
              <el-option
                v-for="dict in typeOptions"
                :key="Number(dict.value)"
                :label="dict.desc"
                :value="Number(dict.value)"
              />
            </el-select>
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
        </el-row>
      </el-button-group>

      <opts-right @toggle-search="toggleSearch" @refresh="handleQuery" />
    </div>
    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="name" label="部门名称" width="200" />
      <el-table-column prop="type" label="类型" :formatter="typeFormat" width="200" />
      <el-table-column prop="sort" label="排序" width="200" />
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200" />
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.createTime) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col v-if="form.pid && form.pid !== '0' " :span="24">
            <el-form-item label="上级部门" prop="pid">
              <treeselect v-model="form.pid" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="部门类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio-button
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.desc }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="Number(dict.value)"
                  :label="Number(dict.value)"
                >
                  {{ dict.desc }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, getDeptDictsByEnum } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import OptsRight from '@/components/OptsRight'

export default {
  name: 'Dept',
  components: { Treeselect, OptsRight },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索是否显示
      searchToggle: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 部门类型字典
      typeOptions: [],

      // 查询参数
      queryParams: {
        name: undefined,
        type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pid: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '部门类型不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    getDeptDictsByEnum('deptType').then(response => {
      this.typeOptions = response.data
    })
    getDeptDictsByEnum('deptStatus').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true
      listDept(this.queryParams).then(response => {
        this.deptList = response.data
        this.loading = false
      })
    },
    /** 转换部门数据结构 */
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
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listDept().then(response => {
        this.deptOptions = response.data
      })
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 部门类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    toggleSearch() {
      this.searchToggle = !this.searchToggle
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        pid: undefined,
        name: undefined,
        type: undefined,
        sort: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row.id !== undefined) {
        this.form.pid = row.id
      } else {
        this.form.pid = 0
      }
      this.open = true
      this.title = '添加部门'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getDept(row.id).then(response => {
        this.form = response.data
        console.log(this.form)
        this.open = true
        this.title = '修改部门'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateDept(this.form).then(response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })
                this.open = false
                this.getList()
              } else {
                this.$message({ type: 'error', message: response.data })
              }
            })
          } else {
            addDept(this.form).then(response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })
                this.open = false
                this.getList()
              } else {
                this.$message({ type: 'error', message: response.data })
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDept(row.id)
      }).then(() => {
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      }).catch(function() {
      })
    }
  }
}
</script>
