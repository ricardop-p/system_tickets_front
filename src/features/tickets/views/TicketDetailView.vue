<template>
  <div v-if="ticket" class="ticket-detail-page">
    <section class="detail-toolbar">
      <button type="button" class="back-button" @click="goBack">Volver a la lista</button>
      <span>Ticket #TKT-{{ ticket.id }}</span>
    </section>

    <section v-if="isSlaExpired(ticket)" class="sla-alert">
      <strong>Contrato SLA incumplido/vencido</strong>
      <p>Este ticket ha excedido los limites establecidos de atencion o resolucion segun las prioridades vigentes.</p>
    </section>

    <div class="detail-grid">
      <main class="detail-main">
        <section class="ticket-summary">
          <header>
            <div>
              <span class="category-chip">{{ ticketCategory(ticket) }}</span>
              <small>Creado {{ formatDateTime(ticket.created_at || ticket.fecha_creacion) }}</small>
            </div>
            <div class="status-line">
              <span>Estado:</span>
              <b :class="statusClass(ticketStatus(ticket))">{{ statusLabel(ticketStatus(ticket)) }}</b>
            </div>
          </header>

          <h2>{{ ticketTitle(ticket) }}</h2>
          <div class="description-box">
            <strong>Reporte de falla de usuario:</strong>
            <p>{{ ticketDescription(ticket) }}</p>
          </div>
        </section>

        <section class="comments-panel">
          <header>
            <h3>Eventos del sistema y comentarios</h3>
          </header>

          <div class="comment-list">
            <article v-for="comment in visibleComments" :key="comment.id" :class="commentClass(comment)">
              <div class="comment-meta">
                <div>
                  <strong>{{ commentAuthor(comment) }}</strong>
                  <span>{{ commentRole(comment) }}</span>
                </div>
                <time>{{ formatDateTime(comment.created_at || comment.createdAt) }}</time>
              </div>
              <p>{{ commentText(comment) }}</p>
              <small v-if="isTechnicalComment(comment)">Comentario tecnico interno</small>
            </article>

            <p v-if="visibleComments.length === 0" class="empty-comments">Aun no hay comentarios en la bitacora.</p>
          </div>

          <form class="comment-form" @submit.prevent="publishComment">
            <label>Añadir respuesta a la bitacora</label>
            <textarea
              v-model.trim="newComment"
              placeholder="Escribe tu observacion o progreso de resolucion..."
              required
            ></textarea>

            <label v-if="canManageTicket" class="internal-check">
              <input v-model="internalComment" type="checkbox" />
              Marcar como comentario tecnico (ocultar al solicitante)
            </label>

            <button type="submit" :disabled="loading || !newComment">
              {{ loading ? 'Publicando...' : 'Publicar mensaje' }}
            </button>
          </form>
        </section>
      </main>

      <aside class="detail-side">
        <section class="side-card">
          <h3>Acuerdos y tiempos</h3>
          <dl>
            <dt>Usuario solicitante</dt>
            <dd>{{ requesterName(ticket) }}</dd>

            <dt>Operador asignado</dt>
            <dd>{{ ticketAgent(ticket) }}</dd>

            <dt>Matriz de prioridad</dt>
            <dd><span :class="priorityClass(ticketPriority(ticket))">Prioridad: {{ ticketPriority(ticket) }}</span></dd>
          </dl>

          <div class="timeline-row">
            <strong>Plazo de atencion inicial</strong>
            <span>{{ formatDateTime(ticket.first_response_due_at || ticket.fecha_respuesta) }}</span>
          </div>

          <div class="timeline-row">
            <strong>Plazo de resolucion final</strong>
            <span>{{ formatDateTime(ticket.resolution_due_at || ticket.fecha_limite) }}</span>
          </div>
        </section>

        <section class="side-card">
          <h3>Panel de control de estado</h3>

          <template v-if="canManageTicket">
            <p class="control-note">Gestion permitida como operador de soporte. Actualiza el estado para detener o alertar el SLA asignado.</p>
            <div class="status-actions">
              <button type="button" class="state-button state-blue" @click="changeStatus('IN_PROGRESS')">
                Marcar en proceso
              </button>
              <button type="button" class="state-button state-yellow" @click="changeStatus('ON_HOLD')">
                Poner en espera
              </button>
              <button type="button" class="state-button state-green" @click="changeStatus('RESOLVED')">
                Marcar como resuelto
              </button>
              <button v-if="auth.isAdmin" type="button" class="state-button state-red" @click="changeStatus('ESCALATED')">
                Escalar ticket
              </button>
            </div>
          </template>

          <template v-else>
            <div class="requester-policy">
              <strong>Politicas del solicitante</strong>
              <p>Como usuario solicitante no tienes privilegios para cambiar el estado o cerrar de forma autonoma este ticket.</p>
              <p>Si deseas cancelar el reporte o consideras la falla solucionada, agrega un comentario para que el agente realice el cierre.</p>
            </div>
          </template>
        </section>
      </aside>
    </div>
  </div>

  <div v-else class="loading-state">
    <p>{{ error || 'Cargando detalle del ticket...' }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useTickets } from '@/features/tickets/composables/useTickets'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const {
  ticket,
  comments,
  loading,
  error,
  loadTicket,
  createComment,
  changeTicketState
} = useTickets()

const newComment = ref('')
const internalComment = ref(false)
const canManageTicket = computed(() => auth.isAdmin || auth.isAgent)
const internalSuffix = '[Comentario tecnico interno]'

const normalize = (value) => String(value || '').trim().toLowerCase()
const ticketStatus = (item) => item.status || item.estado || 'OPEN'
const ticketTitle = (item) => item.title || item.titulo || 'Sin titulo'
const ticketDescription = (item) => item.description || item.descripcion || 'Sin descripcion'
const ticketCategory = (item) => item.category_name || item.categoria_nombre || item.category || item.categoria || 'Sin categoria'
const ticketPriority = (item) => item.priority_name || item.prioridad || item.priority || 'Baja'
const ticketAgent = (item) => item.assigned_agent_name || item.agente_asignado || item.agent_name || 'Sin asignar'
const requesterName = (item) => item.requester_name || item.solicitante_nombre || item.usuario_nombre || item.user_name || 'Sin solicitante'

const goBack = () => {
  router.push(canManageTicket.value ? '/dashboard' : '/tickets')
}

const statusLabel = (status) => {
  const value = String(status || '').toUpperCase()
  if (value === 'ASSIGNED') return 'Asignado'
  if (value === 'IN_PROGRESS') return 'En proceso'
  if (value === 'ON_HOLD') return 'En espera'
  if (value === 'ESCALATED') return 'Escalado'
  if (value === 'RESOLVED') return 'Resuelto'
  if (value === 'CLOSED') return 'Cerrado'
  if (value === 'CANCELLED') return 'Cancelado'
  return 'Abierto'
}

const isSlaExpired = (item) => {
  const sla = normalize(item.sla_status || item.estado_sla || item.sla)
  return sla.includes('expired') || sla.includes('breached') || sla.includes('venc') || sla.includes('expir')
}

const priorityClass = (priority) => {
  const value = normalize(priority)
  if (value.includes('crit')) return 'pill priority-critical'
  if (value.includes('alta')) return 'pill priority-high'
  if (value.includes('media')) return 'pill priority-medium'
  return 'pill priority-low'
}

const statusClass = (status) => {
  const value = String(status || '').toUpperCase()
  if (value.includes('ESCAL')) return 'pill status-escalated'
  if (value === 'RESOLVED' || value === 'CLOSED') return 'pill status-resolved'
  if (value === 'IN_PROGRESS' || value === 'ON_HOLD') return 'pill status-process'
  return 'pill status-open'
}

const commentAuthor = (comment) => comment.user_name || comment.author_name || 'Sistema SLA'
const commentRole = (comment) => comment.user_role || comment.role || comment.comment_type || 'EVENTO'
const rawCommentText = (comment) => comment.comment || comment.comentario || ''
const isTechnicalComment = (comment) => normalize(comment.comment_type).includes('internal') || rawCommentText(comment).includes(internalSuffix)
const visibleComments = computed(() => (
  canManageTicket.value ? comments.value : comments.value.filter((comment) => !isTechnicalComment(comment))
))
const commentText = (comment) => rawCommentText(comment).replace(` ${internalSuffix}`, '').replace(internalSuffix, '')
const commentClass = (comment) => ({
  'comment-item': true,
  'comment-technical': isTechnicalComment(comment)
})

const formatDateTime = (date) => {
  if (!date) return 'Sin fecha'
  return new Date(date).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const publishComment = async () => {
  const suffix = canManageTicket.value && internalComment.value ? ` ${internalSuffix}` : ''
  await createComment(route.params.id, `${newComment.value}${suffix}`)
  newComment.value = ''
  internalComment.value = false
}

const changeStatus = async (status) => {
  await changeTicketState(route.params.id, status)
}

onMounted(() => loadTicket(route.params.id))
</script>

<style scoped>
.ticket-detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-toolbar,
.ticket-summary,
.comments-panel,
.side-card {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.detail-toolbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 76px;
  padding: 0 24px;
}

.detail-toolbar span {
  color: #8a9bbd;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.back-button,
.comment-form button {
  background: #0f172a;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font-weight: 900;
  min-height: 36px;
  padding: 0 16px;
  text-transform: uppercase;
}

.back-button {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #1e3a5f;
}

.sla-alert {
  background: #fff1f2;
  border: 2px solid #ef4444;
  border-radius: 8px;
  color: #dc2626;
  padding: 18px 24px;
}

.sla-alert strong {
  display: block;
  font-size: 0.82rem;
  font-weight: 900;
  text-transform: uppercase;
}

.sla-alert p {
  margin: 6px 0 0;
}

.detail-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 0.95fr);
}

.detail-main,
.detail-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ticket-summary header {
  align-items: center;
  border-bottom: 2px solid #0f172a;
  display: flex;
  justify-content: space-between;
  padding: 22px 24px;
}

.category-chip {
  background: #eef4fb;
  border-radius: 4px;
  color: #587098;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 900;
  padding: 3px 8px;
}

.ticket-summary small {
  color: #6b83b5;
  display: block;
  margin-top: 6px;
}

.status-line {
  align-items: center;
  display: flex;
  gap: 8px;
}

.status-line span,
.side-card dt,
.comment-form label,
.comments-panel h3,
.side-card h3 {
  color: #587098;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ticket-summary h2 {
  color: #020617;
  font-size: 1.22rem;
  font-weight: 900;
  margin: 28px 24px 18px;
}

.description-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin: 0 24px 24px;
  padding: 18px;
}

.description-box strong {
  color: #587098;
  display: block;
  font-size: 0.76rem;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.description-box p {
  margin: 0;
}

.comments-panel {
  padding: 24px;
}

.comments-panel header {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 18px;
  padding-bottom: 14px;
}

.comments-panel h3,
.side-card h3 {
  color: #061734;
  margin: 0;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.comment-technical {
  background: #fffbeb;
  border-color: #facc15;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.comment-meta strong {
  font-weight: 900;
}

.comment-meta span {
  background: #eef4fb;
  border-radius: 4px;
  color: #1d4ed8;
  font-size: 0.68rem;
  font-weight: 900;
  margin-left: 8px;
  padding: 2px 5px;
  text-transform: uppercase;
}

.comment-meta time {
  color: #8a9bbd;
  font-size: 0.72rem;
}

.comment-item p {
  margin: 12px 0 0;
}

.comment-item small {
  color: #b45309;
  display: block;
  font-weight: 900;
  margin-top: 12px;
  text-transform: uppercase;
}

.empty-comments {
  color: #587098;
  margin: 0;
  padding: 18px 0;
}

.comment-form {
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-top: 18px;
}

.comment-form textarea {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  min-height: 84px;
  padding: 12px;
  resize: vertical;
}

.internal-check {
  align-items: center;
  color: #92400e !important;
  display: flex !important;
  flex-direction: row !important;
  gap: 8px;
  letter-spacing: 0 !important;
  text-transform: none !important;
}

.comment-form button {
  align-self: flex-end;
}

.side-card {
  padding: 24px;
}

.side-card dl {
  border-bottom: 1px solid #e2e8f0;
  margin: 18px 0;
  padding-bottom: 18px;
}

.side-card dd {
  font-weight: 900;
  margin: 4px 0 14px;
}

.timeline-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 14px;
}

.timeline-row strong {
  font-size: 0.76rem;
  text-transform: uppercase;
}

.timeline-row span {
  color: #334155;
}

.control-note,
.requester-policy {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e3a8a;
  font-size: 0.82rem;
  line-height: 1.5;
  padding: 14px;
}

.requester-policy {
  text-align: center;
}

.status-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.state-button {
  border-radius: 8px;
  font-weight: 900;
  min-height: 38px;
  text-align: left;
  padding: 0 14px;
}

.state-blue { background: #eff6ff; border: 1px solid #93c5fd; color: #1d4ed8; }
.state-yellow { background: #fffbeb; border: 1px solid #facc15; color: #92400e; }
.state-green { background: #ecfdf5; border: 1px solid #10b981; color: #047857; }
.state-red { background: #fff1f2; border: 1px solid #fb7185; color: #be123c; }

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

.loading-state {
  color: #587098;
  padding: 60px;
  text-align: center;
}

@media (max-width: 1100px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
