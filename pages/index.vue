<template>
  <main class="page-container">
    <div class="welcome-card">
      <h1>PRECORA - Organisme Compétent en Radioprotection</h1>
      <p>Site web en cours de développement.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil principale PRECORA
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-bg-main);
}

.welcome-card {
  background: var(--color-surface-card);
  padding: 3rem;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  text-align: center;
  max-width: 600px;
  border: 1px solid var(--color-border);
}

.welcome-card h1 {
  font-size: 1.75rem;
  color: var(--color-navy-dark);
  margin-bottom: 1rem;
}

.welcome-card p {
  color: var(--color-text-muted);
}
</style>
