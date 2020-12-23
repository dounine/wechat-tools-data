import { createStore } from 'vuex'
import position from '../api/position'
import variables from './settings.js'

const golds: any[] = []
export default createStore({
  state: {
    theme: variables.theme,
    loading: true,
    positions: [],
    golds,
    token: null
  },
  mutations: {//sync
    setToken(state, value) {
      state.token = value
    },
    setLoading(state, value) {
      state.loading = value
    },
    setPositions(state, value) {
      state.positions = value
    },
    setTimeout(state, value) {
      if (value.timeout <= 0) {
        if (this[`timeout${value.id}`]) {
          const interval: any = this[`timeout${value.id}`]
          clearInterval(interval)
          state.golds = state.golds.filter(item => {
            return !(item.id === value.id && !item.name)
          }).map(item => { return { ...item } })
        }
      }
      const exit = state.golds.find(gold => gold.id === value.id)
      if (exit) {
        state.golds = state.golds.map(item => {
          if (item.id === value.id) {
            return {
              ...item,
              timeout: value.timeout
            }
          } else {
            return {
              ...item
            }
          }
        })
      }
    }
  },
  actions: {//async
    addGold({ commit, state }, payload) {
      console.log(payload);
      const exit = state.golds.find(gold => gold.id === payload.data.id)
      if (exit) {
        let timeout = payload.data.timeouts
        if (payload.type === 'loginScan') {
          this[`timeout${payload.data.id}`] = setInterval(() => {
            timeout--;
            commit('setTimeout', {
              id: payload.data.id,
              timeout
            })
          }, 1000)
        }
        if (payload.type === "goldDelete") {
          state.golds = state.golds.filter(item => {
            return item.id !== payload.data.id
          }).map(item => { return { ...item } })
        } else {
          state.golds = state.golds.map(item => {
            if (item.id === payload.data.id) {
              return {
                ...item,
                ...payload.data,
              }
            } else {
              return {
                ...item
              }
            }
          })
        }
      } else {
        if (payload.type === "goldCreate") {
          state.golds.push(payload.data)
        }
      }
    },
  },
  modules: {
  },
  getters: {
  }
})
