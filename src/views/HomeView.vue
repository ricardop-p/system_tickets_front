<template>
  <div class="login-page">

    <div class="login-wrapper">

      <!-- PANEL IZQUIERDO -->
      <div class="welcome-panel">
        <div>
          <h1>Sistema de Tickets</h1>

          <p>
            Plataforma de mesa de ayuda para la gestión,
            escalado y seguimiento de incidencias técnicas.
          </p>

          <div class="features">
            <div class="feature-item">
              🎫 Gestión de Tickets
            </div>

            <div class="feature-item">
              🔒 Seguridad JWT
            </div>

            <div class="feature-item">
              ⚡ Escalado Automático
            </div>

            <div class="feature-item">
              👨‍💻 Técnicos por Nivel
            </div>
          </div>
        </div>
      </div>

      <!-- LOGIN -->
      <div class="login-card-container">
        <LoginCard />
      </div>

    </div>

  </div>
</template>

<script setup>
import LoginCard from '../components/login.vue'
</script>

<style scoped>

.login-page {
  min-height: 100vh;

  background:
    linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)),
    url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600');

  background-size: cover;
  background-position: center;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 1200px;

  display: grid;
  grid-template-columns: 1fr 450px;

  overflow: hidden;
  border-radius: 24px;

  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}

/* IZQUIERDA */
.welcome-panel {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);

  color: white;

  padding: 70px;

  display: flex;
  align-items: center;
}

.welcome-panel h1 {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 20px;
}

.welcome-panel p {
  font-size: 18px;
  line-height: 1.7;
  opacity: 0.9;

  margin-bottom: 35px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  background: rgba(255,255,255,0.12);

  padding: 15px 20px;

  border-radius: 12px;

  font-size: 16px;
}

/* LOGIN */
.login-card-container {
  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 50px;
}

/* RESPONSIVE */
@media (max-width: 992px) {

  .login-wrapper {
    grid-template-columns: 1fr;
  }

  .welcome-panel {
    display: none;
  }

  .login-card-container {
    padding: 40px 25px;
  }

}

</style>