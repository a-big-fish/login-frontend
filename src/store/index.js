import Vue from 'vue'
import Vuex from 'vuex'
import { login as apiLogin, verifyToken } from '@/api/login'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    user: {
      id: null,
      username: '',
      avatar: '',
      token: null,
      roles: [],           // 角色代码数组，如 ['ADMIN', 'USER']
      // 权限信息（充分利用后端分类数据）
      permissions: {
        // 从后端 permissionsByType 直接转换而来
        byType: {
          page: [],      // 页面权限代码数组
          button: [],    // 按钮权限代码数组
          api: [],       // API权限代码数组
          menu: [],      // 菜单权限代码数组
        },
        // 扁平化列表（兼容性）
        all: [],          // 所有权限代码
        allDetails: [],   // 所有权限详细信息
        // 快捷访问（从前端计算得出）
        pages: [],        // 同 byType.page
        buttons: [],      // 同 byType.button
        apis: [],         // 同 byType.api
        menus: [],        // 同 byType.menu
      }
    },
    // 登录状态
    isLoggedIn: false,
    // 全局加载状态
    loading: false,
    // 错误信息
    error: null,
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
    getToken: state => state.user.token,
    // 获取角色信息
    getRoles: state => state.user.roles
  },

  // 同步方法
  mutations: {
    // 初始化，从本地存储恢复
    RESTORE_FROM_STORAGE(state){
      const token = localStorage.getItem("token")
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      const userInfo = localStorage.getItem("userInfo")
      const userRoles = localStorage.getItem("userRoles")
      const userPermissions = localStorage.getItem("userPermissions")
      
      console.log("从本地初始化数据");
      console.log({isLoggedIn, token, userInfo, userRoles, userPermissions});
      // 恢复token
      if(token){
        state.user.token = token
      }
      
      // 恢复用户基本信息
      if(userInfo){
        try {
          const info = JSON.parse(userInfo)
          state.user.id = info.id
          state.user.username = info.username
          state.user.avatar = info.avatar || ''
        } catch (e) {
          console.error('用户信息解析失败，使用空对象')
          // 解析失败时不覆盖现有数据
        }
      }
      // 恢复用户角色信息
      if(userRoles){
        try{
          state.user.roles = JSON.parse(userRoles);
        }catch(e){
          console.error('解析用户角色失败:', e);
          state.user.roles = [];
        }
      }
      // 恢复权限
      if (userPermissions) {
        try {
          const permissions = JSON.parse(userPermissions);
          state.user.permissions = {
            byType: permissions.byType || { page: [], button: [], api: [], menu: [] },
            all: permissions.all || [],
            allDetails: permissions.allDetails || [],
            pages: permissions.pages || permissions.byType?.page || [],
            buttons: permissions.buttons || permissions.byType?.button || [],
            apis: permissions.apis || permissions.byType?.api || [],
            menus: permissions.menus || permissions.byType?.menu || []
          };
        } catch (e) {
          console.error('解析用户权限失败:', e);
          state.user.permissions = {
            byType: { page: [], button: [], api: [], menu: [] },
            all: [],
            allDetails: [],
            pages: [],
            buttons: [],
            apis: [],
            menus: []
          };
        }
      }
      // 最后恢复登录状态
      if(isLoggedIn){
        state.isLoggedIn = true
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
        token: null,
        roles: [],
        permissions: {
          byType: { page: [], button: [], api: [], menu: [] },
          all: [],
          allDetails: [],
          pages: [],
          buttons: [],
          apis: [],
          menus: []
        }
      };
      state.isLoggedIn = false
      state.error = null
      // 清除 localStorage
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userRoles')
      localStorage.removeItem('userPermissions')
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
    },


  // 核心：处理 PermissionDto 数据
  SET_PERMISSION_DTO(state, permissionDto) {
    if (!permissionDto) return;
    
    // 1. 设置角色
    if (permissionDto.userRoles) {
      state.user.roles = permissionDto.userRoles;
    } else if (permissionDto.roleInfos) {
      // 从 RoleInfo 对象中提取角色代码
      state.user.roles = permissionDto.roleInfos.map(role => role.roleCode);
    }
    
    // 2. 处理权限分类数据
    if (permissionDto.permissionsByType) {
      // 直接存储按类型分类的数据
      state.user.permissions.byType = {
        page: [],
        button: [],
        api: [],
        menu: [],
        ...permissionDto.permissionsByType
      };
      
      // 为方便访问，创建快捷引用
      state.user.permissions.pages = state.user.permissions.byType.page || [];
      state.user.permissions.buttons = state.user.permissions.byType.button || [];
      state.user.permissions.apis = state.user.permissions.byType.api || [];
      state.user.permissions.menus = state.user.permissions.byType.menu || [];
    }
    
    // 3. 处理扁平化权限数据
    if (permissionDto.userPermissions) {
      state.user.permissions.all = permissionDto.userPermissions;
    }
    
    if (permissionDto.permissionInfos) {
      state.user.permissions.allDetails = permissionDto.permissionInfos;
    }
    
    // 4. 如果只有 permissionTypeAndCode，需要解析
    if (permissionDto.permissionTypeAndCode && !permissionDto.permissionsByType) {
      // 解析 "type:code" 格式的字符串
      const byType = { page: [], button: [], api: [], menu: [] };
      const allCodes = [];
      
      permissionDto.permissionTypeAndCode.forEach(item => {
        const [type, code] = item.split(':');
        if (type && code) {
          // 添加到分类
          if (byType[type]) {
            byType[type].push(code);
          } else {
            byType[type] = [code];
          }
          // 添加到所有权限
          allCodes.push(code);
        }
      });
      
      state.user.permissions.byType = byType;
      state.user.permissions.all = allCodes;
    }
    
    // 持久化存储
    localStorage.setItem('userPermissions', JSON.stringify(state.user.permissions));
    localStorage.setItem('userRoles', JSON.stringify(state.user.roles));
  },

  },

  actions: {

    // -todo 登录操作
    async login({ commit }, loginForm) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        // 调用登录API，此处返回用户基本信息
        const response = await apiLogin(loginForm)
        const { id, token, username, permissionDto } = response

        console.log(permissionDto);

        if(permissionDto){
          try{
            commit("SET_PERMISSION_DTO", permissionDto)
          }catch(e){
            console.log("无权限信息");
          }
        }

        // 假设后端返回格式：{ code: 200, data: { token: 'xxx', user: {} }, message: '登录成功' }

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
        const userInfo = await verifyToken()
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