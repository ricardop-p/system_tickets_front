<template>
  <div class="app-layout">

    <!-- NAVBAR -->
    <header class="topbar shadow-sm">
      <div class="container-fluid d-flex justify-content-between align-items-center px-4">
        
        <div class="d-flex align-items-center gap-3">
          <div class="logo-circle">
            🎫
          </div>

          <div>
            <h4 class="m-0 fw-bold text-white">Sistema de Tickets</h4>
            <small class="text-light opacity-75">
              Mesa de ayuda y soporte técnico 
            </small>
          </div>
        </div>

        <nav class="d-flex align-items-center gap-3">
          <RouterLink to="/" class="nav-btn">
            Inicio
          </RouterLink>

          <RouterLink to="/tickets" class="nav-btn">
            Tickets
          </RouterLink>

          <RouterLink to="/tickets/nuevo" class="nav-btn nav-btn-primary">
            + Nuevo Ticket
          </RouterLink>

          <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-btn nav-btn-admin">
            Admin
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- MAIN -->
    <main class="main-content">
      <div class="container-fluid py-4 px-md-4 px-3">
        <RouterView />
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <p class="m-0">
        © 2026 Sistema de Tickets • Vue 3 + Pinia + PostgreSQL
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/features/auth/store/authStore'

const auth = useAuthStore()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f7fb;
}

/* TOPBAR */
.topbar {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 700;
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-btn:hover,
.nav-btn.router-link-active {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

.nav-btn-primary {
  background: #22c55e;
  color: #052e16;
}

.nav-btn-primary:hover,
.nav-btn-primary.router-link-active {
  background: #16a34a;
  color: #fff;
}

.nav-btn-admin {
  background: #38bdf8;
  color: #082f49;
}

.nav-btn-admin:hover,
.nav-btn-admin.router-link-active {
  background: #0284c7;
  color: #fff;
}
</style>
