<template>
  <div class="workbench">
    <section class="metrics-grid">
      <article class="metric-card">
        <span>Abiertos sin asignar</span>
        <strong>{{ unassignedCount }}</strong>
        <div class="metric-icon metric-blue">F</div>
      </article>

      <article class="metric-card">
        <span>En mesa de trabajo</span>
        <strong>{{ inProgressCount }}</strong>
        <div class="metric-icon metric-purple">G</div>
      </article>

      <article class="metric-card metric-warning">
        <span>Casos escalados</span>
        <strong>{{ escalatedCount }}</strong>
        <div class="metric-icon metric-orange">!</div>
      </article>

      <article class="metric-card">
        <span>Resueltos / cerrados</span>
        <strong>{{ closedCount }}</strong>
        <div class="metric-icon metric-green">V</div>
      </article>
    </section>

    <section class="filters-panel">
      <div class="panel-title">
        <span class="filter-icon">Y</span>
        <h2>Filtros y busqueda multicriterio</h2>
        <button type="button" @click="clearFilters">Limpiar filtros</button>
      </div>

      <div class="filters-grid">
        <label>
          <span>Palabra clave (TID, titulo, solicitante)</span>
          <input v-model="filters.search" type="search" placeholder="Buscar ticket..." />
        </label>

        <label>
          <span>Estado</span>
          <select v-model="filters.status">
            <option value="">Todos los estados</option>
            <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </label>

        <label>
          <span>Prioridad</span>
          <select v-model="filters.priority">
            <option value="">Todas</option>
            <option v-for="priority in priorityOptions" :key="priority" :value="priority">{{ priority }}</option>
          </select>
        </label>

        <label>
          <span>Categoria</span>
          <select v-model="filters.category">
            <option value="">Todas</option>
            <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>

        <label>
          <span>Agente asignado</span>
          <select v-model="filters.agent">
            <option value="">Cualquier agente</option>
            <option v-for="agent in agentOptions" :key="agent" :value="agent">{{ agent }}</option>
          </select>
        </label>
      </div>

      <div class="sla-filter">
        <span>Alertas especiales</span>
        <label>
          <input v-model="filters.sla" type="radio" value="" />
          Todos los SLA
        </label>
        <label>
          <input v-model="filters.sla" type="radio" value="expired" />
          Vencidos / expirados
        </label>
        <label>
          <input v-model="filters.sla" type="radio" value="ok" />
          A tiempo
        </label>
      </div>
    </section>

    <section class="tickets-panel">
      <div class="tickets-heading">
        <div>
          <h2>{{ dashboardTitle }}</h2>
          <p>Mostrando {{ filteredTickets.length }} de {{ tickets.length }} tickets registrados en la mesa de ayuda</p>
        </div>
      </div>

      <div v-if="loading" class="state-message">Cargando tickets...</div>
      <div v-else-if="error" class="alert alert-danger m-3">{{ error }}</div>

      <div v-else class="table-responsive">
        <table class="table align-middle admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titulo</th>
              <th>Solicitante</th>
              <th>Agente asignado</th>
              <th>Categoria</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>SLA</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in filteredTickets" :key="ticket.id">
              <td class="ticket-id">#TKT-{{ ticket.id }}</td>
              <td class="ticket-title">{{ ticket.titulo || ticket.title || 'Sin titulo' }}</td>
              <td>{{ requesterName(ticket) }}</td>
              <td>{{ agentName(ticket) }}</td>
              <td>{{ categoryName(ticket) }}</td>
              <td>
                <span :class="priorityClass(ticket.prioridad || ticket.priority)">
                  {{ ticket.prioridad || ticket.priority || 'Media' }}
                </span>
              </td>
              <td>
                <span :class="statusClass(ticket.estado || ticket.status)">
                  {{ ticket.estado || ticket.status || 'Abierto' }}
                </span>
              </td>
              <td>
                <span :class="slaClass(ticket)">
                  {{ isSlaExpired(ticket) ? 'Vencido SLA' : 'A tiempo' }}
                </span>
              </td>
              <td>{{ formatDate(ticket.created_at || ticket.fecha_creacion || ticket.createdAt) }}</td>
            </tr>
            <tr v-if="filteredTickets.length === 0">
              <td colspan="9" class="text-center text-muted py-4">No hay tickets con los filtros aplicados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useDashboardTickets } from '@/features/dashboard/composables/useDashboardTickets'

const auth = useAuthStore()
const { tickets, loading, error, loadTickets } = useDashboardTickets()

const filters = reactive({
  search: '',
  status: '',
  priority: '',
  category: '',
  agent: '',
  sla: ''
})

const normalize = (value) => String(value || '').trim().toLowerCase()

const requesterName = (ticket) => (
  ticket.solicitante ||
  ticket.solicitante_nombre ||
  ticket.usuario_nombre ||
  ticket.usuario ||
  ticket.user_name ||
  'Sin solicitante'
)

const agentName = (ticket) => (
  ticket.agente_asignado ||
  ticket.agente_nombre ||
  ticket.tecnico_nombre ||
  ticket.agent_name ||
  ticket.assigned_to ||
  'Sin asignar'
)

const categoryName = (ticket) => (
  ticket.categoria ||
  ticket.categoria_nombre ||
  ticket.category ||
  'Sin categoria'
)

const uniqueOptions = (getter) => computed(() => {
  const values = tickets.value.map(getter).filter(Boolean)
  return [...new Set(values)]
})

const statusOptions = uniqueOptions((ticket) => ticket.estado || ticket.status)
const priorityOptions = uniqueOptions((ticket) => ticket.prioridad || ticket.priority)
const categoryOptions = uniqueOptions(categoryName)
const agentOptions = uniqueOptions(agentName)

const isUnassigned = (ticket) => normalize(agentName(ticket)) === 'sin asignar'
const isEscalated = (ticket) => normalize(ticket.estado || ticket.status).includes('escal')
const isClosed = (ticket) => {
  const status = normalize(ticket.estado || ticket.status)
  return status.includes('cerr') || status.includes('resuel')
}
const isInProgress = (ticket) => {
  const status = normalize(ticket.estado || ticket.status)
  return status.includes('proceso') || status.includes('trabajo') || status.includes('asign')
}
const isSlaExpired = (ticket) => {
  const sla = normalize(ticket.sla || ticket.estado_sla || ticket.sla_status)
  return sla.includes('venc') || sla.includes('expir') || Boolean(ticket.sla_vencido)
}

const unassignedCount = computed(() => tickets.value.filter(isUnassigned).length)
const inProgressCount = computed(() => tickets.value.filter(isInProgress).length)
const escalatedCount = computed(() => tickets.value.filter(isEscalated).length)
const closedCount = computed(() => tickets.value.filter(isClosed).length)

const dashboardTitle = computed(() => {
  if (auth.isAdmin) return 'Bitacora de seguimiento general'
  if (auth.isAgent) return 'Tickets asignados'
  return 'Mis tickets creados'
})

const filteredTickets = computed(() => {
  const search = normalize(filters.search)

  return tickets.value.filter((ticket) => {
    const searchable = normalize([
      ticket.id,
      ticket.titulo,
      ticket.title,
      requesterName(ticket),
      agentName(ticket),
      categoryName(ticket)
    ].join(' '))

    const matchesSearch = !search || searchable.includes(search)
    const matchesStatus = !filters.status || normalize(ticket.estado || ticket.status) === normalize(filters.status)
    const matchesPriority = !filters.priority || normalize(ticket.prioridad || ticket.priority) === normalize(filters.priority)
    const matchesCategory = !filters.category || normalize(categoryName(ticket)) === normalize(filters.category)
    const matchesAgent = !filters.agent || normalize(agentName(ticket)) === normalize(filters.agent)
    const matchesSla = !filters.sla || (filters.sla === 'expired' ? isSlaExpired(ticket) : !isSlaExpired(ticket))

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAgent && matchesSla
  })
})

const clearFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.priority = ''
  filters.category = ''
  filters.agent = ''
  filters.sla = ''
}

const priorityClass = (priority) => {
  const value = normalize(priority)
  if (value.includes('crit')) return 'pill pill-red'
  if (value.includes('alta')) return 'pill pill-orange'
  if (value.includes('media')) return 'pill pill-blue'
  return 'pill pill-gray'
}

const statusClass = (status) => {
  const value = normalize(status)
  if (value.includes('escal')) return 'pill pill-red-outline'
  if (value.includes('proceso')) return 'pill pill-blue-strong'
  if (value.includes('cerr') || value.includes('resuel')) return 'pill pill-green'
  return 'pill pill-gray'
}

const slaClass = (ticket) => isSlaExpired(ticket) ? 'pill pill-red-outline' : 'pill pill-green'

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CO')
}

onMounted(loadTickets)
</script>

<style scoped>
.workbench {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 26px;
}

.metric-card,
.filters-panel,
.tickets-panel {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.metric-card {
  min-height: 112px;
  padding: 24px;
  position: relative;
}

.metric-card span {
  color: #587098;
  display: block;
  font-size: 0.84rem;
  font-weight: 900;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.metric-card strong {
  color: #020617;
  font-size: 2.2rem;
  line-height: 1;
}

.metric-warning {
  border-left: 4px solid #f97316;
}

.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  position: absolute;
  right: 22px;
  top: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.metric-blue { background: #eff6ff; color: #2563eb; }
.metric-purple { background: #f5f3ff; color: #7c3aed; }
.metric-orange { background: #fff7ed; color: #f97316; }
.metric-green { background: #dcfce7; color: #16a34a; }

.filters-panel {
  padding: 28px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.panel-title h2,
.tickets-heading h2 {
  color: #061734;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  margin: 0;
  text-transform: uppercase;
}

.filter-icon {
  color: #547197;
  font-weight: 900;
}

.panel-title button {
  margin-left: auto;
  border: 0;
  border-radius: 8px;
  background: #eef2f7;
  color: #52657f;
  font-weight: 800;
  padding: 8px 12px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 14px;
}

.filters-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filters-grid span,
.sla-filter > span {
  color: #8a9bbd;
  font-size: 0.66rem;
  font-weight: 900;
  text-transform: uppercase;
}

.filters-grid input,
.filters-grid select {
  border: 1px solid #d2dbe9;
  border-radius: 10px;
  height: 40px;
  padding: 0 14px;
}

.sla-filter {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
}

.sla-filter label {
  display: flex;
  align-items: center;
  gap: 7px;
}

.tickets-panel {
  overflow: hidden;
}

.tickets-heading {
  padding: 20px 28px;
  border-bottom: 1px solid #dce5f2;
}

.tickets-heading p {
  color: #8a9bbd;
  font-size: 0.78rem;
  font-weight: 800;
  margin: 4px 0 0;
}

.admin-table {
  margin: 0;
}

.admin-table thead th {
  background: #f8fafc;
  color: #020617;
  font-size: 0.72rem;
  font-weight: 900;
  height: 60px;
  text-transform: uppercase;
}

.admin-table tbody td {
  color: #334155;
  font-size: 0.86rem;
  height: 68px;
}

.ticket-id,
.ticket-title {
  color: #061734 !important;
  font-weight: 900;
}

.pill {
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 2px 9px;
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.pill-red { background: #fee2e2; color: #b91c1c; }
.pill-orange { background: #ffedd5; color: #c2410c; }
.pill-blue { background: #dbeafe; color: #1d4ed8; }
.pill-blue-strong { background: #dbeafe; color: #2563eb; }
.pill-green { background: #dcfce7; color: #047857; }
.pill-gray { background: #e5e7eb; color: #475569; }
.pill-red-outline { background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; }

.state-message {
  color: #64748b;
  padding: 28px;
}

@media (max-width: 1200px) {
  .metrics-grid,
  .filters-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (max-width: 700px) {
  .metrics-grid,
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .sla-filter {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
