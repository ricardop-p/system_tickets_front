import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import * as ticketService from '@/features/tickets/services/ticketService'

export function useTickets() {
  const auth = useAuthStore()
  const tickets = ref([])
  const ticket = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const obtenerImagen = (prioridad) => {
    if (prioridad === 'Crítica') {
      return 'https://img.freepik.com/vector-gratis/simbolo-signo-exclamacion-rojo-e-icono-signo-atencion-o-precaucion-problema-peligro-alerta_40876-3505.jpg'
    }
    return 'https://img.freepik.com/vector-gratis/simbolo-alerta-campana-amarilla-vectorial-3d-redes-sociales-icono-notificacion-signo-exclamacion-rojo-aislado_40876-3504.jpg'
  }

  const badgePrio = (prioridad) => {
    if (prioridad === 'Crítica') return 'badge bg-danger'
    if (prioridad === 'Alta') return 'badge bg-warning text-dark'
    return 'badge bg-info text-dark'
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleString('es-CO')
  }

  const loadTickets = async () => {
    loading.value = true
    error.value = null

    try {
      tickets.value = await ticketService.fetchTickets(auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando tickets'
    } finally {
      loading.value = false
    }
  }

  const loadTicket = async (id) => {
    loading.value = true
    error.value = null

    try {
      ticket.value = await ticketService.fetchTicketById(id, auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error cargando ticket'
      ticket.value = null
    } finally {
      loading.value = false
    }
  }

  const createNewTicket = async (ticketData) => {
    loading.value = true
    error.value = null

    try {
      await ticketService.createTicket(ticketData, auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creando ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  const changeTicketState = async (id, estado) => {
    loading.value = true
    error.value = null

    try {
      await ticketService.updateTicketState(id, estado, auth.token)
      await loadTicket(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error actualizando estado'
      throw err
    } finally {
      loading.value = false
    }
  }

  const escalate = async (id) => {
    loading.value = true
    error.value = null

    try {
      await ticketService.escalateTicket(id, auth.token)
      await loadTicket(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error escalando ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tickets,
    ticket,
    loading,
    error,
    obtenerImagen,
    badgePrio,
    formatearFecha,
    loadTickets,
    loadTicket,
    createNewTicket,
    changeTicketState,
    escalate
  }
}
