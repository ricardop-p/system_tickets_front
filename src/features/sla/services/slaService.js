import api from '@/shared/api'

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const fetchSlaPolicies = async (token) => {
  const response = await api.get('/sla-politicas', authHeaders(token))
  return response.data
}

export const updateSlaPolicy = async (id, policyData, token) => {
  const response = await api.put(`/sla-politicas/${id}`, policyData, authHeaders(token))
  return response.data
}
