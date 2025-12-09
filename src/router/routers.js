// src/router/routes.js

// 路由表，某个路由对应哪个视图组件
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../page/homePage.vue') // 建议使用懒加载
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../page/loginPage.vue') // 建议使用懒加载
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../page/registerPage.vue') // 注册页面
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../page/errorPage.vue') // 错误页面
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../page/errorPage.vue') // 404页面使用同样的错误页面
  },
  {
    path: '/1',
    name: 'WelcomePage',
    component: () => import('../page/authPage/welcomePage.vue') 
  },



  // 最后匹配这个
  {
    path: '*', // 匹配所有未定义的路由
    redirect: '/404' // 重定向到404页面
  },

]

export default routes