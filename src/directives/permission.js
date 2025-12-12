// directives/permission.js - Vue 2 版本
const permissionDirective = {
  bind(el, binding, vnode) {
    checkPermission(el, binding, vnode);
  },
  update(el, binding, vnode) {
    checkPermission(el, binding, vnode);
  }
};

// 角色指令
const roleDirective = {
  bind(el, binding, vnode) {
    checkRole(el, binding, vnode);
  },
  update(el, binding, vnode) {
    checkRole(el, binding, vnode);
  }
};

// 权限检查核心函数
function checkPermission(el, binding, vnode) {
  const { value, arg } = binding;
  console.log('权限检查:', { 
    element: el, 
    permission: value, 
    type: arg,
    vnode: vnode 
  });

  // 验证参数
  if (value === undefined || value === null) {
    console.warn('v-permission 指令需要权限代码参数');
    return;
  }

  // 获取组件实例（Vue 2 方式）
  const vm = vnode.context;
  if (!vm) {
    console.warn('无法获取组件实例');
    return;
  }

  // 获取 store（Vue 2 方式）
  const store = vm.$store;
  if (!store) {
    console.warn('无法获取 Vuex store');
    return;
  }

  // 检查权限
  const hasPermission = hasRequiredPermission(store, value, arg);

  // 控制元素显示/隐藏
  updateElementVisibility(el, hasPermission, store, value);
}


// 角色检查函数
function checkRole(el, binding, vnode) {
  const { value } = binding;
  const vm = vnode.context;
  const store = vm.$store
  // 获取角色数据
  const roles = getRoles(vm);
  // 检查角色
  const hasRole = hasRoleCheck(value, roles);
  
  // 更新元素
  updateElementVisibility(el, hasRole, store, value);
}
// 获取角色
function getRoles(vm) {
  return vm?.$store?.state?.user?.roles ||
         JSON.parse(localStorage.getItem('roles') || '[]');
}
// 角色检查逻辑
function hasRoleCheck(required, roles) {
  if (!required) return true;
  if (Array.isArray(required)) {
    // 多个角色，需要全部满足
    return required.every(role => roles.includes(role));
  }
  return roles.includes(required);
}




// 检查是否拥有所需权限
function hasRequiredPermission(store, requiredPermission, type = null) {
  // 从 Vuex store 获取用户状态
  const userState = store.state.user;

  console.log('当前用户状态:', userState);

  // 确保权限数据存在
  if (!userState || !userState.permissions) {
    console.warn('用户权限数据未初始化');
    return false;
  }

  // 根据类型检查权限
  if (type) {
    switch (type) {
      case 'button':
        return userState.permissions.buttons?.includes(requiredPermission) ||
               userState.permissions.all?.includes(requiredPermission);
      case 'page':
        return userState.permissions.pages?.includes(requiredPermission) ||
               userState.permissions.all?.includes(requiredPermission);
      default:
        return userState.permissions.all?.includes(requiredPermission);
    }
  }

  // 默认检查所有权限
  return userState.permissions.all?.includes(requiredPermission);
}

// 更新元素可见性
function updateElementVisibility(el, hasPermission, store, permissionCode) {
  console.log(`权限检查结果: ${permissionCode} -> ${hasPermission ? '通过' : '拒绝'}`);

  if (!hasPermission) {
    // 无权限时，隐藏元素
    el.style.display = 'none';
    el.style.visibility = 'hidden';

    // 添加自定义属性以便调试
    el.setAttribute('data-permission-denied', permissionCode);
    el.setAttribute('data-checked', 'true');

    // 添加禁用类
    el.classList.add('permission-denied');

    // 如果是按钮，禁用点击
    if (el.tagName === 'BUTTON' || el.classList.contains('el-button')) {
      el.disabled = true;
      el.setAttribute('title', '您没有此操作权限');
      el.style.cursor = 'not-allowed';
    }
  } else {
    // 有权限时，恢复显示
    el.style.display = '';
    el.style.visibility = '';
    el.removeAttribute('data-permission-denied');
    el.setAttribute('data-checked', 'true');
    el.classList.remove('permission-denied');

    // 恢复按钮状态
    if (el.tagName === 'BUTTON' || el.classList.contains('el-button')) {
      el.disabled = false;
      el.removeAttribute('title');
      el.style.cursor = '';
    }
  }
}
export { permissionDirective, roleDirective };