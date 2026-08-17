<template>
  <header class="app-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <a href="#" class="brand-logo" aria-label="Accueil PRECORA">
        <div class="logo-icon">
          <ShieldCheck :size="26" class="icon-shield" />
        </div>
        <div class="logo-text">
          <span class="brand-name">PRECORA</span>
          <span class="brand-sub">OCR • Radioprotection</span>
        </div>
      </a>

      <nav class="nav-desktop" aria-label="Navigation principale">
        <a href="#metiers" class="nav-link">Nos Métiers</a>
        <a href="#expert" class="nav-link">L'Expert & Zone</a>
        <a href="#conformite" class="nav-link">Conformité</a>
        <a href="#contact" class="nav-link">Contact</a>
      </nav>

      <div class="header-actions">
        <a href="tel:+33618652116" class="cta-phone" title="Appeler Olivier Lacaton">
          <Phone :size="16" />
          <span class="phone-num">06 18 65 21 16</span>
        </a>

        <button 
          class="mobile-toggle" 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Menu principal"
        >
          <Menu v-if="!isMobileMenuOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>
    </div>

    <!-- Menu mobile déroulant -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="nav-mobile">
        <a href="#metiers" class="mobile-link" @click="isMobileMenuOpen = false">Nos Métiers</a>
        <a href="#expert" class="mobile-link" @click="isMobileMenuOpen = false">L'Expert & Zone</a>
        <a href="#conformite" class="mobile-link" @click="isMobileMenuOpen = false">Conformité</a>
        <a href="#contact" class="mobile-link" @click="isMobileMenuOpen = false">Contact</a>
        <a href="tel:+33618652116" class="mobile-cta-phone">
          <Phone :size="18" />
          Appeler au 06 18 65 21 16
        </a>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ShieldCheck, Phone, Menu, X } from 'lucide-vue-next'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 20
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(248, 250, 252, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.app-header.scrolled {
  background-color: rgba(15, 23, 42, 0.92);
  border-bottom-color: rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-md);
}

.header-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-navy-primary), var(--color-blue-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 149, 235, 0.25);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: var(--font-family-heading);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-navy-dark);
  transition: color 0.3s ease;
}

.app-header.scrolled .brand-name {
  color: #ffffff;
}

.brand-sub {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-blue-accent);
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-main);
  transition: color 0.2s ease;
  position: relative;
  padding: 0.25rem 0;
}

.app-header.scrolled .nav-link {
  color: #cbd5e1;
}

.nav-link:hover {
  color: var(--color-blue-accent);
}

.app-header.scrolled .nav-link:hover {
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cta-phone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-btn);
  background-color: var(--color-blue-accent);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25 ease;
  box-shadow: 0 4px 14px rgba(0, 149, 235, 0.3);
}

.cta-phone:hover {
  background-color: var(--color-blue-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 149, 235, 0.4);
}

.mobile-toggle {
  display: none;
  color: var(--color-navy-dark);
  padding: 0.4rem;
}

.app-header.scrolled .mobile-toggle {
  color: #ffffff;
}

.nav-mobile {
  display: flex;
  flex-direction: column;
  background-color: var(--color-navy-dark);
  padding: 1.25rem 1.5rem;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link {
  color: #f1f5f9;
  font-size: 1.05rem;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-cta-phone {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background-color: var(--color-blue-accent);
  color: #ffffff;
  padding: 0.75rem;
  border-radius: var(--radius-btn);
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 868px) {
  .nav-desktop {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
  .phone-num {
    display: none;
  }
  .cta-phone {
    padding: 0.55rem;
    border-radius: 50%;
  }
}
</style>
