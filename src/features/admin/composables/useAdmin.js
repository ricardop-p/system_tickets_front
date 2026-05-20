import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import * as adminService from '@/features/admin/services/adminService'

export function useAdmin() {
  const auth = useAuthStore()
  const categories = ref([])
  const users = ref([])
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)

  const runRequest = async (request) => {
    loading.value = true
    error.value = null

    try {
      return await request()
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error cargando informacion'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadCategories = async () => {
    categories.value = await runRequest(() => adminService.fetchCategories(auth.token))
  }

  const loadUsers = async () => {
    users.value = await runRequest(() => adminService.fetchUsers(auth.token))
  }

  const loadAllTickets = async () => {
    tickets.value = await runRequest(() => adminService.fetchAllTickets(auth.token))
  }

  return {
    categories,
    users,
    tickets,
    loading,
    error,
    loadCategories,
    loadUsers,
    loadAllTickets
  }
}
