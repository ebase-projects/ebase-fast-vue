<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-row :gutter="10">
        <el-col>
          <div class="grid-content bg-purple">
            <el-input
              v-model="query.deptName"
              clearable
              class="filter-item"
              style="width: 200px;"
              size="small"
              placeholder="请输入部门名称"
              @keyup.enter.native="handleFind"
            />
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFind">搜索
            </el-button>
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-refresh" @click="handleReset">重置
            </el-button>
            <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        deptName: ''
      }
    }
  },
  methods: {
    handleFind: {},
    handleReset: {},
    handleAdd: {}
  }
}

</script>

<style scoped>
</style>
