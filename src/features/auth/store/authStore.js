import { defineStore } from 'pinia'
import { decodeJwt, getRoleFromToken, getRoleFromUser, isAdminToken, isAgentToken } from '../utils/jwt'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    tokenPayload: (state) => decodeJwt(state.token),
    userRole: (state) => getRoleFromToken(state.token) || getRoleFromUser(state.user),
    isAdmin: (state) => {
      const role = getRoleFromToken(state.token) || getRoleFromUser(state.user)
      return isAdminToken(state.token) || role === 'admin' || role === 'administrador'
    },
    isAgent: (state) => {
      const role = getRoleFromToken(state.token) || getRoleFromUser(state.user)
      return isAgentToken(state.token) || role === 'agente' || role === 'tecnico' || role === 'técnico' || role === 'agent'
    }
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
