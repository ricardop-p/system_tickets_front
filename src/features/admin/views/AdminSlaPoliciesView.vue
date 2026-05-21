<template>
  <div class="admin-list">
    <div class="section-header">
      <div>
        <h2>Politicas SLA</h2>
        <p>Configuracion de tiempos y alertas para seguimiento interno.</p>
      </div>
    </div>

    <div class="policy-grid">
      <article class="policy-card">
        <span>Critica</span>
        <strong>4 horas</strong>
        <p>Bloqueos totales o impactos severos de operacion.</p>
      </article>

      <article class="policy-card">
        <span>Alta</span>
        <strong>8 horas</strong>
        <p>Incidentes relevantes con afectacion parcial.</p>
      </article>

      <article class="policy-card">
        <span>Media</span>
        <strong>24 horas</strong>
        <p>Solicitudes operativas sin bloqueo total.</p>
      </article>

      <article class="policy-card">
        <span>Baja</span>
        <strong>48 horas</strong>
        <p>Requerimientos informativos o de baja urgencia.</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.admin-list {
  max-width: 1180px;
}

.section-header {
  margin-bottom: 22px;
}

.section-header h2 {
  color: #061734;
  font-weight: 900;
  margin: 0;
}

.section-header p {
  color: #8a9bbd;
  margin: 4px 0 0;
}

.policy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.policy-card {
  background: #fff;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.policy-card span {
  color: #587098;
  display: block;
  font-size: 0.74rem;
  font-weight: 900;
  text-transform: uppercase;
}

.policy-card strong {
  color: #061734;
  display: block;
  font-size: 1.7rem;
  margin: 8px 0;
}

.policy-card p {
  color: #64748b;
  margin: 0;
}
</style>
