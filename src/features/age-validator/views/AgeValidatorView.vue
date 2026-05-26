<template>
  <div class="age-validator-page">
    <div class="page-heading">
      <div>
        <h2>Validador de edad</h2>
        <p>Consulta la clasificacion de seniority registrada por el servicio central</p>
      </div>
    </div>

    <section class="validator-shell">
      <form class="validator-form" @submit.prevent="submitValidation">
        <label>
          Nombre
          <input v-model="form.nombre" type="text" placeholder="Nombre de la persona" autocomplete="off" />
        </label>

        <label>
          Edad
          <input v-model="form.edad" type="text" inputmode="numeric" placeholder="Edad en anos" autocomplete="off" />
        </label>

        <div class="form-actions">
          <button type="button" class="secondary-action" @click="resetForm">Limpiar</button>
          <button type="submit" class="primary-action" :disabled="loading">
            {{ loading ? 'Validando...' : 'Validar edad' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <article v-if="result" class="result-panel">
        <span class="result-eyebrow">Resultado</span>
        <h3>{{ result.name }}</h3>
        <p class="result-summary">
          {{ result.years }} anos
          <template v-if="resultLabel">- {{ resultLabel }}</template>
        </p>

        <dl v-if="resultFields.length" class="result-fields">
          <div v-for="field in resultFields" :key="field.key">
            <dt>{{ field.key }}</dt>
            <dd>{{ field.value }}</dd>
          </div>
        </dl>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useAgeValidator } from '@/features/age-validator/composables/useAgeValidator'

const { loading, error, result, validateAge, clearResult } = useAgeValidator()

const form = reactive({
  nombre: '',
  edad: ''
})

const responseData = computed(() => result.value?.response)

const resultLabel = computed(() => {
  const data = responseData.value

  if (!data) return ''
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') return String(data)
  if (Array.isArray(data)) return ''

  return data.seniority || data.message || data.result || data.data || data.status || data.category || ''
})

const resultFields = computed(() => {
  const data = responseData.value

  if (!data || typeof data !== 'object' || Array.isArray(data)) return []

  return Object.entries(data).map(([key, value]) => ({
    key,
    value: value === null || value === undefined
      ? 'N/A'
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)
  }))
})

const submitValidation = async () => {
  await validateAge({ name: form.nombre, years: form.edad })
}

const resetForm = () => {
  form.nombre = ''
  form.edad = ''
  clearResult()
}
</script>

<style scoped>
.age-validator-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.validator-shell {
  display: grid;
  grid-template-columns: minmax(280px, 420px) minmax(280px, 1fr);
  gap: 18px;
  align-items: start;
}

.validator-form,
.result-panel {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.validator-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
}

.validator-form label {
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.validator-form input {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  color: #061734;
  font-size: 0.95rem;
  height: 44px;
  padding: 0 12px;
  text-transform: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.primary-action,
.secondary-action {
  border: 0;
  border-radius: 10px;
  font-weight: 900;
  min-height: 38px;
  padding: 0 18px;
  text-transform: uppercase;
}

.primary-action {
  background: #2443a3;
  color: #fff;
}

.primary-action:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.secondary-action {
  background: #eef2f7;
  color: #334155;
}

.result-panel {
  padding: 24px;
}

.result-eyebrow {
  color: #2563eb;
  display: block;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.result-panel h3 {
  color: #061734;
  font-size: 1.25rem;
  font-weight: 900;
  margin: 8px 0 4px;
}

.result-summary {
  color: #475569;
  font-size: 0.98rem;
  font-weight: 800;
  margin: 0;
}

.result-fields {
  border-top: 1px solid #dce5f2;
  display: grid;
  gap: 10px;
  margin: 20px 0 0;
  padding-top: 18px;
}

.result-fields div {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
}

.result-fields dt {
  color: #8a9bbd;
  font-size: 0.74rem;
  font-weight: 900;
  text-transform: uppercase;
}

.result-fields dd {
  color: #061734;
  font-weight: 800;
  margin: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 840px) {
  .validator-shell {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }
}
</style>
