<template>
  <main class="admin-container">
    <div class="admin-card">
      <h1>Espace d'Administration PRECORA</h1>
      <p>Interface réservée à l'OCR et à la gestion des données.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
// Espace Administration & Calculateur
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-navy-dark);
  color: #ffffff;
}

.admin-card {
  background: var(--color-navy-primary);
  padding: 3rem;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  text-align: center;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-card h1 {
  font-size: 1.75rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.admin-card p {
  color: var(--color-blue-light);
}
</style>
