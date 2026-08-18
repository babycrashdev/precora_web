<template>
  <div class="admin-page">
    <!-- Screen 1: Login Form (If not authenticated) -->
    <div v-if="!isAuthenticated" class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-badge">PRECORA</div>
          <h1>Espace Administration</h1>
          <p>Accès sécurisé réservé à l'Organisme Compétent en Radioprotection.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="admin-password">Mot de passe Administrateur</label>
            <input 
              id="admin-password"
              type="password" 
              v-model="password" 
              placeholder="Entrez le mot de passe d'accès"
              class="password-input"
              required
              :disabled="isLoading"
            />
          </div>

          <div v-if="errorMessage" class="error-alert">
            ⚠️ {{ errorMessage }}
          </div>

          <button type="submit" :disabled="isLoading" class="btn-login">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>🔓 Connexion à l'Espace Pro</span>
          </button>
        </form>

        <div class="login-footer">
          <NuxtLink to="/" class="back-link">← Retour au site public</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Screen 2: Admin Dashboard (If authenticated) -->
    <div v-else class="dashboard-wrapper">
      <!-- Admin Top Navbar -->
      <header class="admin-navbar">
        <div class="navbar-container">
          <div class="brand-group">
            <span class="brand-title">PRECORA Admin</span>
            <span class="badge-status">🟢 Connecté</span>
          </div>

          <!-- Navigation Tabs -->
          <nav class="admin-tabs">
            <button 
              type="button"
              :class="['tab-btn', { active: activeTab === 'editor' }]"
              @click="activeTab = 'editor'"
            >
              📝 Éditeur de Contenu
            </button>
            <button 
              type="button"
              :class="['tab-btn', { active: activeTab === 'calculator' }]"
              @click="activeTab = 'calculator'"
            >
              🧮 Calculateur NFC 15-160
            </button>
          </nav>

          <!-- User Actions -->
          <div class="user-actions">
            <NuxtLink to="/" class="btn-outline">🌐 Voir le site</NuxtLink>
            <button type="button" @click="handleLogout" class="btn-logout">
              🔒 Déconnexion
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="dashboard-content">
        <div class="content-container">
          <KeepAlive>
            <DateEditor v-if="activeTab === 'editor'" />
            <NfcCalculator v-else-if="activeTab === 'calculator'" />
          </KeepAlive>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DateEditor from '~/components/admin/DateEditor.vue'
import NfcCalculator from '~/components/admin/NfcCalculator.vue'

definePageMeta({
  title: 'Espace Administration & Calculateur NFC 15-160 - PRECORA'
})

const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const activeTab = ref<'editor' | 'calculator'>('editor')

const { isAuthenticated, initAuth, login, logout } = useAdminAuth()

onMounted(() => {
  initAuth()
})

const handleLogin = async () => {
  if (!password.value) return

  isLoading.value = true
  errorMessage.value = ''

  const res = await login(password.value)
  if (res.success) {
    password.value = ''
  } else {
    errorMessage.value = res.error || 'Mot de passe administrateur incorrect.'
  }
  isLoading.value = false
}

const handleLogout = () => {
  logout()
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: var(--color-bg-main, #f8fafc);
  color: var(--color-text-main, #1e293b);
  font-family: inherit;
}

/* Login Screen Styles */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top, #1e2942 0%, #0f172a 100%);
}

.login-card {
  background: #ffffff;
  padding: 3rem;
  border-radius: var(--radius-card, 16px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-badge {
  display: inline-block;
  background: var(--color-navy-dark, #0f172a);
  color: var(--color-blue-accent, #0095eb);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 2px;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 149, 235, 0.3);
}

.login-header h1 {
  font-size: 1.75rem;
  color: var(--color-navy-primary, #1e2942);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--color-text-muted, #64748b);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-navy-primary, #1e2942);
}

.password-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-btn, 8px);
  border: 1px solid var(--color-border, #e2e8f0);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.password-input:focus {
  outline: none;
  border-color: var(--color-blue-accent, #0095eb);
  box-shadow: 0 0 0 3px rgba(0, 149, 235, 0.15);
}

.error-alert {
  background: #fef2f2;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-btn, 8px);
  font-size: 0.85rem;
  border: 1px solid #fecaca;
}

.btn-login {
  background: var(--color-blue-accent, #0095eb);
  color: #ffffff;
  font-weight: 600;
  padding: 0.9rem;
  border-radius: var(--radius-btn, 8px);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease, transform 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover:not(:disabled) {
    background: var(--color-blue-hover, #007cc3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.back-link {
  color: var(--color-text-muted, #64748b);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-blue-accent, #0095eb);
  }
}

/* Dashboard Styles */
.admin-navbar {
  background: var(--color-navy-dark, #0f172a);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.85rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.2rem;
}

.badge-status {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success, #10b981);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem;
  border-radius: var(--radius-btn, 8px);
}

.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #ffffff;
}

.tab-btn.active {
  background: var(--color-blue-accent, #0095eb);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 149, 235, 0.3);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-outline {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.btn-logout {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.45rem 0.95rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    color: #ffffff;
  }
}

.dashboard-content {
  padding: 2.5rem 2rem;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
