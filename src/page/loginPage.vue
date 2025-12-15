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

          <el-form-item prop="captcha" label="验证码" class="captcha-form-item">
            <div class="captcha-container">
              <el-input
                class="captcha-input"
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                prefix-icon="el-icon-share"
                size="medium"
              >
              </el-input>
              <img class="captcha-image" :src="captchaImg" alt="验证码" @click="getCaptcha" />
            </div>
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
import { 
  login as apiLogin, 
  getCaptcha as apiGetCaptcha, 
  verifyCaptcha as apiVerifyCaptcha } from '@/api/login';

export default {
  name: "LoginPage",
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
      },
      captchaImg: '',
      captchaKey: '',
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
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
        // 验证码验证
        
        const captchaResult = await this.verifyCaptcha()
        if(captchaResult == null){
          console.log("验证码错误");
          this.loading = false
          return
        }
        console.log(captchaResult);
        

        // 尝试登录
        try {
          // 登录API调用，传递用户名，密码，加密传输
          // 后端校验返回
          // await this.simulateLogin()

          // vuex统一状态管理，vuex里处理登录API请求等
          // 使用Vuex进行登录状态管理，包括登录状态，token保存等

          const res = await this.$store.dispatch('login', this.loginForm)
          console.log(res);

          // 显示成功消息
          this.$message.success('登录成功！')

          // 跳转到首页
          this.$router.push('/')


        } catch (loginError) {
          // 在api的request.js中进行统一处理了，这里可以不写
          console.log("loginPage出错");
          this.$message.error('登录失败：' + loginError.message)
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
    },
    
    // 获取验证码，防抖使用
    getCaptcha: debounce(function(){
      apiGetCaptcha()
      .then(res => {
        const key = res.key
        const image = res.image
        this.captchaImg = image == null ? "" : image
        this.captchaKey = key
      })
      .catch(err => {
        console.log(err);
      })
    },1000),
    // 验证验证码
      async verifyCaptcha(){
      const inputCaptcha = this.loginForm.captcha
      console.log("输入验证码为：", inputCaptcha);
      const res = await apiVerifyCaptcha({
        key: this.captchaKey,
        code: inputCaptcha
      })
      return res
    }
  },
  created() {
    this.getCaptcha()
  },
  mounted() {
    this.getCaptcha()
  },
}
// 配置防抖
function debounce(func,delay){
  let timeout;
  return function(...args){
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), delay)
  }
}

</script>

<style scoped>
@import url(../style/loginPage.scss);

</style>