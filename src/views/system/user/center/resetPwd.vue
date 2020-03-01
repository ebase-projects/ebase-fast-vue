<template>
  <el-form ref="form" :model="passwordDTO" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="passwordDTO.oldPassword" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="passwordDTO.newPassword" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmNewPassword">
      <el-input v-model="passwordDTO.confirmNewPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from '@/api/system/user'

export default {
  name: 'ResetPwd',
  components: {},
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.passwordDTO.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passwordDTO: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmNewPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmNewPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserPwd(this.passwordDTO).then(
            response => {
              if (response.code === 0) {
                this.$message({ type: 'success', message: '操作成功' })
              } else {
                this.$message({ type: 'error', message: response.msg })
              }
            }
          )
        }
      })
    }

  }

}
</script>

<style scoped>

</style>
