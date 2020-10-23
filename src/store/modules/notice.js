import { notReadCount } from '@/api/notice/notice'

const getDefaultState = () => {
  return {
    unreadCount: 0
  }
}
// 初始化状态
const state = getDefaultState()

// 编写动作
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_UNREAD_COUNT: (state, unreadCount) => {
    state.unreadCount = unreadCount
  }
}
// 取值
// getters:{},
// 创建驱动，可异步
const actions = {
  getUnreadCount({ commit }) {
    return new Promise((resolve, reject) => {
      notReadCount().then(response => {
        const noticeNotReadCount = response.data
        commit('SET_UNREAD_COUNT', noticeNotReadCount)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
