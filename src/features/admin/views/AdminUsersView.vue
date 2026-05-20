<template>
  <div class="admin-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold m-0">Usuarios</h2>
        <p class="text-muted m-0">Usuarios registrados en la plataforma.</p>
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
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td class="fw-semibold">{{ user.nombre || user.name || user.username || 'Sin nombre' }}</td>
            <td>{{ user.email || user.correo || 'Sin email' }}</td>
            <td>
              <span class="badge text-bg-primary">
                {{ user.rol || user.role || user.tipo || user.tipo_usuario || 'usuario' }}
              </span>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="text-center text-muted py-4">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdmin } from '@/features/admin/composables/useAdmin'

const { users, loading, error, loadUsers } = useAdmin()

onMounted(loadUsers)
</script>

<style scoped>
.admin-list {
  max-width: 1180px;
  margin: 0 auto;
}
</style>
