<template>
  <div class="home-container">
    <h1>欢迎你，管理员！</h1>
    <div class="btnBox1">
      <el-button type = "primary" @click="login">登录</el-button>
      <el-button type = "warning" @click="exit">退出</el-button>
    </div>
    <div class="btnBox2">
      <el-input v-model="username" placeholder="修改的用户名"></el-input>
      <p>{{ username }}</p>
      <el-button type = "primary" 
                @click="changeUserIdentify" 
                :loading="loading">
                修改用户权限
      </el-button>

    </div>
    
    


  </div>
</template>

<script>
import { updateUser } from '@/api/admin';

export default {
  name: "WelcomePage",
  data() {
    return {
      username: '',
      loading: false
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
    changeUserIdentify(){
      if(this.username == ''){
        this.$message.error("请输入用户名！")
        return
      }
      this.loading = true
      this.$confirm(`修改 ${this.username} 用户权限?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          try{
            const res = updateUser()
            this.$message.info(res)
            
          }catch(err){
            console.error(err);
          }

          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        }).finally(e=>{
          this.loading = false
        })
        ;
    }
  }
}
</script>
<style>
.btnBox2{
  margin-top: 50px;
}

</style>