import { constantRoutes } from '@/router'

const state = {
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, asyncRoutes) {
    commit('SET_ROUTES', asyncRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
