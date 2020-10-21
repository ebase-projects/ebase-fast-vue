<template>
  <div class="user-choose">
    <el-button type="primary" :icon="icon" size="mini" @click="userModalVisible=true">{{ text }}</el-button>
    <span class="clear" @click="clearSelectData">清空已选</span>

    <p>
      已选择<span class="select-count">{{ selectUsers.length }}</span> 人
    </p>
    <p>
      <el-tag
        v-for="(item, i) in selectUsers"
        :key="i"
        color="default"
        closable
        @close="handleCancelUser(item)"
      >
        {{ item.username }}
      </el-tag>
    </p>

    <el-dialog v-if="userModalVisible" :title="title" append-to-body :visible.sync="userModalVisible" :width="width">
      <div class="app-container">
        <!--列表-->
        <el-row :gutter="20">
          <el-col :span="4" :xs="24">
            <!--部门数据-->
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                ref="tree"
                :data="deptOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </el-col>

          <el-col :span="20" :xs="24">
            <div class="head-container">
              <div>
                <!--用户数据-->
                <el-form ref="queryForm" :model="queryParams" :inline="true">
                  <el-form-item label="用户名" prop="username">
                    <el-input
                      v-model="queryParams.username"
                      placeholder="用户名"
                      clearable
                      size="small"
                      @keyup.enter.native="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="手机号码" prop="mobile">
                    <el-input
                      v-model="queryParams.mobile"
                      placeholder="手机号码"
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

            </div>

            <el-table
              v-loading="loading"
              highlight-current-row
              :data="userList"
            >
              <el-table-column type="index" label="序号" align="center" />
              <el-table-column label="用户名" align="center" prop="username" :show-overflow-tooltip="true" />
              <el-table-column label="用户昵称" align="center" prop="realName" :show-overflow-tooltip="true" />
              <el-table-column label="部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
              <el-table-column label="手机号码" align="center" prop="mobile" width="120" />
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    disabled
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </template>
              </el-table-column>
              <!--              <el-table-column label="创建时间" align="center" prop="createTime" width="160">-->
              <!--                <template slot-scope="scope">-->
              <!--                  <span>{{ parseTime(scope.row.createTime) }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-plus" @click="chooseUser(scope.row)">添加用户</el-button>
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
          </el-col>
        </el-row>

      </div>
    </el-dialog>

  </div>

</template>

<script>
import { listUser, getUserDictsByEnum } from '@/api/system/user'
import { listDept } from '@/api/system/dept'
import { getDictsByCode } from '@/api/system/dict'
import Pagination from '@/components/Pagination'
export default {
  name: 'UserChooseMultiple',
  components: { Pagination },
  props: {
    text: {
      type: String,
      default: '选择用户'
    },
    icon: {
      type: String,
      default: 'el-icon-search'
    },
    title: {
      type: String,
      default: '选择用户'
    },
    width: {
      type: String,
      default: '900px'
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      selectUsers: [],
      // 是否显示弹出层
      userModalVisible: false,
      // 日期范围
      dateRange: [],
      // 部门名称查询
      deptName: undefined,
      // 部门树选项
      deptOptions: [],
      // 状态枚举类型
      statusOptions: [],
      // 状态枚举类型
      genderOptions: [],
      // 部门数据格式字段转换
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        username: undefined,
        mobile: undefined,
        status: undefined,
        deptId: undefined
      },
      form: {}
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }

  },
  created() {
    this.getList()
    this.getTreeselect()
    getUserDictsByEnum('userStatus').then(response => {
      this.statusOptions = response.data
    })
    getDictsByCode('sex').then(response => {
      this.genderOptions = response.data
    })
  },
  methods: {
    // 获取部门树列表
    getTreeselect() {
      listDept().then(response => {
        this.deptOptions = response.data
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
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    handleNotBindDept() {
      this.queryParams.deptId = -1
      this.getList()
    },
    // 获取列表
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        if (response.code === 0) {
          this.userList = response.data.list
          this.total = Number(response.data.total)
          this.loading = false
        } else {
          this.userList = []
          this.total = 0
          this.loading = false
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.userList = []
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
      this.queryParams.deptId = undefined
      this.resetForm('queryForm')
      this.handleQuery()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    clearSelectData() {
      this.selectUsers = []
      this.$emit('on-change', this.selectUsers)
    },
    chooseUser(v) {
      // 去重
      const that = this
      let flag = true
      this.selectUsers.forEach(e => {
        if (v.id === e.id) {
          that.$message({ type: 'warn', message: `已经添加过「${v.username}」请勿重复选择` })
          flag = false
        }
      })
      if (flag) {
        const u = {
          id: v.id,
          username: v.username,
          nickname: v.nickname
        }
        this.selectUsers.push(u)
        this.$emit('on-change', this.selectUsers)
        this.$message({ type: 'success', message: `添加用户「${v.username}」成功` })
      }
    },
    handleCancelUser(e, id) {
      // 删除所选用户
      this.selectUsers.splice(this.selectUsers.indexOf(e), 1)
      this.$emit('on-change', this.selectUsers)
      this.$message({ type: 'success', message: '删除所选用户成功' })
    }

  }
}
</script>

<style scoped>

.user-choose  .clear {
  font-size: 12px;
  margin-left: 15px;
  color: #40a9ff;
  cursor: pointer;
}
.user-choose  .collapse {
  font-size: 12px;
  margin-top: 15px;
  width: 500px;
}
.user-choose  .select-count {
  font-weight: 600;
  color: #40a9ff;
}

</style>
