import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import * as userService from '@/features/users/services/userService'

export function useUsers() {
  const auth = useAuthStore()
  const users = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  const loadUsers = async () => {
    loading.value = true
    error.value = null

    try {
      users.value = await userService.fetchUsers(auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error cargando usuarios'
    } finally {
      loading.value = false
    }
  }

  const saveUser = async (userData) => {
    saving.value = true
    error.value = null

    try {
      await userService.createUser(userData, auth.token)
      await loadUsers()
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error guardando usuario'
      throw err
    } finally {
      saving.value = false
    }
  }

  const changeStatus = async (id, estado) => {
    saving.value = true
    error.value = null

    try {
      await userService.updateUserStatus(id, estado, auth.token)
      await loadUsers()
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error actualizando usuario'
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    users,
    loading,
    saving,
    error,
    loadUsers,
    saveUser,
    changeStatus
  }
}
