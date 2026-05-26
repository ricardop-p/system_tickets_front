import api from '@/shared/api'

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const fetchCategories = async (token) => {
  const response = await api.get('/categories/list', authHeaders(token))
  return response.data
}

export const createCategory = async (categoryData, token) => {
  const response = await api.post('/categories/create', categoryData, authHeaders(token))
  return response.data
}

export const updateCategoryStatus = async (id, isActive, token) => {
  const response = await api.patch('/categories/status', { id, isActive }, authHeaders(token))
  return response.data
}
