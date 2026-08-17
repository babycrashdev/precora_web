<template>
  <section id="expert" class="expert-section">
    <div class="section-container">
      <div class="expert-grid">
        <!-- Bio Card -->
        <div class="bio-card">
          <div class="expert-badge">
            <UserCheck :size="16" />
            <span>L'Expert Référent</span>
          </div>

          <h2 class="expert-name">Olivier Lacaton</h2>
          <p class="expert-subtitle">Conseiller en Radioprotection (CRP) &amp; Fondateur de PRECORA</p>

          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-year">1989</span>
                <span class="timeline-title">Manipulateur Radio de Formation</span>
                <p class="timeline-desc">Pratique directe de la radiologie et maîtrise des contraintes de terrain.</p>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-year">1989 – 1999</span>
                <span class="timeline-title">10 ans d'expérience en Cabinet Dentaire</span>
                <p class="timeline-desc">Connaissance approfondie des flux de travail des chirurgiens-dentistes.</p>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot highlight"></div>
              <div class="timeline-content">
                <span class="timeline-year">Depuis 1992 / 1996</span>
                <span class="timeline-title">Consultant CRP Régional &amp; Premier Agrément (1996)</span>
                <p class="timeline-desc">Accrédité d'abord en PCR puis OCR, au service des professionnels de santé et de l'industrie.</p>
              </div>
            </div>
          </div>

          <div class="quote-box">
            <Quote :size="20" class="quote-icon" />
            <p class="quote-text">
              "Ma mission est d'apporter sérénité et rigueur à vos pratiques afin que le praticien n'ait aucun souci de gestion réglementaire et se concentre à 100% sur ses patients."
            </p>
          </div>
        </div>

        <!-- Zone d'Intervention Card -->
        <div class="zone-card">
          <div class="zone-header">
            <div class="zone-icon-box">
              <MapPin :size="24" />
            </div>
            <div>
              <h3 class="zone-title">Zone d'Intervention Régionale</h3>
              <p class="zone-desc">Proximité, réactivité et déplacements sur site</p>
            </div>
          </div>

          <div class="zone-group">
            <div class="group-header">
              <Compass :size="16" class="icon-compass" />
              <span>Secteurs d'Intervention Prioritaires (Couverture Intégrale)</span>
            </div>
            <div class="dept-pills-primary">
              <div class="dept-pill primary">
                <span class="dept-code">46</span>
                <span class="dept-name">Lot (Cahors, Figeac, Gourdon...)</span>
              </div>
              <div class="dept-pill primary">
                <span class="dept-code">19</span>
                <span class="dept-name">Corrèze (Brive, Tulle, Ussel...)</span>
              </div>
            </div>
          </div>

          <div class="zone-group">
            <div class="group-header">
              <Navigation :size="16" />
              <span>Départements Limitrophes &amp; Région</span>
            </div>
            <div class="dept-pills-secondary">
              <div v-for="dept in limitrophes" :key="dept.code" class="dept-pill secondary">
                <span class="dept-code">{{ dept.code }}</span>
                <span class="dept-name">{{ dept.name }}</span>
              </div>
            </div>
          </div>

          <div class="proximity-banner">
            <CheckCircle2 :size="18" class="icon-check" />
            <span>Disponibilité rapide &amp; audits directement dans vos locaux.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { 
  UserCheck, 
  MapPin, 
  Quote, 
  Compass, 
  Navigation, 
  CheckCircle2 
} from 'lucide-vue-next'

const limitrophes = [
  { code: '24', name: 'Dordogne' },
  { code: '47', name: 'Lot-et-Garonne' },
  { code: '82', name: 'Tarn-et-Garonne' },
  { code: '12', name: 'Aveyron' },
  { code: '87', name: 'Haute-Vienne' },
  { code: '15', name: 'Cantal (partiel)' }
]
</script>

<style scoped>
.expert-section {
  padding: 5rem 1.5rem;
  background-color: var(--color-navy-dark);
  color: #ffffff;
}

.section-container {
  max-width: 1240px;
  margin: 0 auto;
}

.expert-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.bio-card, .zone-card {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-card);
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.expert-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background-color: rgba(0, 149, 235, 0.15);
  color: var(--color-blue-accent);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
  align-self: flex-start;
}

.expert-name {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.expert-subtitle {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  padding-left: 0.5rem;
  margin-bottom: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 9px;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.12);
}

.timeline-item {
  display: flex;
  gap: 1.25rem;
  position: relative;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #64748b;
  margin-top: 6px;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-dot.highlight {
  background-color: var(--color-blue-accent);
  box-shadow: 0 0 10px var(--color-blue-accent);
}

.timeline-content {
  display: flex;
  flex-direction: column;
}

.timeline-year {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-blue-accent);
  text-transform: uppercase;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
}

.timeline-desc {
  font-size: 0.88rem;
  color: #94a3b8;
}

.quote-box {
  background-color: rgba(0, 149, 235, 0.08);
  border-left: 3px solid var(--color-blue-accent);
  padding: 1.25rem;
  border-radius: 0 12px 12px 0;
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.quote-icon {
  color: var(--color-blue-accent);
  flex-shrink: 0;
}

.quote-text {
  font-size: 0.92rem;
  font-style: italic;
  color: #e2e8f0;
  line-height: 1.5;
}

.zone-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.zone-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--color-blue-accent), #005691);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zone-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
}

.zone-desc {
  font-size: 0.9rem;
  color: #94a3b8;
}

.zone-group {
  margin-bottom: 1.75rem;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.85rem;
}

.icon-compass {
  color: var(--color-blue-accent);
}

.dept-pills-primary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dept-pill.primary {
  background: linear-gradient(90deg, rgba(0, 149, 235, 0.2) 0%, rgba(0, 149, 235, 0.05) 100%);
  border: 1px solid rgba(0, 149, 235, 0.4);
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dept-code {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-blue-accent);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.dept-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.dept-pills-secondary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}

.dept-pill.secondary {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dept-pill.secondary .dept-code {
  font-size: 0.85rem;
  padding: 0.1rem 0.4rem;
}

.dept-pill.secondary .dept-name {
  font-size: 0.85rem;
  color: #cbd5e1;
}

.proximity-banner {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem;
  border-radius: 10px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #6ee7b7;
  font-size: 0.88rem;
  font-weight: 500;
}

.icon-check {
  color: #10b981;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .expert-grid {
    grid-template-columns: 1fr;
  }
}
</style>
