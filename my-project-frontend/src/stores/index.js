import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    count: 0,
    user: null,
    token: null,
    myname: '',
    accounts: [],
    color: '',
    userInformation: {}
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    increment() {
      this.count++
    },
    setUser(userData) {
      this.user = userData
    },
    setToken(token) {
      this.token = token
    },
    logout() {
      this.user = null
      this.token = null
    },
  },

  // 🔥 Persistence config
  persist: {
    key: 'my-app-store',
    paths: ['token', 'user'], // Only persist these fields (NOT count)
    storage: localStorage,    // or sessionStorage
  },
})