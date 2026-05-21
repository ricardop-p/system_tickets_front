import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import * as slaService from '@/features/sla/services/slaService'

export function useSlaPolicies() {
  const auth = useAuthStore()
  const policies = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  const loadPolicies = async () => {
    loading.value = true
    error.value = null

    try {
      policies.value = await slaService.fetchSlaPolicies(auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error cargando politicas SLA'
    } finally {
      loading.value = false
    }
  }

  const updatePolicy = async (id, policyData) => {
    saving.value = true
    error.value = null

    try {
      await slaService.updateSlaPolicy(id, policyData, auth.token)
      await loadPolicies()
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error actualizando politica SLA'
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    policies,
    loading,
    saving,
    error,
    loadPolicies,
    updatePolicy
  }
}
