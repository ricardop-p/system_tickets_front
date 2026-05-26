import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import { validateSeniority } from '@/features/age-validator/services/ageValidatorService'

export function useAgeValidator() {
  const auth = useAuthStore()
  const loading = ref(false)
  const error = ref(null)
  const result = ref(null)

  const validateAge = async ({ name, years }) => {
    const normalizedName = String(name || '').trim()
    const normalizedYearsText = String(years ?? '').trim()
    const normalizedYears = Number(normalizedYearsText)

    error.value = null
    result.value = null

    if (!normalizedName) {
      error.value = 'Ingresa el nombre para validar la edad'
      return
    }

    if (!normalizedYearsText || !Number.isFinite(normalizedYears) || normalizedYears < 0) {
      error.value = 'Ingresa una edad valida'
      return
    }

    loading.value = true

    try {
      const response = await validateSeniority(normalizedYears, auth.token)
      result.value = {
        name: normalizedName,
        years: normalizedYears,
        response
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error validando la edad'
    } finally {
      loading.value = false
    }
  }

  const clearResult = () => {
    error.value = null
    result.value = null
  }

  return {
    loading,
    error,
    result,
    validateAge,
    clearResult
  }
}
