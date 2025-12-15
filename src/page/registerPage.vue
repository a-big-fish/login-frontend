<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-card">
        <!-- 页面标题 -->
        <div class="register-header">
          <h2 class="register-title">用户注册</h2>
          <p class="register-subtitle">创建您的账户，开始使用我们的服务</p>
        </div>

        <!-- 注册表单 -->
        <el-form
          ref="registerForm"
          :model="form"
          :rules="rules"
          label-position="left"
          label-width="80px"
          class="register-form"
          @submit.native.prevent="handleRegister"
        >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username" class="form-item-compact">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              size="small"
              clearable
              maxlength="20"
            >
            </el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password" class="form-item-compact">
            <el-input
              v-model="form.password"
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              size="small"
              clearable
              maxlength="20"
            >
              <i
                slot="suffix"
                :class="passwordVisible ? 'el-icon-view' : 'el-icon-hide'"
                @click="passwordVisible = !passwordVisible"
                style="cursor: pointer; color: #909399; font-size: 14px;"
              ></i>
            </el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword" class="form-item-compact">
            <el-input
              v-model="form.confirmPassword"
              :type="confirmPasswordVisible ? 'text' : 'password'"
              placeholder="请再次输入密码"
              prefix-icon="el-icon-lock"
              size="small"
              clearable
              maxlength="20"
            >
              <i
                slot="suffix"
                :class="confirmPasswordVisible ? 'el-icon-view' : 'el-icon-hide'"
                @click="confirmPasswordVisible = !confirmPasswordVisible"
                style="cursor: pointer; color: #909399; font-size: 14px;"
              ></i>
            </el-input>
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email" class="form-item-compact">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱地址"
              prefix-icon="el-icon-message"
              size="small"
              clearable
              maxlength="50"
            >
            </el-input>
          </el-form-item>

          <!-- 电话 -->
          <el-form-item label="电话" prop="phone" class="form-item-compact">
            <el-input
              v-model="form.phone"
              placeholder="请输入电话号码"
              prefix-icon="el-icon-phone"
              size="small"
              clearable
              maxlength="11"
            >
            </el-input>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item class="register-button-item">
            <el-button
              type="primary"
              size="small"
              class="register-button"
              :loading="loading"
              native-type="submit"
              round
            >
              立即注册
            </el-button>
          </el-form-item>

          <!-- 登录链接 -->
          <div class="login-link">
            已有账户？
            <el-link type="primary" @click="goToLogin">立即登录</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { register as apiRegister } from '@/api/register';

export default {
  name: 'RegisterPage',
  data() {
    // 自定义验证函数：确认密码
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    // 自定义验证函数：用户名格式
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 3) {
        callback(new Error('用户名长度不能少于3个字符'))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error('用户名只能包含字母、数字和下划线'))
      } else {
        callback()
      }
    }

    return {
      // 表单数据
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
      },

      // 密码可见性
      passwordVisible: false,
      confirmPasswordVisible: false,

      // 加载状态
      loading: false,

      // 表单验证规则
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: false, message: '请输入电话号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 处理注册
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.submitRegistration()
        } else {
          this.$message.warning('请完善注册信息')
          return false
        }
      })
    },

    // 提交注册数据
    async submitRegistration() {
      this.loading = true

      try {
        // 构造注册数据
        const registerData = {
          username: this.form.username,
          password: this.form.password,
          email: this.form.email || null,
          phone: this.form.phone || null
        }

        // 注册
        await apiRegister(registerData)

        this.$message.success('注册成功！正在跳转...')

        // 注册成功后自动登录
        // 统一使用async/await避免混用then,catch
        try{
          await this.$store.dispatch('login', {
            username: registerData.username,
            password: registerData.password
          })
          console.log("登陆成功，后端正确返回");
          // 跳转到首页或登录页
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        }catch(loginError){
          // 注册成功但自动登录失败的特殊处理
          console.log("注册成功，但自动登录失败:", loginError);
          this.$message.warning('注册成功，但自动登录失败，请手动登录');
          this.$router.push('/login'); // 跳转到登录页
        }
      } catch (error) {
        // 这里会捕获注册失败的错误（包括"用户名已存在"）
        // 错误消息已经在拦截器中显示过了
        // this.$message.error(error.message || '注册失败，请稍后重试')
        console.log("注册过程失败:", error);
      } finally {
        this.loading = false
      }
    },

    // 模拟注册请求
    simulateRegistration(data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟随机失败（10% 概率）
          if (Math.random() < 0.1) {
            reject(new Error('用户名已存在'))
          } else {
            resolve({ success: true, data })
          }
        }, 1500) // 模拟网络延迟
      })
    },

    // 跳转到登录页
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url(../style/registerPage.scss);
</style>