import api from '@/shared/api'

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const validateSeniority = async (years, token) => {
  const response = await api.get('/varius/seniority', {
    ...authHeaders(token),
    params: { years }
  })

  return response.data
}
