import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { loginUser } from '@/features/auth/services/authService'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()
  const errorMessage = ref('')
  const loading = ref(false)

  const login = async ({ email, password }) => {
    try {
      loading.value = true
      errorMessage.value = ''
      const data = await loginUser({ email, password })
      auth.login(data.user, data.token)
      await router.push('/dashboard')
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Error al conectar con el servidor'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    auth.logout()
    router.push('/')
  }

  return {
    login,
    logout,
    errorMessage,
    loading
  }
}
