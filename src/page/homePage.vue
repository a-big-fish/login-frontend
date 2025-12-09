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
      
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      message: "我是一条消息",
      tempLoginStatus: false,

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
        
    }
  },
  watch: {
    tempLoginStatus(newVal, oldVal){
      // console.log(newVal);
      this.$store.commit("setIsLoggedIn",newVal)
    }
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