import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // 引入 Vuex store
import ElementUI from 'element-ui'; // 引入element-ui结构
import 'element-ui/lib/theme-chalk/index.css'; // 引入element-ui样式
import Vuex from 'vuex'; // 引入vuex

// 关闭生产环节警告
Vue.config.productionTip = false

Vue.use(ElementUI); // 安装element-ui
Vue.use(Vuex); // 安装vuex

// 创建 Vue 实例时添加 store
new Vue({
  router,
  store, // 注入 store
  created(){
    console.log("页面创建，初始化");
    this.$store.dispatch("tempInit")
  },
  render: h => h(App),
}).$mount('#app')
