<template>
  <div class="home-container">
    <h1>This is HomePage  </h1>
    <div>====================================</div>
    <h1>{{ message }}</h1>
    <div class="messageBox1">
      <textarea class="textarea1"
      v-model="message" placeholder="输入信息，上方显示">change</textarea>
    </div>
    <div class="btn1">
        <el-button type="primary" @click="fun1()">没用的按钮</el-button>  
        <el-button type="danger" @click="fun2()">有用的按钮</el-button>  
    </div>
    <div class="messageBos2">
      <textarea class="textarea1"
      v-model="tempLoginStatus" placeholder="输入信息，上方显示"></textarea>
    </div>
      

    <div class="auth_btn">
      <el-button type="warning" @click="toWelcomePage">点击前往欢迎界面</el-button>
      <el-button type = "primary" v-permission = "'admin.access'">
        有权限才能看到的小按钮
      </el-button>
      <el-button type = "primary" v-role = "'admin'">
        嘻嘻，我也是
      </el-button>

    </div>
    
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      message: "我是一条消息",
      tempLoginStatus: false,
      info: [],
    }
  },
  methods: {
    fun1(){
        this.message = null;
    },
    fun2(){
        if(this.$store.getters.isLoggedIn == false){
            alert("先登录！再给你有用！")
            this.$router.push("/login")
            return;
        }
        if(this.message != "我要登录！"){
            alert("口令错误")
            return
        }
        // 登录跳转实际页面
        this.$router.push("/welcomePage")
        
    },
    toWelcomePage(){
      const roles = this.$store.getters.getRoles[0]
      switch (roles){
        case "admin":
          console.log("admin>>>>", roles);
          this.$router.push("/adminWelcomePage")
          return;
        case "user":
          this.$router.push("/userWelcomePage")
          return
        default:
          this.$router.push("/welcomePage")
          return
      }

    }
  },
  watch: {
    tempLoginStatus(newVal, oldVal){
      // console.log(newVal);
      this.$store.commit("setIsLoggedIn",newVal)
    }
  },
  mounted(){
    this.info = this.$store.state.user
  }
}
</script>
<style>
.textarea1{
    height: 50px;
    width: 40%;
    resize: none;
    margin: 10px 0 10px 0;
}
</style>