import api from '@/shared/api'

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const fetchCategories = async (token) => {
  const response = await api.get('/categorias', authHeaders(token))
  return response.data
}

export const fetchUsers = async (token) => {
  const response = await api.get('/usuarios', authHeaders(token))
  return response.data
}

export const fetchAllTickets = async (token) => {
  const response = await api.get('/tickets', authHeaders(token))
  return response.data
}
