<template>
  <div slot="footer">
    <div v-if="searchToggle">
      <!--用户数据-->
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查看授权人员对话框-->
    <el-table
      ref="table"
      highlight-current-row
      style="width: 100%;"
      :data="userList"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="realName" label="姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column :show-overflow-tooltip="true" width="160" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRemoveUser(scope.row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getGrantUserByRole"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUserPageByRoleId, removeByRoleIdUserId } from '@/api/system/role'

export default {
  name: 'RoleUserList',
  components: { Pagination },
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 搜索是否显示
      searchToggle: true,
      // 总条数
      total: 0,
      userList: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        roleId: undefined,
        username: undefined
      }
    }
  },
  // watch: {
  //   roleId(val) {
  //     if (val) {
  //       this.queryParams.roleId = this.roleId
  //       this.getGrantUserByRole()
  //     }
  //   }
  // },
  created() {
    this.queryParams.roleId = this.roleId
    this.getGrantUserByRole()
  },
  methods: {
    // 查询
    handleQuery() {
      this.queryParams.page = 1
      this.getGrantUserByRole()
    },
    // 重置查询
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    getGrantUserByRole() {
      getUserPageByRoleId(this.queryParams).then(response => {
        if (response.code === 0) {
          this.userList = response.data.list
        } else {
          this.userList = []
          this.$message({ type: 'error', message: response.msg })
        }
      }).catch(function() {
        this.userList = []
      })
    },
    // 撤销角色
    handleRemoveUser(row) {
      const that = this
      this.$confirm('是否确认撤销用户为"' + row.username + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return removeByRoleIdUserId(row.id, that.roleId)
      }).then(() => {
        that.getGrantUserByRole()
        that.$message({ type: 'success', message: '操作成功' })
      }).catch(function() {
      })
    }

  }

}
</script>

<style scoped>

</style>
