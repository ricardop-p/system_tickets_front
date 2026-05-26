<template>
  <div class="catalog-page">
    <div class="page-heading">
      <div>
        <h2>Catalogo de Categorias de Soporte</h2>
        <p>Establece taxonomias de fallas de infraestructura, accesos locales y servicios corporativos</p>
      </div>

      <button type="button" class="primary-action" @click="openCreateModal">
        <span>+</span>
        Crear categoria
      </button>
    </div>

    <div v-if="loading" class="state-box">Cargando categorias...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <section v-else class="table-card">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Categoria</th>
            <th>Proposito tecnico / descripcion</th>
            <th>Estado operativo</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="categoryId(category)">
            <td class="mono">{{ categoryId(category) }}</td>
            <td class="strong-text">{{ categoryName(category) }}</td>
            <td>{{ categoryDescription(category) }}</td>
            <td>
              <span :class="statusClass(categoryStatus(category))">{{ statusLabel(categoryStatus(category)) }}</span>
            </td>
            <td class="text-end">
              <button type="button" class="danger-outline" @click="toggleStatus(category)">
                {{ categoryStatus(category) ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="5" class="empty-row">No hay categorias registradas.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="showModal" class="modal-backdrop">
      <form class="category-modal" @submit.prevent="submitCategory">
        <header>
          <h3>Configurar nueva categoria de incidente</h3>
          <button type="button" @click="closeModal">x</button>
        </header>

        <div class="modal-body">
          <label>
            Nombre de categoria
            <input v-model="form.nombre" type="text" placeholder="Ej. Software de Diseno, Logistica" required />
          </label>

          <label>
            Proposito operativo / descripcion
            <textarea
              v-model="form.descripcion"
              rows="3"
              placeholder="Escribe brevemente el alcance de soporte para esta division..."
              required
            ></textarea>
          </label>
        </div>

        <footer>
          <button type="button" class="secondary-action" @click="closeModal">Cancelar</button>
          <button type="submit" class="confirm-action" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Confirmar categoria' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useCategories } from '@/features/categories/composables/useCategories'

const { categories, loading, saving, error, loadCategories, saveCategory, changeStatus } = useCategories()
const showModal = ref(false)

const form = reactive({
  nombre: '',
  descripcion: ''
})

const resetForm = () => {
  form.nombre = ''
  form.descripcion = ''
}

const openCreateModal = () => {
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitCategory = async () => {
  await saveCategory({ ...form, estado: 'activo' })
  closeModal()
}

const categoryId = (category) => category.id || category.uid || category.codigo || 'N/A'
const categoryName = (category) => category.nombre || category.name || 'Sin categoria'
const categoryDescription = (category) => category.descripcion || category.description || 'Sin descripcion'
const categoryStatus = (category) => {
  if (typeof category.active === 'boolean') return category.active
  if (typeof category.is_active === 'boolean') return category.is_active
  if (typeof category.activo === 'boolean') return category.activo

  const status = String(category.estado || category.status || '').toLowerCase()
  return status ? status === 'activo' || status === 'active' : true
}

const statusLabel = (isActive) => isActive ? 'Activo' : 'Desactivado'
const statusClass = (isActive) => isActive ? 'status-pill status-on' : 'status-pill status-off'

const toggleStatus = async (category) => {
  const nextStatus = !categoryStatus(category)
  await changeStatus(categoryId(category), nextStatus)
}

onMounted(loadCategories)
</script>

<style scoped>
.catalog-page {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
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

.primary-action,
.confirm-action {
  border: 0;
  border-radius: 11px;
  background: #2443a3;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  min-height: 42px;
  padding: 0 20px;
  text-transform: uppercase;
}

.table-card {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.catalog-table {
  width: 100%;
  border-collapse: collapse;
}

.catalog-table th {
  background: #f8fafc;
  color: #587098;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  padding: 18px 28px;
  text-transform: uppercase;
}

.catalog-table td {
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

.status-pill {
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 900;
}

.status-on { background: #dcfce7; border: 1px solid #bbf7d0; color: #047857; }
.status-off { background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; }

.danger-outline {
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #fff;
  color: #b91c1c;
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

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.category-modal {
  width: min(504px, 100%);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.28);
}

.category-modal header {
  background: #10182b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
}

.category-modal h3 {
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.category-modal header button {
  border: 0;
  background: transparent;
  color: #9eb4df;
  font-size: 1.3rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
}

.modal-body label {
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.modal-body input,
.modal-body textarea {
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  color: #061734;
  font-size: 0.92rem;
  padding: 12px;
  text-transform: none;
}

.modal-body input {
  height: 44px;
}

.category-modal footer {
  border-top: 1px solid #0f172a;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 0 28px;
  padding: 18px 0 28px;
}

.secondary-action {
  border: 0;
  border-radius: 11px;
  background: #eef2f7;
  color: #334155;
  font-weight: 900;
  min-height: 36px;
  padding: 0 18px;
  text-transform: uppercase;
}

.confirm-action {
  background: #10182b;
  min-height: 36px;
}
</style>
