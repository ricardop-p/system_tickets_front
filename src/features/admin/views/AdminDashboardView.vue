<template>
  <div class="admin-page">
    <div class="admin-header">
      <div>
        <span class="admin-kicker">Panel administrador</span>
        <h2>Gestion de la plataforma</h2>
        <p>Accede a categorias, usuarios y tickets creados en el sistema.</p>
      </div>
    </div>

    <div class="admin-grid">
      <RouterLink to="/admin/categorias" class="admin-card">
        <div class="admin-card__icon">#</div>
        <h3>Categorias</h3>
        <p>Consulta las categorias disponibles para clasificar solicitudes.</p>
      </RouterLink>

      <RouterLink to="/admin/usuarios" class="admin-card">
        <div class="admin-card__icon">@</div>
        <h3>Usuarios</h3>
        <p>Revisa los usuarios registrados dentro de la plataforma.</p>
      </RouterLink>

      <RouterLink to="/admin/tickets" class="admin-card">
        <div class="admin-card__icon">T</div>
        <h3>Todos los tickets</h3>
        <p>Visualiza el listado completo de tickets creados.</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1180px;
  margin: 0 auto;
}

.admin-header {
  margin-bottom: 24px;
}

.admin-kicker {
  color: #2563eb;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.admin-header h2 {
  margin: 6px 0;
  font-weight: 800;
  color: #111827;
}

.admin-header p {
  color: #6b7280;
  margin: 0;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.admin-card {
  display: block;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 22px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.admin-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
}

.admin-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 800;
  margin-bottom: 16px;
}

.admin-card h3 {
  font-size: 1.1rem;
  font-weight: 800;
}

.admin-card p {
  margin: 0;
  color: #6b7280;
}
</style>
