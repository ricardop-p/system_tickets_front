<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h2 class="fw-bold text-dark m-0">🎫 Centro de Soporte</h2>
      <div class="d-flex gap-2">
        <button @click="goToNewTicket" class="btn btn-success fw-bold">+ Nuevo Ticket</button>
        <button @click="logout" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>
      </div>
    </div>

    <h4 class="mb-4 text-secondary">Mis Solicitudes Actuales</h4>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="ticket in tickets" :key="ticket.id">
        <div @click="goToDetail(ticket.id)" style="cursor: pointer;" class="h-100">
          <InfoCard 
            :title="`Ticket #${ticket.id}`"
            :name="ticket.titulo"
            :description="`Prioridad: ${ticket.prioridad}`"
            :body="ticket.descripcion"
            :image="obtenerImagen(ticket.prioridad)"
            class="h-100"
          />
        </div>
      </div>
    </div>
    
    <div v-if="tickets.length === 0" class="text-muted text-center w-100 py-5">
      <p class="lead">No tienes tickets registrados aún.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InfoCard from '@/features/tickets/components/InfoCard.vue'
import { useAuth } from '@/features/auth/composables/useAuth'
import { useTickets } from '@/features/tickets/composables/useTickets'

const router = useRouter()
const { logout } = useAuth()
const { tickets, loadTickets, obtenerImagen } = useTickets()

const goToNewTicket = () => router.push('/tickets/nuevo')
const goToDetail = (id) => router.push(`/tickets/${id}`)

onMounted(async () => {
  await loadTickets()
})
</script>