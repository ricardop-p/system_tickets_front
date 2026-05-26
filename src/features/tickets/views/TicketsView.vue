<template>
  <div class="requester-page">
    <section class="metrics-grid">
      <article class="metric-card">
        <div>
          <span>Tickets abiertos</span>
          <strong>{{ openCount }}</strong>
        </div>
        <i class="metric-icon metric-blue">+</i>
      </article>

      <article class="metric-card">
        <div>
          <span>En mesa / proceso</span>
          <strong>{{ inProgressCount }}</strong>
        </div>
        <i class="metric-icon metric-soft">o</i>
      </article>

      <article class="metric-card metric-success">
        <div>
          <span>Resueltos</span>
          <strong>{{ resolvedCount }}</strong>
        </div>
        <i class="metric-icon metric-green">v</i>
      </article>

      <article class="metric-card metric-warning">
        <div>
          <span>Escalado L3</span>
          <strong>{{ escalatedCount }}</strong>
        </div>
        <i class="metric-icon metric-orange">!</i>
      </article>
    </section>

    <section class="tickets-panel">
      <header class="panel-heading">
        <h2>Lista de tickets personales</h2>
        <button type="button" class="primary-action" @click="openModal">
          <span>+</span>
          Registrar nuevo ticket
        </button>
      </header>

      <div v-if="loading && !showModal" class="state-box">Cargando tickets...</div>
      <div v-else-if="error" class="alert-box">{{ error }}</div>

      <div v-else class="table-wrap">
        <table class="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asunto solicitud</th>
              <th>Categoria</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>SLA</th>
              <th>Agente asignado</th>
              <th>Fecha estimada / creacion</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticketItem in tickets" :key="ticketItem.id">
              <td class="ticket-id">#TKT-{{ ticketItem.id }}</td>
              <td class="ticket-title">{{ ticketTitle(ticketItem) }}</td>
              <td>{{ ticketCategory(ticketItem) }}</td>
              <td>
                <span :class="priorityClass(ticketPriority(ticketItem))">
                  {{ ticketPriority(ticketItem) }}
                </span>
              </td>
              <td>
                <span :class="statusClass(ticketStatus(ticketItem))">
                  {{ statusLabel(ticketStatus(ticketItem)) }}
                </span>
              </td>
              <td>
                <span :class="slaClass(ticketItem)">
                  {{ slaLabel(ticketItem) }}
                </span>
              </td>
              <td>{{ ticketAgent(ticketItem) }}</td>
              <td class="date-cell">{{ formatDate(ticketDate(ticketItem)) }}</td>
              <td>
                <button type="button" class="row-action" @click="goToDetail(ticketItem.id)">
                  Ver ficha
                </button>
              </td>
            </tr>
            <tr v-if="tickets.length === 0">
              <td colspan="9" class="empty-row">No tienes tickets registrados aun.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="showModal" class="modal-backdrop">
      <form class="ticket-modal" @submit.prevent="submitTicket">
        <header>
          <h3><span>+</span> Registrar solicitud de soporte tecnico (SLA)</h3>
          <button type="button" aria-label="Cerrar" @click="closeModal">x</button>
        </header>

        <div class="modal-body">
          <div class="info-callout">
            <strong>?</strong>
            <p>
              Completa los parametros detallados a continuacion. Nuestro
              <b>Algoritmo de Priorizacion SLA</b> analizara el impacto de manera autonoma
              para determinar el agente idoneo e iniciar el cronometro de soporte institucional.
            </p>
          </div>

          <label>
            Titulo resumido del incidente
            <input
              v-model.trim="form.title"
              type="text"
              placeholder="Ej. Mi pantalla externa parpadea continuamente o no es detectada"
              required
            />
          </label>

          <div class="form-grid">
            <label>
              Categoria operativa
              <select v-model.number="form.category_id" :disabled="catalogLoading" required>
                <option value="">Seleccionar categoria...</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ categoryName(category) }}
                </option>
              </select>
            </label>

            <label>
              Impacto estimado (prioridad)
              <select v-model.number="form.priority_id" :disabled="catalogLoading" required>
                <option value="">Seleccionar prioridad...</option>
                <option v-for="policy in policies" :key="policy.id" :value="policy.id">
                  {{ priorityOptionLabel(policy) }}
                </option>
              </select>
            </label>
          </div>

          <label>
            Descripcion detallada de la falla
            <textarea
              v-model.trim="form.description"
              placeholder="Por favor, describe exactamente que estabas haciendo, los mensajes de error mostrados y la urgencia asociada para agilizar la labor tecnica del agente..."
              required
            ></textarea>
          </label>

        </div>

        <footer>
          <p><span>i</span> El sistema asignara automaticamente tu solicitud a un agente disponible.</p>
          <div>
            <button type="button" class="secondary-action" @click="closeModal">Cancelar</button>
            <button type="submit" class="submit-action" :disabled="loading || catalogLoading">
              {{ loading ? 'Lanzando...' : 'Lanzar ticket' }}
            </button>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/features/categories/composables/useCategories'
import { useSlaPolicies } from '@/features/sla/composables/useSlaPolicies'
import { useTickets } from '@/features/tickets/composables/useTickets'

const router = useRouter()
const { tickets, loading, error, loadTickets, createNewTicket } = useTickets()
const {
  categories,
  loading: categoriesLoading,
  loadCategories
} = useCategories()
const {
  policies,
  loading: policiesLoading,
  loadPolicies
} = useSlaPolicies()

const showModal = ref(false)
const form = reactive({
  title: '',
  description: '',
  category_id: '',
  priority_id: ''
})

const catalogLoading = computed(() => categoriesLoading.value || policiesLoading.value)
const openStatuses = ['OPEN', 'ASSIGNED']
const processStatuses = ['IN_PROGRESS', 'ON_HOLD']
const resolvedStatuses = ['RESOLVED', 'CLOSED']

const normalize = (value) => String(value || '').toUpperCase()
const ticketStatus = (ticket) => ticket.status || ticket.estado || 'OPEN'
const ticketTitle = (ticket) => ticket.title || ticket.titulo || 'Sin titulo'
const ticketCategory = (ticket) => ticket.category_name || ticket.categoria_nombre || ticket.category || ticket.categoria || 'Sin categoria'
const ticketPriority = (ticket) => ticket.priority_name || ticket.prioridad || ticket.priority || 'Baja'
const ticketAgent = (ticket) => ticket.assigned_agent_name || ticket.agente_asignado || ticket.agent_name || 'Sin asignar'
const ticketDate = (ticket) => ticket.resolution_due_at || ticket.fecha_limite || ticket.created_at || ticket.fecha_creacion
const categoryName = (category) => category.name || category.nombre || `Categoria ${category.id}`

const filteredByStatus = (statuses) => tickets.value.filter((ticket) => statuses.includes(normalize(ticketStatus(ticket)))).length
const openCount = computed(() => filteredByStatus(openStatuses))
const inProgressCount = computed(() => filteredByStatus(processStatuses))
const resolvedCount = computed(() => filteredByStatus(resolvedStatuses))
const escalatedCount = computed(() => tickets.value.filter((ticket) => normalize(ticketStatus(ticket)).includes('ESCAL')).length)

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.category_id = ''
  form.priority_id = ''
}

const openModal = async () => {
  resetForm()
  showModal.value = true
  if (!categories.value.length || !policies.value.length) {
    await Promise.all([loadCategories(), loadPolicies()])
  }
}

const closeModal = () => {
  showModal.value = false
}

const submitTicket = async () => {
  await createNewTicket({
    title: form.title,
    description: form.description,
    category_id: Number(form.category_id),
    priority_id: Number(form.priority_id)
  })

  closeModal()
  await loadTickets()
}

const goToDetail = (id) => router.push(`/tickets/${id}`)

const priorityOptionLabel = (policy) => {
  const name = policy.name || policy.nombre || policy.priority || 'Prioridad'
  const responseDays = policy.response_days ?? policy.dias_respuesta
  const resolutionDays = policy.resolution_days ?? policy.dias_resolucion

  if (!responseDays && !resolutionDays) return name
  return `${name} (respuesta ${responseDays}d / solucion ${resolutionDays}d)`
}

const statusLabel = (status) => {
  const value = normalize(status)
  if (value === 'ASSIGNED') return 'Asignado'
  if (value === 'IN_PROGRESS') return 'En proceso'
  if (value === 'ON_HOLD') return 'En espera'
  if (value === 'ESCALATED') return 'Escalado'
  if (value === 'RESOLVED') return 'Resuelto'
  if (value === 'CLOSED') return 'Cerrado'
  if (value === 'CANCELLED') return 'Cancelado'
  return 'Abierto'
}

const priorityClass = (priority) => {
  const value = String(priority || '').toLowerCase()
  if (value.includes('crit')) return 'pill priority-critical'
  if (value.includes('alta')) return 'pill priority-high'
  if (value.includes('media')) return 'pill priority-medium'
  return 'pill priority-low'
}

const statusClass = (status) => {
  const value = normalize(status)
  if (value.includes('ESCAL')) return 'pill status-escalated'
  if (resolvedStatuses.includes(value)) return 'pill status-resolved'
  if (processStatuses.includes(value)) return 'pill status-process'
  return 'pill status-open'
}

const slaLabel = (ticket) => {
  const value = normalize(ticket.sla_status || ticket.estado_sla)
  if (value === 'EXPIRED') return 'Expirado / Venciente'
  if (value === 'BREACHED') return 'Vencido'
  return 'A tiempo'
}

const slaClass = (ticket) => {
  const value = normalize(ticket.sla_status || ticket.estado_sla)
  return value === 'EXPIRED' || value === 'BREACHED' ? 'pill sla-danger' : 'pill sla-ok'
}

const formatDate = (date) => {
  if (!date) return 'Sin fecha'
  return new Date(date).toLocaleDateString('es-CO')
}

onMounted(async () => {
  await Promise.all([loadTickets(), loadCategories(), loadPolicies()])
})
</script>

<style scoped>
.requester-page {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px;
}

.metric-card {
  align-items: center;
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
  display: flex;
  justify-content: space-between;
  min-height: 112px;
  padding: 24px;
}

.metric-card span,
.panel-heading h2,
.tickets-table th,
.ticket-modal label {
  color: #587098;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.metric-card strong {
  color: #071936;
  display: block;
  font-size: 2.2rem;
  line-height: 1;
  margin-top: 8px;
}

.metric-success {
  border-left: 4px solid #10b981;
}

.metric-warning {
  border-left: 4px solid #f97316;
}

.metric-icon {
  align-items: center;
  border-radius: 12px;
  display: flex;
  font-style: normal;
  font-weight: 900;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.metric-blue { background: #eff6ff; color: #2563eb; }
.metric-soft { background: #f1f5f9; color: #8b5cf6; }
.metric-green { background: #d1fae5; color: #059669; }
.metric-orange { background: #fff7ed; color: #f97316; }

.tickets-panel {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 16px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.panel-heading {
  align-items: center;
  border-bottom: 1px solid #dbe3ef;
  display: flex;
  justify-content: space-between;
  min-height: 76px;
  padding: 0 26px;
}

.panel-heading h2 {
  color: #061734;
  margin: 0;
}

.primary-action,
.submit-action {
  align-items: center;
  background: #2443a3;
  border: 0;
  border-radius: 11px;
  color: #fff;
  display: inline-flex;
  font-weight: 900;
  gap: 8px;
  min-height: 40px;
  padding: 0 20px;
  text-transform: uppercase;
}

.table-wrap {
  overflow-x: auto;
}

.tickets-table {
  border-collapse: collapse;
  width: 100%;
}

.tickets-table th {
  background: #f8fafc;
  padding: 18px 22px;
  text-align: left;
}

.tickets-table td {
  border-top: 1px solid #e2e8f0;
  color: #061734;
  padding: 18px 22px;
  vertical-align: middle;
}

.ticket-id,
.ticket-title {
  font-weight: 900;
}

.date-cell {
  color: #6b83b5 !important;
}

.pill {
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
  padding: 6px 10px;
}

.priority-low { background: #fff7ed; color: #111827; }
.priority-medium { background: #dbeafe; color: #1d4ed8; }
.priority-high { background: #ffedd5; color: #c2410c; }
.priority-critical { background: #fee2e2; color: #991b1b; }
.status-open { background: #e2e8f0; color: #334155; }
.status-process { background: #e0f2fe; color: #0369a1; }
.status-resolved { background: #d1fae5; color: #047857; }
.status-escalated { background: #fff1f2; border: 1px solid #fca5a5; color: #dc2626; }
.sla-ok { background: #d1fae5; color: #047857; }
.sla-danger { background: #ffe4e6; color: #be123c; }

.row-action {
  background: #0f172a;
  border: 0;
  border-radius: 9px;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 900;
  min-height: 32px;
  padding: 0 16px;
}

.empty-row,
.state-box,
.alert-box {
  color: #587098;
  padding: 26px;
  text-align: center;
}

.alert-box {
  color: #b91c1c;
}

.modal-backdrop {
  align-items: center;
  background: rgba(15, 23, 42, 0.58);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 20px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 30;
}

.ticket-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 44px rgba(15, 23, 42, 0.24);
  max-width: 756px;
  overflow: hidden;
  width: 100%;
}

.ticket-modal header {
  align-items: center;
  background: #10182b;
  color: #fff;
  display: flex;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 28px;
}

.ticket-modal h3 {
  align-items: center;
  display: flex;
  font-size: 1rem;
  font-weight: 900;
  gap: 10px;
  margin: 0;
  text-transform: uppercase;
}

.ticket-modal header button {
  background: transparent;
  border: 0;
  color: #a9b9d8;
  font-size: 1.4rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 26px 28px;
}

.info-callout {
  align-items: flex-start;
  background: #eff6ff;
  border: 1px solid #0f172a;
  border-radius: 11px;
  display: flex;
  gap: 12px;
  padding: 18px;
}

.info-callout strong {
  align-items: center;
  border: 2px solid #1d4ed8;
  border-radius: 50%;
  color: #1d4ed8;
  display: flex;
  flex: 0 0 auto;
  height: 22px;
  justify-content: center;
  width: 22px;
}

.info-callout p {
  color: #2443a3;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.6;
  margin: 0;
}

.ticket-modal label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ticket-modal input,
.ticket-modal select,
.ticket-modal textarea {
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  color: #111827;
  font: inherit;
  min-height: 44px;
  padding: 0 12px;
}

.ticket-modal textarea {
  min-height: 96px;
  padding: 12px;
  resize: vertical;
}

.ticket-modal footer {
  align-items: center;
  border-top: 1px solid #0f172a;
  display: flex;
  justify-content: space-between;
  margin: 4px 28px 28px;
  padding-top: 18px;
}

.ticket-modal footer p {
  color: #111827;
  font-size: 0.78rem;
  font-style: italic;
  font-weight: 900;
  line-height: 1.4;
  margin: 0;
  max-width: 380px;
}

.ticket-modal footer div {
  display: flex;
  gap: 10px;
}

.secondary-action {
  background: #f1f5f9;
  border: 0;
  border-radius: 11px;
  color: #334155;
  font-weight: 900;
  min-height: 56px;
  padding: 0 20px;
  text-transform: uppercase;
}

.submit-action {
  background: #10182b;
  min-height: 56px;
}

.submit-action:disabled {
  opacity: 0.65;
}

@media (max-width: 1080px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .metrics-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .panel-heading,
  .ticket-modal footer {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 18px;
    padding-top: 18px;
  }

  .ticket-modal footer {
    margin: 4px 20px 20px;
  }
}
</style>
