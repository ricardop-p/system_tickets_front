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

export const fetchTicketComments = async (id, token) => {
  const response = await api.get(`/tickets/${id}/comments`, authHeaders(token))
  return response.data
}

export const createTicket = async (ticketData, token) => {
  try {
    const response = await api.post('/createTickets', ticketData, authHeaders(token))
    return response.data
  } catch (error) {
    if (error.response?.status !== 404) throw error

    const response = await api.post('/tickets', ticketData, authHeaders(token))
    return response.data
  }
}

export const updateTicketState = async (id, estado, token) => {
  await api.patch(`/tickets/${id}/status`, { status: estado }, authHeaders(token))
}

export const escalateTicket = async (id, token) => {
  await api.patch(`/tickets/${id}/status`, { status: 'ESCALATED' }, authHeaders(token))
}

export const createTicketComment = async (ticketId, comment, token) => {
  try {
    const response = await api.post('/tickets/comments', { id: ticketId, ticket_id: ticketId, comment }, authHeaders(token))
    return response.data
  } catch (error) {
    if (error.response?.status !== 404) throw error

    const response = await api.post(`/tickets/${ticketId}/comments`, { comment }, authHeaders(token))
    return response.data
  }
}
