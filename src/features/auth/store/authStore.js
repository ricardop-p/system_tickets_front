import { defineStore } from 'pinia'
import { decodeJwt, getRoleFromToken, isAdminToken } from '../utils/jwt'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    tokenPayload: (state) => decodeJwt(state.token),
    userRole: (state) => getRoleFromToken(state.token),
    isAdmin: (state) => isAdminToken(state.token)
  },
  actions: {
    login(userData, token) {
      this.user = userData
      this.token = token
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})
