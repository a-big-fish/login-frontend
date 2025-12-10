<template>
  <div class="home-container">
    <h1>欢迎，{{ user.username }}  </h1>
    <div class="btnBox1">
      <el-button type = "warning" @click="logout">登出</el-button>
    </div>

      
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
  data() {
    return {
      user:{
        id: '',
        username: '',
        token: '',
      }
    }
  },
  methods: {
    logout() {
      // 使用 Vuex 进行登出
      this.$store.dispatch('logout')
      this.showDropdown = false

      // 跳转到首页
      this.$router.push('/')

      // 显示提示信息
      this.$message?.success?.('已成功退出登录') || alert('已成功退出登录')
    }

  },
  created(){
    // 从vuex中加载用户信息到本地
    this.user = this.$store.getters.currentUser
  }
}
</script>
<style>


</style>