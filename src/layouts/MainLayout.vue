<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <RouterLink to="/dashboard" class="brand">
        <span class="brand-mark">SLA</span>
        <span>
          <strong>SLA Avanzado</strong>
          <small>Portal interno</small>
        </span>
      </RouterLink>

      <nav class="sidebar-nav">
        <span class="nav-label">Navegacion</span>

        <RouterLink to="/dashboard" class="sidebar-link">
          <span class="sidebar-icon">=</span>
          Seguimiento de tickets
        </RouterLink>

        <template v-if="auth.isAdmin">
          <RouterLink to="/admin/usuarios" class="sidebar-link">
            <span class="sidebar-icon">@</span>
            Gestion de usuarios
          </RouterLink>

          <RouterLink to="/admin/categorias" class="sidebar-link">
            <span class="sidebar-icon">#</span>
            Categorias tecnicas
          </RouterLink>

          <RouterLink to="/admin/politicas-sla" class="sidebar-link">
            <span class="sidebar-icon">o</span>
            Politicas SLA
          </RouterLink>
        </template>
      </nav>

      <template v-if="auth.isAdmin">
        

      
      </template>

      <div class="sidebar-account">
        <div class="account-summary">
          <div class="account-avatar">{{ userInitial }}</div>
          <div>
            <strong>{{ userName }}</strong>
            <small>{{ roleLabel }}</small>
          </div>
        </div>

        <button type="button" class="logout-button" @click="logout">
          <span>-></span>
          Cerrar Sesion
        </button>
      </div>
    </aside>

    <section class="admin-workspace">
      <header class="admin-topbar">
        <div>
          <h1>Mesa de trabajo</h1>
          <span>{{ scopeLabel }}</span>
        </div>

        <div class="header-user">
          <span class="access-id">Acceso ID: {{ userEmail }}</span>
          <div class="header-profile">
            <strong>{{ userName }}<template v-if="auth.isAdmin"> (Admin)</template></strong>
            <small>{{ roleLabel }}</small>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useAuth } from '@/features/auth/composables/useAuth'

const auth = useAuthStore()
const { logout } = useAuth()

const userName = computed(() => (
  auth.user?.nombre ||
  auth.user?.name ||
  auth.user?.username ||
  auth.tokenPayload?.nombre ||
  auth.tokenPayload?.name ||
  'Usuario'
))

const userEmail = computed(() => (
  auth.user?.email ||
  auth.user?.correo ||
  auth.tokenPayload?.email ||
  auth.tokenPayload?.correo ||
  'usuario@sla.com'
))

const roleLabel = computed(() => {
  if (auth.isAdmin) return 'Administrador'
  if (auth.isAgent) return 'Agente tecnico'
  return 'Usuario'
})

const scopeLabel = computed(() => {
  if (auth.isAdmin) return 'Gestion interna autorizada'
  if (auth.isAgent) return 'Tickets asignados a tu mesa'
  return 'Tickets creados por ti'
})

const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: #f4f7fb;
  display: grid;
  grid-template-columns: 286px 1fr;
}

.admin-sidebar {
  background: #10182b;
  color: #dbe7ff;
  border-right: 1px solid rgba(255,255,255,0.12);
  padding: 30px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
  text-decoration: none;
  padding: 0 8px 30px;
  margin-bottom: 18px;
  border-bottom: 1px solid rgba(255,255,255,0.18);
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  color: #fff;
  font-weight: 900;
  font-size: 0.8rem;
}

.brand strong,
.brand small {
  display: block;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.brand small {
  color: #93a7d4;
  font-size: 0.68rem;
  margin-top: 6px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-label {
  color: #7385ad;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0 12px 8px;
  text-transform: uppercase;
}

.sidebar-link {
  color: #a9b9d8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  border-radius: 12px;
  padding: 0 14px;
  font-weight: 800;
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.router-link-active {
  background: #29449f;
  color: #fff;
}

.sidebar-icon {
  width: 22px;
  text-align: center;
  color: currentColor;
  font-weight: 900;
}

.code-link {
  border-top: 1px solid #22304b;
  color: #a9b9d8;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  margin-top: 10px;
  padding: 22px 14px;
}

.code-link span {
  color: #facc15;
  font-weight: 900;
}

.role-card {
  border: 1px solid rgba(219,231,255,0.9);
  border-radius: 12px;
  padding: 14px;
  margin-top: 8px;
}

.role-card strong {
  display: block;
  color: #b9c8ea;
  font-size: 0.74rem;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.role-card p {
  margin: 0;
  color: #7d91c2;
  font-size: 0.78rem;
  line-height: 1.55;
}

.sidebar-account {
  margin-top: auto;
  padding-top: 24px;
}

.account-summary {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  padding: 0 8px;
}

.account-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0b1224;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.account-summary strong,
.account-summary small {
  display: block;
}

.account-summary strong {
  color: #fff;
  font-size: 0.86rem;
  line-height: 1.2;
}

.account-summary small {
  color: #9eb4df;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
}

.logout-button {
  width: 100%;
  min-height: 38px;
  border: 1px solid #263653;
  border-radius: 12px;
  background: transparent;
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 900;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
}

.logout-button span {
  font-weight: 900;
}

.admin-workspace {
  min-width: 0;
}

.admin-topbar {
  min-height: 72px;
  background: #fff;
  border-bottom: 1px solid #dbe3ef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 36px;
}

.admin-topbar h1 {
  color: #061734;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
}

.admin-topbar span {
  color: #8a9bbd;
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 5px;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-profile {
  border-left: 1px solid #dbe3ef;
  padding-left: 16px;
  text-align: right;
}

.header-profile strong,
.header-profile small {
  display: block;
}

.header-profile strong {
  color: #061734;
  font-size: 0.86rem;
  font-weight: 900;
}

.header-profile small {
  color: #1d4ed8;
  font-size: 0.72rem;
  font-weight: 900;
}

.access-id {
  border: 1px solid #dbe3ef;
  border-radius: 999px;
  color: #061734 !important;
  font-size: 0.82rem !important;
  font-weight: 800 !important;
  letter-spacing: 0 !important;
  padding: 7px 14px;
  text-transform: none !important;
}

.admin-content {
  padding: 36px;
}

@media (max-width: 920px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: static;
    height: auto;
  }

  .admin-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-user {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-profile {
    border-left: 0;
    padding-left: 0;
    text-align: left;
  }

  .admin-content {
    padding: 22px;
  }
}
</style>
