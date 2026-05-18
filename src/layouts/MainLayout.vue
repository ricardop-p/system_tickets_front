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
</style>