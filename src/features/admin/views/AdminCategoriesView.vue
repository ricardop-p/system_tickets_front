<template>
  <div class="admin-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold m-0">Categorias</h2>
        <p class="text-muted m-0">Listado de categorias registradas.</p>
      </div>
      <RouterLink to="/admin" class="btn btn-outline-secondary btn-sm">Volver</RouterLink>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else class="table-responsive bg-white rounded shadow-sm">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td class="fw-semibold">{{ category.nombre || category.name }}</td>
            <td>{{ category.descripcion || category.description || 'Sin descripcion' }}</td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="3" class="text-center text-muted py-4">No hay categorias registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdmin } from '@/features/admin/composables/useAdmin'

const { categories, loading, error, loadCategories } = useAdmin()

onMounted(loadCategories)
</script>

<style scoped>
.admin-list {
  max-width: 1180px;
  margin: 0 auto;
}
</style>
