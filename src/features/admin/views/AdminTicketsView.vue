<template>
  <div class="admin-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold m-0">Todos los tickets</h2>
        <p class="text-muted m-0">Tickets creados por los usuarios.</p>
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
            <th>Titulo</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Usuario</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td class="fw-semibold">{{ ticket.titulo }}</td>
            <td>{{ ticket.prioridad }}</td>
            <td>
              <span class="badge text-bg-secondary">{{ ticket.estado || 'Sin estado' }}</span>
            </td>
            <td>{{ ticket.usuario_nombre || ticket.usuario || ticket.user_name || ticket.user_id || 'N/A' }}</td>
            <td class="text-end">
              <RouterLink :to="`/tickets/${ticket.id}`" class="btn btn-outline-primary btn-sm">
                Ver
              </RouterLink>
            </td>
          </tr>
          <tr v-if="tickets.length === 0">
            <td colspan="6" class="text-center text-muted py-4">No hay tickets registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdmin } from '@/features/admin/composables/useAdmin'

const { tickets, loading, error, loadAllTickets } = useAdmin()

onMounted(loadAllTickets)
</script>

<style scoped>
.admin-list {
  max-width: 1180px;
  margin: 0 auto;
}
</style>
