<template>
  <div class="create-ticket-page">
    <form class="ticket-form" @submit.prevent="submitTicket">
      <header>
        <h2>Generar nueva solicitud</h2>
        <p>Los catalogos de categoria y prioridad se cargan desde las APIs configuradas.</p>
      </header>

      <label>
        Asunto / titulo
        <input
          v-model.trim="form.title"
          type="text"
          placeholder="Ej. Falla en acceso a base de datos"
          required
        />
      </label>

      <div class="form-grid">
        <label>
          Categoria
          <select v-model.number="form.category_id" :disabled="catalogLoading" required>
            <option value="">Seleccionar categoria...</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name || category.nombre || `Categoria ${category.id}` }}
            </option>
          </select>
        </label>

        <label>
          Prioridad SLA
          <select v-model.number="form.priority_id" :disabled="catalogLoading" required>
            <option value="">Seleccionar prioridad...</option>
            <option v-for="policy in policies" :key="policy.id" :value="policy.id">
              {{ priorityOptionLabel(policy) }}
            </option>
          </select>
        </label>
      </div>

      <label>
        Descripcion detallada
        <textarea
          v-model.trim="form.description"
          rows="4"
          placeholder="Describe que sucede, pasos para replicar o errores que ves..."
          required
        ></textarea>
      </label>

      <div v-if="error" class="alert-box">{{ error }}</div>

      <footer>
        <button type="button" class="secondary-action" @click="router.push('/tickets')">Cancelar</button>
        <button type="submit" class="primary-action" :disabled="loading || catalogLoading">
          {{ loading ? 'Creando...' : 'Crear solicitud' }}
        </button>
      </footer>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/features/categories/composables/useCategories'
import { useSlaPolicies } from '@/features/sla/composables/useSlaPolicies'
import { useTickets } from '@/features/tickets/composables/useTickets'

const router = useRouter()
const { loading, error, createNewTicket } = useTickets()
const { categories, loading: categoriesLoading, loadCategories } = useCategories()
const { policies, loading: policiesLoading, loadPolicies } = useSlaPolicies()

const form = reactive({
  title: '',
  description: '',
  category_id: '',
  priority_id: ''
})

const catalogLoading = computed(() => categoriesLoading.value || policiesLoading.value)

const priorityOptionLabel = (policy) => {
  const name = policy.name || policy.nombre || policy.priority || 'Prioridad'
  const responseDays = policy.response_days ?? policy.dias_respuesta
  const resolutionDays = policy.resolution_days ?? policy.dias_resolucion

  if (!responseDays && !resolutionDays) return name
  return `${name} (respuesta ${responseDays}d / solucion ${resolutionDays}d)`
}

const submitTicket = async () => {
  await createNewTicket({
    title: form.title,
    description: form.description,
    category_id: Number(form.category_id),
    priority_id: Number(form.priority_id)
  })

  router.push('/tickets')
}

onMounted(() => {
  loadCategories()
  loadPolicies()
})
</script>

<style scoped>
.create-ticket-page {
  display: flex;
  justify-content: center;
}

.ticket-form {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 760px;
  padding: 28px;
  width: 100%;
}

.ticket-form h2 {
  color: #061734;
  font-size: 1.25rem;
  font-weight: 900;
  margin: 0;
}

.ticket-form p {
  color: #587098;
  margin: 6px 0 0;
}

.ticket-form label {
  color: #587098;
  display: flex;
  flex-direction: column;
  font-size: 0.78rem;
  font-weight: 900;
  gap: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.form-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ticket-form input,
.ticket-form select,
.ticket-form textarea {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  color: #111827;
  font: inherit;
  min-height: 44px;
  padding: 0 12px;
}

.ticket-form textarea {
  padding: 12px;
  resize: vertical;
}

.alert-box {
  color: #b91c1c;
  font-weight: 800;
}

.ticket-form footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.primary-action,
.secondary-action {
  border: 0;
  border-radius: 10px;
  font-weight: 900;
  min-height: 42px;
  padding: 0 18px;
  text-transform: uppercase;
}

.primary-action {
  background: #2443a3;
  color: #fff;
}

.secondary-action {
  background: #f1f5f9;
  color: #334155;
}

@media (max-width: 680px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
