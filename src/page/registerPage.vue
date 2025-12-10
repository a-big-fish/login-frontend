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
/* 外层包装，占据整个内容区域 */
.register-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit; /* 继承main-content的最小高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 注册容器 */
.register-container {
  width: 100%;
  max-width: 480px;
  position: relative;
}

/* 注册卡片 */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  padding: 25px 20px;
  width: 100%;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.register-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* 页面标题 */
.register-header {
  text-align: center;
  margin-bottom: 20px;
}

.register-title {
  font-size: 22px;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  font-size: 12px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

/* 注册表单 */
.register-form {
  margin-top: 12px;
  width: 100%;
}

/* 紧凑的表单项 */
.form-item-compact {
  margin-bottom: 12px !important;
  /* display: flex; */
  width: 90%;
  
  align-items: center;
}

.form-item-compact .el-form-item__label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  line-height: 40px;
  padding: 0 12px 0 0;
  text-align: left;
  position: relative;
  margin-right: 5px;
}

/* 必填项星号样式调整 */
.form-item-compact .el-form-item__label:before {
  content: '';
  position: absolute;
  left: -8px;
  color: #f56c6c;
  font-size: 12px;
}

.form-item-compact.is-required .el-form-item__label:before {
  content: '*';
}

.form-item-compact .el-form-item__content {
  margin-left: 0px;
  line-height: 40px;
  flex: 1;
  padding-right: 0;
}

.form-item-compact .el-input__inner {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding: 0 40px 0 15px;
  width: 100%;
  box-sizing: border-box;
}

.form-item-compact .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-item-compact .el-input__inner:hover {
  border-color: #c0c4cc;
}

/* 图标样式 */
.form-item-compact .el-input__prefix {
  left: 12px;
  color: #909399;
  font-size: 14px;
  line-height: 40px;
}

.form-item-compact .el-input__suffix {
  right: 12px;
  cursor: pointer;
  color: #909399;
  transition: color 0.3s ease;
  font-size: 14px;
  line-height: 40px;
}

.form-item-compact .el-input__suffix:hover {
  color: #667eea;
}

/* 注册按钮 */
.register-button-item {
  margin-top: 20px;
  margin-bottom: 12px;
  padding-left: 0;
  padding-right: 0;
}

.register-button {
  width: 100%;
  height: 42px;
  font-size: 15px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  border-radius: 21px;
  color: white;
}

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

/* 登录链接 */
.login-link {
  text-align: center;
  font-size: 12px;
  color: #606266;
  margin-top: 12px;
}

.login-link .el-link {
  font-size: 12px;
  margin-left: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-card {
    padding: 20px 15px;
    margin: 5px;
  }

  .register-title {
    font-size: 18px;
  }

  .form-item-compact .el-form-item__label {
    width: 70px !important;
    font-size: 11px;
    text-align: left;
  }

  .form-item-compact .el-input__inner {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    padding: 0 32px 0 35px;
  }

  .form-item-compact .el-input__prefix {
    font-size: 13px;
    left: 8px;
    line-height: 36px;
  }

  .form-item-compact .el-input__suffix {
    font-size: 13px;
    right: 8px;
    line-height: 36px;
  }

  .register-button {
    height: 32px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .register-wrapper {
    padding: 5px;
  }

  .register-card {
    padding: 18px 12px;
    border-radius: 10px;
  }

  .register-header {
    margin-bottom: 15px;
  }

  .form-item-compact .el-form-item__label {
    width: 65px !important;
    text-align: left;
  }
}

/* 小屏幕高度适配 */
@media (max-height: 700px) {
  .register-wrapper {
    padding: 5px;
  }

  .register-card {
    padding: 20px 20px;
  }

  .register-header {
    margin-bottom: 15px;
  }

  .form-item-compact {
    margin-bottom: 10px !important;
  }

  .register-button-item {
    margin-top: 15px;
    margin-bottom: 10px;
  }

  .form-item-compact .el-form-item__label {
    width: 75px !important;
  }
}

@media (max-height: 600px) {
  .register-title {
    font-size: 18px;
  }

  .register-subtitle {
    font-size: 11px;
  }

  .register-card {
    padding: 15px 18px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-card {
  animation: fadeInUp 0.3s ease-out;
}

/* 表单错误提示位置调整 */
.form-item-compact .el-form-item__error {
  padding-top: 1px;
  font-size: 10px;
  line-height: 1.2;
}
</style>