<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-badge-pill">
        <Sparkles :size="15" class="icon-sparkle" />
        <span>Organisme Compétent en Radioprotection Certifié</span>
      </div>

      <h1 class="hero-title">
        Expertise &amp; Conformité en <span class="text-gradient">Radioprotection Régionale</span>
      </h1>

      <p class="hero-subtitle">
        Votre partenaire réactif pour la sécurité contre les rayonnements ionisants, 
        la protection de vos salariés et le respect rigoureux des obligations réglementaires.
      </p>

      <div class="hero-actions">
        <a href="#contact" class="btn-primary">
          <CalendarCheck :size="18" />
          <span>Prendre Rendez-vous</span>
        </a>
        <a href="tel:+33618652116" class="btn-secondary">
          <PhoneCall :size="18" />
          <span>Appeler Directement (06 18 65 21 16)</span>
        </a>
      </div>

      <div class="reassurance-grid">
        <div class="reassurance-card">
          <div class="card-icon trophy">
            <Award :size="22" />
          </div>
          <div class="card-content">
            <span class="card-title">Qualianor Certifié</span>
            <span class="card-desc">Accréditation N° 176 CR Ind 0</span>
          </div>
        </div>

        <div class="reassurance-card">
          <div class="card-icon shield">
            <ShieldCheck :size="22" />
          </div>
          <div class="card-content">
            <span class="card-title">Assurance RCP AXA</span>
            <span class="card-desc">Couverture complète garantie</span>
          </div>
        </div>

        <div class="reassurance-card">
          <div class="card-icon clock">
            <Clock :size="22" />
          </div>
          <div class="card-content">
            <span class="card-title">Plus de 30 ans</span>
            <span class="card-desc">D'expertise depuis 1996</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Sparkles, CalendarCheck, PhoneCall, Award, ShieldCheck, Clock } from 'lucide-vue-next'
</script>

<style scoped>
.hero-section {
  position: relative;
  padding: 5rem 1.5rem 4rem;
  background: radial-gradient(circle at 50% 0%, rgba(0, 149, 235, 0.08) 0%, rgba(248, 250, 252, 0) 70%);
  overflow: hidden;
}

.hero-container {
  max-width: 1040px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background-color: var(--color-blue-light);
  border: 1px solid rgba(0, 149, 235, 0.25);
  color: var(--color-blue-hover);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.75rem;
  box-shadow: var(--shadow-sm);
  animation: pulse-glow 3s infinite ease-in-out;
}

.icon-sparkle {
  color: var(--color-blue-accent);
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  max-width: 900px;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-navy-primary) 0%, var(--color-blue-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  max-width: 740px;
  line-height: 1.6;
  margin-bottom: 2.25rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.8rem;
  border-radius: var(--radius-btn);
  background: linear-gradient(135deg, var(--color-blue-accent), #0077c8);
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 24px rgba(0, 149, 235, 0.35);
  transition: all 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 149, 235, 0.45);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.6rem;
  border-radius: var(--radius-btn);
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  color: var(--color-navy-dark);
  font-weight: 600;
  font-size: 1rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.btn-secondary:hover {
  border-color: var(--color-blue-accent);
  color: var(--color-blue-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.reassurance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
}

.reassurance-card {
  background-color: var(--color-surface-card);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.reassurance-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(0, 149, 235, 0.3);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon.trophy {
  background-color: #fef3c7;
  color: #d97706;
}

.card-icon.shield {
  background-color: #dbeafe;
  color: #2563eb;
}

.card-icon.clock {
  background-color: #d1fae5;
  color: #059669;
}

.card-content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.card-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-navy-dark);
}

.card-desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(0.98); }
}

@media (max-width: 868px) {
  .reassurance-grid {
    grid-template-columns: 1fr;
  }
}
</style>
