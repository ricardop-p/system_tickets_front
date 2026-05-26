<template>
  <div class="users-page">
    <div class="page-heading">
      <div>
        <h2>Directorio Administrativo de Usuarios</h2>
        <p>Administra accesos del personal de TI, agentes de soporte tecnico y solicitantes corporativos</p>
      </div>

      <button type="button" class="primary-action" @click="openCreateModal">
        <span>+</span>
        Crear usuario
      </button>
    </div>

    <div v-if="loading && users.length === 0" class="state-box">Cargando usuarios...</div>
    <div v-if="error" class="alert-box">{{ error }}</div>

    <section v-if="!loading || users.length > 0" class="users-table-card">
      <table class="users-table">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Correo electronico</th>
            <th>Nivel de seguridad (rol)</th>
            <th>Estado local</th>
            <!-- <th class="text-end">Acciones</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="userId(user)">
            <td>
              <div class="collaborator">
                <div class="avatar">{{ userInitial(user) }}</div>
                <div>
                  <strong>{{ userName(user) }}</strong>
                  <small>UID: {{ userId(user) }}</small>
                </div>
              </div>
            </td>
            <td class="mono">{{ userEmail(user) }}</td>
            <td>
              <span :class="roleClass(userRole(user))">{{ roleLabel(userRole(user)) }}</span>
            </td>
            <td>
              <span :class="statusClass(userStatus(user))">{{ statusLabel(userStatus(user)) }}</span>
            </td>
         
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="5" class="empty-row">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="showModal" class="modal-backdrop">
      <form class="user-modal" @submit.prevent="submitUser">
        <header>
          <h3>Registrar nuevo usuario interno</h3>
          <button type="button" @click="closeModal">x</button>
        </header>

        <div class="modal-body">
          <label>
            Nombre completo
            <input v-model="form.nombre" type="text" placeholder="Por ejemplo: Carlos Mendoza" required />
          </label>

          <label>
            Ingresa la edads
            <input v-model="form.age" type="text" placeholder="Por ejemplo: 18" required />
          </label>

          <label>
            Correo corporativo
            <input v-model="form.email" type="email" placeholder="ejemplo@sla.com" required />
          </label>

          <label>
            Contrasena inicial
            <input v-model="form.password" type="password" placeholder="********" required />
            <small>El usuario debera actualizar sus credenciales tras el primer ingreso.</small>
          </label>

          <div class="form-grid">
            <label>
              Rol de sistema
              <select v-model="form.rol">
                <option value="USER">Solicitante (User)</option>
                <option value="AGENT">Soporte Tecnico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>

            <label>
              Estado inicial
              <select v-model="form.estado">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
          </div>
        </div>

        <footer>
          <button type="button" class="secondary-action" @click="closeModal">Cancelar</button>
          <button type="submit" class="confirm-action" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Confirmar guardado' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useUsers } from '@/features/users/composables/useUsers'

const { users, loading, saving, error, loadUsers, saveUser } = useUsers()
const showModal = ref(false)
const allowedRoles = ['ADMIN', 'AGENT', 'USER']

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  age: '',
  rol: 'USER',
  estado: 'activo'
})

const resetForm = () => {
  form.nombre = ''
  form.age = ''
  form.email = ''
  form.password = ''
  form.rol = 'USER'
  form.estado = 'activo'
}

const openCreateModal = () => {
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const createUserPayload = () => {
  const role = allowedRoles.includes(form.rol) ? form.rol : 'USER'

  return {
    name: form.nombre,
    email: form.email,
    age: form.age,
    password: form.password,
    role,
    is_active: form.estado === 'activo'
  }
}

const submitUser = async () => {
  try {
    await saveUser(createUserPayload())
    closeModal()
  } catch (err) {
    alert(error.value || err.response?.data?.message || err.response?.data?.error || 'No se pudo guardar el usuario')
  }
}

const userId = (user) => user.id || user.uid || user.user_id || 'N/A'
const userName = (user) => user.nombre || user.name || user.username || 'Sin nombre'
const userEmail = (user) => user.email || user.correo || 'Sin email'
const userRole = (user) => String(user.rol || user.role || user.tipo || user.tipo_usuario || 'usuario').toLowerCase()
const userStatus = (user) => String(user.estado || user.status || (user.is_active === false || user.activo === false ? 'inactivo' : 'activo')).toLowerCase()
const userInitial = (user) => userName(user).charAt(0).toUpperCase()

const roleLabel = (role) => {
  if (role === 'admin' || role === 'administrador') return 'Administrador'
  if (role === 'agent' || role === 'agente' || role === 'tecnico' || role === 'técnico') return 'Soporte Tecnico'
  return 'Solicitante'
}

const roleClass = (role) => {
  if (role === 'admin' || role === 'administrador') return 'role-pill role-admin'
  if (role === 'agent' || role === 'agente' || role === 'tecnico' || role === 'técnico') return 'role-pill role-agent'
  return 'role-pill role-user'
}

const statusLabel = (status) => status === 'inactivo' || status === 'desactivado' ? 'Desactivado' : 'Activado'
const statusClass = (status) => status === 'inactivo' || status === 'desactivado' ? 'status-pill status-off' : 'status-pill status-on'

onMounted(loadUsers)
</script>

<style scoped>
.users-page {
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

.users-table-card {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8fafc;
  color: #587098;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  padding: 18px 28px;
  text-transform: uppercase;
}

.users-table td {
  border-top: 1px solid #dce5f2;
  color: #061734;
  padding: 20px 28px;
}

.collaborator {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #0b1224;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.collaborator strong,
.collaborator small {
  display: block;
}

.collaborator small {
  background: #eef2f7;
  border-radius: 5px;
  color: #8a9bbd;
  font-size: 0.72rem;
  font-weight: 900;
  margin-top: 6px;
  padding: 2px 7px;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}

.role-pill,
.status-pill {
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 900;
}

.role-admin { background: #f3e8ff; border: 1px solid #e9d5ff; color: #7e22ce; }
.role-agent { background: #fff; border: 1px solid #c7d2fe; color: #061734; }
.role-user { background: #eef2f7; border: 1px solid #dbe3ef; color: #061734; }
.status-on { background: #dcfce7; border: 1px solid #bbf7d0; color: #047857; }
.status-off { background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; }

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.actions button {
  border: 0;
  background: transparent;
  color: #007f5f;
  font-size: 1.1rem;
  font-weight: 900;
}

.empty-row,
.state-box {
  color: #64748b;
  padding: 28px;
  text-align: center;
}

.alert-box {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #b91c1c;
  font-weight: 800;
  padding: 14px 18px;
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

.user-modal {
  width: min(504px, 100%);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.28);
}

.user-modal header {
  background: #10182b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
}

.user-modal h3 {
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
}

.user-modal header button {
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
.modal-body select {
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  color: #061734;
  font-size: 0.92rem;
  height: 44px;
  padding: 0 12px;
  text-transform: none;
}

.modal-body small {
  color: #8a9bbd;
  font-size: 0.68rem;
  text-transform: none;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.user-modal footer {
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

@media (max-width: 780px) {
  .page-heading,
  .form-grid {
    align-items: stretch;
    flex-direction: column;
    grid-template-columns: 1fr;
  }

  .users-table-card {
    overflow-x: auto;
  }

  .users-table {
    min-width: 900px;
  }
}
</style>
