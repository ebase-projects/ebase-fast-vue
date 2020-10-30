<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="数据类型" prop="scopeType">
            <el-select v-model="form.scopeType" clearable placeholder="请选择">
              <el-option
                v-for="item in scopeTypeOptions"
                :key="item.value"
                :label="item.desc"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.scopeType==-10" :span="24">
          <el-form-item label="指定部门" prop="deptIdList">
            <treeselect
              v-model="form.deptIdList"
              :multiple="true"
              value-consists-of="ALL"
              :options="deptOptions"
              :normalizer="normalizer"
              :flatten-search-results="true"
              placeholder="请选择部门"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      <el-button @click="cancelForm('form')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listDept } from '@/api/system/dept'
import { addSysRoleDataScope, getDataScopeListByRoleId, updateSysRoleDataScope } from '@/api/system/role'

export default {
  name: 'RoleDataGrant',
  components: { Treeselect },
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 部门树选项
      deptOptions: [],
      scopeTypeOptions: [{
        value: 10,
        desc: '本人可见'
      }, {
        value: 20,
        desc: '所在部门可见'
      }, {
        value: 30,
        desc: '所在部门及子部门可见'
      }, {
        value: -10,
        desc: '自定义部门'
      }, {
        value: 99,
        desc: '全部'
      }],
      form: {},
      // 表单校验
      rules: {
        scopeType: [
          { required: true, message: '数据权限类型不能为空', trigger: 'blur' }
        ],
        deptIdList: [
          { required: true, message: '指定部门不能为空', trigger: 'blur,change' }
        ]
      }
    }
  },
  watch: {
    // 'form.scopeType': function(newValue, oldValue) {
    //   console.log(newValue)
    //   this.form.deptIdList = []
    // }
  },
  created() {
    this.getTreeselect()
    this.getDataScopeByRoleId(this.roleId)
  },
  methods: {
    getDataScopeByRoleId(roleId) {
      this.reset()
      getDataScopeListByRoleId(roleId).then(response => {
        if (response.code === 0) {
          if (response.data != null) {
            this.form = response.data
          }
        }
      })
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
    reset(formName) {
      this.form = {
        id: undefined,
        tenantId: undefined,
        roleId: undefined,
        scopeType: undefined,
        deptIdList: []
      }
      this.resetForm(formName)
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.roleId = this.roleId

          if (this.form.scopeType !== -10) {
            this.form.deptIdList = []
          }

          if (this.form.id === undefined) {
            // 新增
            addSysRoleDataScope(this.form).then(response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })

                this.grantDataOpen = false
                this.$emit('on-change', this.grantDataOpen)
              } else {
                this.$message({ type: 'error', message: response.msg })
              }
            })
          } else {
            // 修改
            updateSysRoleDataScope(this.form).then(response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })
                this.grantDataOpen = false
                this.$emit('on-change', this.grantDataOpen)
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
      this.grantDataOpen = false
      this.$emit('on-change', this.grantDataOpen)
      this.reset(formName)
    }

  }

}
</script>
