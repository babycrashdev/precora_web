<template>
  <section id="conformite" class="conformite-section">
    <div class="section-container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="section-badge">
          <ShieldAlert :size="16" />
          <span>Cadre Légal &amp; Accréditations</span>
        </div>
        <h2 class="section-title">
          Conformité Réglementaire &amp; Validité des Agréments
        </h2>
        <p class="section-desc">
          PRECORA garantit un suivi rigoureux des exigences fixées par l'Autorité de Sûreté Nucléaire et de Radioprotection (ASNR) et le Code du Travail.
        </p>
      </div>

      <!-- Regulatory Alert Banner if Enabled -->
      <div v-if="alertConfig?.enabled" class="alert-banner" :class="alertConfig.type">
        <div class="alert-icon-wrapper">
          <AlertTriangle :size="24" />
        </div>
        <div class="alert-content">
          <h3 class="alert-title">{{ alertConfig.title }}</h3>
          <p class="alert-msg">{{ alertConfig.message }}</p>
        </div>
      </div>

      <!-- Agreements Grid -->
      <div class="agreements-grid">
        <div 
          v-for="agreement in agreementsList" 
          :key="agreement.id"
          class="agreement-card"
        >
          <div class="agreement-card-header">
            <div class="sector-badge">
              <FileCheck :size="16" />
              <span>{{ agreement.sector }}</span>
            </div>
            <div class="status-pill active">
              <CheckCircle :size="14" />
              <span>{{ agreement.status }}</span>
            </div>
          </div>

          <h3 class="agreement-num">Accréditation Qualianor {{ agreement.number }}</h3>

          <div class="expiry-box">
            <span class="expiry-label">Échéance de certification :</span>
            <div class="expiry-date">
              <Calendar :size="18" class="icon-calendar" />
              <span>{{ agreement.expiryFormatted }}</span>
            </div>
          </div>

          <p class="agreement-desc">
            Vérifications d'installations, gestion de la dosimétrie et renouvellements périodiques assurés sans interruption de service.
          </p>
        </div>
      </div>

      <!-- Regulatory Framework Details -->
      <div class="framework-grid">
        <div class="framework-card">
          <div class="card-icon-header">
            <Scale :size="22" />
          </div>
          <h4>Code du Travail (Art. R. 4451-1 et ss.)</h4>
          <p>
            Obligation pour tout employeur détenant une source de rayonnements ionisants de désigner un Conseiller en Radioprotection (CRP) interne ou externe (OCR).
          </p>
        </div>

        <div class="framework-card">
          <div class="card-icon-header">
            <FileText :size="22" />
          </div>
          <h4>Recommandations ASNR</h4>
          <p>
            Application stricte des principes d’optimisation (ALARA) et de justification de l'exposition. Rapports d'analyse d'impact rédigés selon les normes en vigueur.
          </p>
        </div>

        <div class="framework-card">
          <div class="card-icon-header">
            <Lock :size="22" />
          </div>
          <h4>Traçabilité &amp; Archivage</h4>
          <p>
            Conservation et centralisation sécurisée de l'ensemble des fiches d'exposition, registres et rapports de contrôles techniques.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '~/composables/useContent'
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileCheck, 
  CheckCircle, 
  Calendar, 
  Scale, 
  FileText, 
  Lock 
} from 'lucide-vue-next'

const { content } = useContent()

const alertConfig = computed(() => content.value?.alert)

const agreementsList = computed(() => {
  if (content.value?.agreements && content.value.agreements.length > 0) {
    return content.value.agreements
  }
  // Fallback if loading or error
  return [
    {
      id: 'medical-dentaire-veto',
      sector: 'Dentaire, Médical & Vétérinaire',
      number: 'N° 176 CR Ind 0',
      expiryDate: '2027-10-19',
      expiryFormatted: '19/10/2027',
      status: 'actif'
    },
    {
      id: 'industrie',
      sector: 'Industriel',
      number: 'N° 176 CR Ind 0',
      expiryDate: '2030-03-31',
      expiryFormatted: '31/03/2030',
      status: 'actif'
    }
  ]
})
</script>

<style scoped>
.conformite-section {
  padding: 5rem 1.5rem;
  background-color: var(--color-bg-main);
}

.section-container {
  max-width: 1240px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background-color: var(--color-blue-light);
  color: var(--color-blue-accent);
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.85rem;
}

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: var(--color-navy-dark);
  margin-bottom: 0.75rem;
}

.section-desc {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 720px;
}

.alert-banner {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-card);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 3rem;
  box-shadow: var(--shadow-sm);
}

.alert-icon-wrapper {
  color: var(--color-warning);
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #7c2d12;
  margin-bottom: 0.25rem;
}

.alert-msg {
  font-size: 0.92rem;
  color: #9a3412;
  line-height: 1.5;
}

.agreements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
  margin-bottom: 3.5rem;
}

.agreement-card {
  background-color: var(--color-surface-card);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.agreement-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(0, 149, 235, 0.3);
}

.agreement-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.sector-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-navy-primary);
  background-color: var(--color-blue-light);
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
}

.status-pill.active {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-success);
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.agreement-num {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-navy-dark);
  margin-bottom: 1rem;
}

.expiry-box {
  background-color: var(--color-bg-main);
  border: 1px solid var(--color-border);
  padding: 0.85rem 1.1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.expiry-label {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.expiry-date {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--color-navy-dark);
}

.icon-calendar {
  color: var(--color-blue-accent);
}

.agreement-desc {
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.framework-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.framework-card {
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.card-icon-header {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: var(--color-blue-light);
  color: var(--color-blue-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.framework-card h4 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-navy-dark);
}

.framework-card p {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

@media (max-width: 868px) {
  .agreements-grid {
    grid-template-columns: 1fr;
  }
  .framework-grid {
    grid-template-columns: 1fr;
  }
}
</style>
