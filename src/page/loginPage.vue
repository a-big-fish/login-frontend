<template>
  <div class="register-wrapper">
    <div class="login-container">
      <el-card class="login-card">
        <div class="login-header">
          <h2>用户登录</h2>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          @submit.native.prevent="handleLogin"
          label-position="left"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              size="medium"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              size="medium"
              show-password
              clearable
              @keyup.enter.native="handleLogin"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleLogin"
              :loading="loading"
              size="medium"
              class="login-btn"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-footer">
          <p>还没有账号？ <router-link to="/register">立即注册</router-link></p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 登录调用方法
    handleLogin() {
      // 校验表单规则
      this.$refs.loginForm.validate(async (valid) => {
        // 不合法返回
        if(! valid){
          this.$message.warning('请填写正确的登录信息')
          return false
        }
        // 加载特效
        this.loading = true

        try {
          // 登录API调用，传递用户名，密码，加密传输
          // 后端校验返回
          await this.simulateLogin()

          // 使用Vuex进行登录状态管理，包括登录状态，token保存等
          await this.$store.dispatch('login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          })

          // 显示成功消息
          this.$message.success('登录成功！')

          // 跳转到首页
          this.$router.push('/')

        } catch (error) {
          this.$message.error('登录失败：' + error.message)
        } finally {
          this.loading = false
        }

      })
    },
    
    // 模拟登录API
    simulateLogin() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.loginForm.username && this.loginForm.password) {
            resolve({ success: true })
          } else {
            reject(new Error('用户名和密码不能为空'))
          }
        }, 1000)
      })
    }
    
  }
}
</script>

<style scoped>
/* 外层包装，占据整个内容区域 */
.register-wrapper {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

/* Element UI 表单样式覆盖 */
.login-card .el-form-item__label {
  color: #555;
  font-weight: 500;
  padding-bottom: 8px;
}

.login-card .el-input__inner {
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: all 0.3s;
}

.login-card .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    max-width: 100%;
    border-radius: 0;
  }

  .register-wrapper {
    align-items: flex-start;
    padding-top: 50px;
  }
}
</style>