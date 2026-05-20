import api from '@/shared/api'

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const fetchTickets = async (token) => {
  const response = await api.get('/tickets', authHeaders(token))
  return response.data
}

export const fetchTicketById = async (id, token) => {
  const response = await api.get(`/tickets/${id}`, authHeaders(token))
  return response.data
}

export const createTicket = async (ticketData, token) => {
  await api.post('/tickets', ticketData, authHeaders(token))
}

export const updateTicketState = async (id, estado, token) => {
  await api.put(`/tickets/${id}/estado`, { estado }, authHeaders(token))
}

export const escalateTicket = async (id, token) => {
  await api.put(`/tickets/${id}/escalar`, {}, authHeaders(token))
}
