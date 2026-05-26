<template>
  <div class="sla-page">
    <div class="page-heading">
      <div>
        <h2>Politicas SLA (Acuerdos de Nivel de Servicio)</h2>
        <p>Define los parametros de tiempo reglamentarios para el tiempo limite de primera atencion y resolucion final, garantizando auditorias transparentes</p>
      </div>
    </div>

    <div v-if="loading" class="state-box">Cargando politicas SLA...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <section v-else class="table-card">
      <div class="table-banner">Configuracion de tiempos limites activa</div>

      <table class="sla-table">
        <thead>
          <tr>
            <th>Nivel de impacto</th>
            <th>Tipo prioridad</th>
            <th>Limite primera atencion (SLA)</th>
            <th>Limite de resolucion total (SLA)</th>
            <!-- <th class="text-end">Acciones</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="policy in normalizedPolicies" :key="policy.id">
            <td class="mono">{{ policy.level }}</td>
            <td>
              <span :class="priorityClass(policy.priority)">{{ policy.priority }}</span>
            </td>
            <td class="strong-text">{{ policy.firstResponse }}</td>
            <td class="strong-text">{{ policy.resolution }}</td>
            <td class="text-end">
              <!-- <button type="button" class="outline-action">Modificar SLA</button> -->
            </td>
          </tr>
          <tr v-if="normalizedPolicies.length === 0">
            <td colspan="5" class="empty-row">No hay politicas SLA configuradas.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSlaPolicies } from '@/features/sla/composables/useSlaPolicies'

const { policies, loading, error, loadPolicies } = useSlaPolicies()

const firstDefined = (...values) => values.find((value) => value !== null && value !== undefined && value !== '')

const formatLevel = (policy, index) => {
  const level = firstDefined(policy.nivel, policy.level, index + 1)
  const value = String(level)

  return value.toLowerCase().includes('nivel') ? value : `Nivel ${value}`
}

const formatDays = (days, suffix) => {
  if (days === null || days === undefined || days === '') return 'N/A'

  const value = Number(days)

  if (!Number.isFinite(value)) return String(days)

  return `${value} ${value === 1 ? 'Dia' : 'Dias'} ${suffix}`
}

const normalizedPolicies = computed(() => policies.value.map((policy, index) => ({
  id: policy.id || policy.uid || index + 1,
  level: formatLevel(policy, index),
  priority: firstDefined(policy.name, policy.nombre, policy.prioridad, policy.priority, 'Media'),
  firstResponse: formatDays(
    firstDefined(policy.response_days, policy.limite_primera_atencion, policy.first_response_limit, policy.primera_atencion),
    'de atencion'
  ),
  resolution: formatDays(
    firstDefined(policy.resolution_days, policy.limite_resolucion, policy.resolution_limit, policy.resolucion),
    'para solucion'
  )
})))

const priorityClass = (priority) => {
  const value = String(priority || '').toLowerCase()
  if (value.includes('crit')) return 'priority-pill priority-critical'
  if (value.includes('alta')) return 'priority-pill priority-high'
  if (value.includes('media')) return 'priority-pill priority-medium'
  return 'priority-pill priority-low'
}

onMounted(loadPolicies)
</script>

<style scoped>
.sla-page {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.page-heading h2 {
  color: #061734;
  font-size: 1.35rem;
  font-weight: 900;
  margin: 0;
}

.page-heading p {
  color: #587098;
  margin: 4px 0 0;
}

.table-card {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.table-banner {
  border-bottom: 1px solid #dce5f2;
  color: #061734;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  padding: 18px 28px;
  text-transform: uppercase;
}

.sla-table {
  width: 100%;
  border-collapse: collapse;
}

.sla-table th {
  background: #f8fafc;
  color: #587098;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  padding: 18px 28px;
  text-transform: uppercase;
}

.sla-table td {
  border-top: 1px solid #dce5f2;
  color: #475569;
  padding: 18px 28px;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-weight: 900;
}

.strong-text {
  color: #061734 !important;
  font-weight: 900;
}

.priority-pill {
  border-radius: 6px;
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 900;
}

.priority-low { background: #f8fafc; border: 1px solid #dbe3ef; color: #1d4ed8; }
.priority-medium { background: #dbeafe; border: 1px solid #bfdbfe; color: #2563eb; }
.priority-high { background: #ffedd5; border: 1px solid #fed7aa; color: #c2410c; }
.priority-critical { background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; }

.outline-action {
  border: 1px solid #bfdbfe;
  border-radius: 9px;
  background: #f8fbff;
  color: #1d4ed8;
  font-weight: 900;
  min-height: 34px;
  padding: 0 14px;
}

.empty-row,
.state-box {
  color: #64748b;
  padding: 28px;
  text-align: center;
}
</style>
