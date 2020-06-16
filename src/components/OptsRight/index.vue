<template>
  <el-button-group class="opts-right">
    <el-button size="mini" type="info" icon="el-icon-search" @click="toggleSearch()" />
    <el-button size="mini" icon="el-icon-refresh" @click="handleQuery()" />
  </el-button-group>
</template>

<script>
export default {
  name: 'OptsRight',
  methods: {
    // 是否隐藏搜索栏
    toggleSearch() {
      this.$emit('toggle-search')
    },
    // 刷新
    handleQuery() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>
  .opts-right {
    float: right;
  }
</style>
