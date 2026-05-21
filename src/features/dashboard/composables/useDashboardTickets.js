import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import { fetchTickets } from '@/features/tickets/services/ticketService'

export function useDashboardTickets() {
  const auth = useAuthStore()
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadTickets = async () => {
    loading.value = true
    error.value = null

    try {
      tickets.value = await fetchTickets(auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error cargando tickets'
    } finally {
      loading.value = false
    }
  }

  return {
    tickets,
    loading,
    error,
    loadTickets
  }
}
