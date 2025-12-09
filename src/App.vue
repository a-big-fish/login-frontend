<template>
  <div id="app">
    <!-- 使用AppNav组件 -->
    <AppNav />

    <!-- 主要内容区域 -->
    <main class="main-content">
      
      <!-- 这里是动态内容区域，根据路由变化 -->
      <router-view/>
    </main>

    <footer class="footer">
      我是网页底部
    </footer>
  </div>
</template>
<script>
import AppNav from '@/components/Nav.vue'

export default {
  name: 'App',
  components: {
    AppNav
  },
  data(){
    return{
      
    }
  },
  methods:{
    

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 主要内容区域，避免被固定导航栏遮挡 */
.main-content {
  margin-top: 60px; /* 导航栏高度 */
  padding: 20px;
  min-height: calc(100vh - 60px - 80px); /* 减去导航栏和底部高度 */
}

.footer{
  font-size: large;
  color: grey;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f9fa;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #dee2e6;
}

</style>
