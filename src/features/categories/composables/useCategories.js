import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import * as categoryService from '@/features/categories/services/categoryService'

export function useCategories() {
  const auth = useAuthStore()
  const categories = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)

  const loadCategories = async () => {
    loading.value = true
    error.value = null

    try {
      categories.value = await categoryService.fetchCategories(auth.token)
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error cargando categorias'
    } finally {
      loading.value = false
    }
  }

  const saveCategory = async (categoryData) => {
    saving.value = true
    error.value = null

    try {
      await categoryService.createCategory(categoryData, auth.token)
      await loadCategories()
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error guardando categoria'
      throw err
    } finally {
      saving.value = false
    }
  }

  const changeStatus = async (id, estado) => {
    saving.value = true
    error.value = null

    try {
      await categoryService.updateCategoryStatus(id, estado, auth.token)
      await loadCategories()
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error actualizando categoria'
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    categories,
    loading,
    saving,
    error,
    loadCategories,
    saveCategory,
    changeStatus
  }
}
