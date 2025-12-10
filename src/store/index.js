import Vue from 'vue'
import Vuex from 'vuex'
import { login as apiLogin, getUserInfo } from '@/api/login'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    user: {
      id: null,
      username: '',
      avatar: '',
      token: null
    },
    // 登录状态
    isLoggedIn: false,
    // 全局加载状态
    loading: false,
    // 错误信息
    error: null
  },

  getters: {
    // 获取用户登录状态
    isLoggedIn: state => !!state.isLoggedIn,
    // 获取用户信息
    currentUser: state => state.user,
    // 获取加载状态
    isLoading: state => state.loading,
    // 获取错误信息
    getError: state => state.error,
    // 获取token
    getToken: state => state.user.token
  },

  // 同步方法
  mutations: {
    // 初始化
    INITIALIZE_FROM_STORAGE(state){
      const token = localStorage.getItem("token")
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      const userInfo = localStorage.getItem("userInfo")
      console.log("从本地初始化数据");
      console.log({isLoggedIn, token, userInfo});
      if(token){
        state.user.token = token
        state.isLoggedIn = true
        if(userInfo){
          try {
            const userData = JSON.parse(userInfo)
            // 保留原有token，合并用户信息
            state.user = { ...state.user, ...userData }
          } catch (e) {
            console.error('用户信息解析失败，使用空对象')
            // 解析失败时不覆盖现有数据
          }
        } else{
          // 没有token，确保状态是干净的
          state.user.token = ''
          state.userInfo = {}
        }
      }
    },
    // 设置用户信息
    SET_USER(state, user) {
      state.user = { ...state.user, ...user }
      state.isLoggedIn = true
      // 保存到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(user))
      if (user.token) {
        localStorage.setItem('token', user.token)
      }
    },

    // 清除用户信息（登出）
    CLEAR_USER(state) {
      state.user = {
        id: null,
        username: '',
        avatar: '',
        token: null
      }
      state.isLoggedIn = false
      // 清除 localStorage
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
    },

    // 设置token
    SET_TOKEN(state, token) {
      state.user.token = token
      localStorage.setItem('token', token)
    },

    // 设置加载状态
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    // 设置错误信息
    SET_ERROR(state, error) {
      state.error = error
    },

    // 清除错误信息
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    // 这里是异步方法，时间上不一定来的及，得在同步方法中初始化
    // initializeStore({ commit }) {
    //   // 从 localStorage 中读取 isLoggedIn
    //   const isLoggedIn = localStorage.getItem("isLoggedIn")
    //   commit("setIsLoggedIn", isLoggedIn)
    // },
    // tempInit({commit}, status){
    //   // 从 localStorage 中读取 isLoggedIn
    //   let isLoggedIn = status
    //   console.log("执行1");
    //   commit("setIsLoggedIn", isLoggedIn)
    // },

    // -todo 登录操作
    async login({ commit }, loginForm) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        // 调用登录API
        const response = await apiLogin(loginForm)

        // 假设后端返回格式：{ code: 200, data: { token: 'xxx', user: {} }, message: '登录成功' }

        const { id, token, username } = response
        if (token) {
          commit('SET_TOKEN', token)

          // 如果有用户信息，一并保存
          try{
            commit('SET_USER', { id,token,username })
          }catch(err){
            console.log("无用户信息");
          }

          // 设置登录状态
          localStorage.setItem('isLoggedIn', 'true')

          return { token, username }
        } else {
          throw new Error('登录失败：未获取到token')
        }
      } catch (error) {
        commit('SET_ERROR', error.message || '登录失败')
        throw error
      } finally{
        commit('SET_LOADING', false)
      }
    },

    // 登出操作
    logout({ commit }) {
      commit('CLEAR_USER')
      commit('CLEAR_ERROR')
      // 跳转到登录页
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      }
    },

    // -todo 验证token有效性
    async validateToken({ commit, state }) {
      const token = state.user.token || localStorage.getItem('token')
      console.log("检验token有效性",token);
      if (!token) {
        return false
      }

      try {
        // 调用后端验证token的接口
        const userInfo = await getUserInfo()

        // 更新用户信息
        commit('SET_USER', { ...userInfo, token })
        return true
      } catch (error) {
        // token无效或过期
        commit('CLEAR_USER')
        return false
      }
    },

    // -todo 初始化用户信息（从 localStorage 恢复）
    initUser({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const userInfo = localStorage.getItem('userInfo')
      const isLoggedIn = localStorage.getItem('isLoggedIn')

      if (token && isLoggedIn === 'true') {
        try {
          // 先设置token
          commit('SET_TOKEN', token)

          // 如果有用户信息
          if (userInfo) {
            const user = JSON.parse(userInfo)
            commit('SET_USER', user)
          }

          // 异步验证token有效性
          dispatch('validateToken').catch(() => {
            console.log('Token验证失败，需要重新登录')
          })
          
        } catch (error) {
          console.error('恢复用户信息失败:', error)
          commit('CLEAR_USER')
        }
      }
    },

    // 清除错误信息
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },

    init({ commit, dispatch }, status){
      commit('setIsLoggedIn', status)
    },
  }
})