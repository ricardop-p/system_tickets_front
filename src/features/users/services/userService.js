import api from '@/shared/api'

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const fetchUsers = async (token) => {
  const response = await api.get('/usuarios', authHeaders(token))
  return response.data
}

export const createUser = async (userData, token) => {
  const response = await api.post('/usuarios', userData, authHeaders(token))
  return response.data
}

export const updateUser = async (id, userData, token) => {
  const response = await api.put(`/usuarios/${id}`, userData, authHeaders(token))
  return response.data
}

export const updateUserStatus = async (id, estado, token) => {
  const response = await api.put(`/usuarios/${id}/estado`, { estado }, authHeaders(token))
  return response.data
}
