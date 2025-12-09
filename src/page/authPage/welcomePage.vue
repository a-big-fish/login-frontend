<template>
  <div class="home-container">
    <h1>This is WelcomePage  </h1>
    <div class="btnBox1">
      <el-button type = "primary" @click="login">登录</el-button>
      <el-button type = "warning" @click="exit">退出</el-button>
    </div>

      
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
  data() {
    return {

    }
  },
  methods: {
    login(){
      this.$store.commit("setIsLoggedIn",true)
      console.log('当前登录状态:', this.$store.getters.isLoggedIn)
    },
    exit(){
      this.$store.commit("setIsLoggedIn",false)
      console.log('当前登录状态:', this.$store.getters.isLoggedIn)
      // 强制刷新
      location.reload()
    },
  }
}
</script>
<style>


</style>