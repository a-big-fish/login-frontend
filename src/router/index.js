// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers' // 导入定义好的规则
import store from '@/store'

Vue.use(VueRouter)

// 初始化store - 恢复用户登录状态
// store.dispatch("init")
// 创建路由守卫之前初始化store，暂时的
store.commit("RESTORE_FROM_STORAGE")

// 路由表，某个路由对应哪个视图组件
const router = new VueRouter({
  mode: 'history',
  routes // 使用导入的规则
})

// 捕获重复导航错误
// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

router.beforeEach((to, from, next) => {
  console.log('=== 路由守卫开始 ===')

  const isLoggedIn = store.getters.isLoggedIn
  console.log('当前登录状态:', isLoggedIn);
  console.log("token:", localStorage.getItem("token"));

  // 不用登录的页面
  // 检查是否公开路由
  const publicRoutes = ["/", "/login", "/register", "/error", "/home", "/404"]
  if(publicRoutes.some(route => {
      if(route == "/"){
          // 需要对于/这个路径单独处理
          return to.path === "/"
      } else{
        return to.path.startsWith(route)
      }
      })){

      next();
      console.log('=== 路由守卫结束 ===')
      return;
  }

  // 检查用户是否已登录
  // 如果访问的是需要登录的页面，且用户未登录，则重定向到错误页面
  if(!isLoggedIn){
    console.log("当前登录状态"+isLoggedIn+"，拒绝访问！");
    next({
      path: '/error',
      query: {
        message: '请先登录后再访问此页面',
        redirect: to.fullPath // 记录原始路径，方便登录后跳转回来
      }
    })
    return
  }
  console.log('=== 路由守卫结束 ===')
  next();
})

// 全局路由守卫，用于处理权限验证和错误拦截
// router.beforeEach(async (to, from, next) => {
//   // 获取当前登录状态
//   let isLoggedIn = store.getters.isLoggedIn

//   // 定义公开路由（不需要登录即可访问）
//   const publicRoutes = ["/", "/login", "/register", "/error", "/home"]
//   const isPublicRoute = publicRoutes.some(route => {
//     if(route == "/"){
//       return to.path === "/"
//     } else{
//       return to.path.startsWith(route)
//     }
//   })

//   // 如果token存在但isLoggedIn为false，尝试验证token
//   if (!isLoggedIn && localStorage.getItem('token')) {
//     console.log('发现token，正在验证...')
//     isLoggedIn = await store.dispatch('validateToken')
//   }

//   // 如果是公开路由，直接放行
//   if(isPublicRoute){
//     // 如果已登录，访问登录页则重定向到首页
//     if (to.path === '/login' && isLoggedIn) {
//       next('/')
//       return
//     }
//     next()
//     return
//   }

//   // 检查用户是否已登录
//   if(!isLoggedIn){
//     console.log("用户未登录，重定向到登录页")
//     next({
//       path: '/login',
//       query: {
//         redirect: to.fullPath // 记录原始路径，方便登录后跳转回来
//       }
//     })
//     return
//   }

//   // 已登录，正常访问
//   next()
// })

// 全局后置钩子
router.afterEach((to, from) => {
  // 可以在这里添加页面访问日志、错误统计等功能
  if (to.path === '/error' || to.path === '/404') {
    console.log('用户访问了错误页面，来源：', from.fullPath)
  }
})

export default router