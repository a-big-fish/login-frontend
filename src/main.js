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

// 创建vue之前，同步初始化store状态
// 调用同步的mutation，确保立即有结果
store.commit("INITIALIZE_FROM_STORAGE")

// 创建 Vue 实例时添加 store
new Vue({
  router,
  store, // 注入 store
  // created的时机可能在创建路由守卫之后，可能会太晚
  created(){
    console.log("页面创建，初始化");
  },
  render: h => h(App),
}).$mount('#app')
