<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户姓名" prop="realName">
      <el-input v-model="user.realName" />
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="user.mobile" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="user.gender" placeholder="请选择">
        <el-option
          v-for="dict in genderOptions"
          :key="dict.value"
          :label="dict.desc"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'UserInfo',
  components: {},
  props: {
    user: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 状态枚举类型
      genderOptions: [{ value: 0, desc: '男' }, { value: 1, desc: '女' }, { value: 2, desc: '保密' }],
      // 表单校验
      rules: {
        realName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  }, created() {
  },
  methods: {
    submit() {

    }
  }
}
</script>

<style scoped>

</style>
