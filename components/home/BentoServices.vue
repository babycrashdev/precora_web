<template>
  <section id="metiers" class="bento-section">
    <div class="section-container">
      <div class="section-header">
        <div class="section-badge">
          <Layers :size="16" />
          <span>Expertises &amp; Secteurs</span>
        </div>
        <h2 class="section-title">
          Nos 5 Domaines d'Intervention en Radioprotection
        </h2>
        <p class="section-desc">
          Une gestion sur-mesure et rigoureuse adaptée aux spécificités réglementaires et techniques de chaque activité.
        </p>
      </div>

      <!-- Onglets Filtres -->
      <div class="tab-filters" role="tablist" aria-label="Filtrer par secteur">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
          role="tab"
          :aria-selected="activeTab === tab.id"
        >
          <component :is="tab.icon" :size="16" class="tab-icon" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Bento Grid Cards -->
      <div class="bento-grid">
        <article
          v-for="service in filteredServices"
          :key="service.id"
          class="bento-card"
          :class="[service.sizeClass, { 'featured': service.id === 'radon' }]"
        >
          <div class="card-header-top">
            <div class="service-icon-box">
              <component :is="service.icon" :size="24" />
            </div>
            <span class="sector-tag">{{ service.categoryLabel }}</span>
          </div>

          <h3 class="card-title">{{ service.title }}</h3>
          <p class="card-text">{{ service.description }}</p>

          <ul class="points-list">
            <li v-for="(point, idx) in service.bulletPoints" :key="idx">
              <CheckCircle2 :size="15" class="check-icon" />
              <span>{{ point }}</span>
            </li>
          </ul>

          <div class="card-footer-badge">
            <template v-if="service.id === 'radon'">
              <div class="radon-status-badge" :class="radonSeason ? 'active-season' : 'off-season'">
                <div class="status-dot"></div>
                <span>
                  {{ radonSeason 
                    ? "Saison Radon Active (Sept. – Avril) : Pose recommandée" 
                    : "Hors Saison Radon (Campagne à préparer pour Sept.)" 
                  }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="agreement-badge">
                <ShieldCheck :size="14" />
                <span>Certification valide jusqu'au {{ service.expiryDate }}</span>
              </div>
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { isRadonSeason } from '~/composables/useContent'
import { 
  Layers, 
  Stethoscope, 
  Hospital, 
  Dog, 
  Factory, 
  Radio, 
  CheckCircle2, 
  ShieldCheck,
  Grid
} from 'lucide-vue-next'

const activeTab = ref('all')
const radonSeason = isRadonSeason()

const tabs = [
  { id: 'all', label: 'Tous', icon: Grid },
  { id: 'dentaire', label: 'Dentaire', icon: Stethoscope },
  { id: 'medical', label: 'Médical', icon: Hospital },
  { id: 'veto', label: 'Vétérinaire', icon: Dog },
  { id: 'industriel', label: 'Industriel', icon: Factory },
  { id: 'radon', label: 'Radon', icon: Radio }
]

const services = [
  {
    id: 'dentaire',
    category: 'dentaire',
    categoryLabel: 'Cabinet Dentaire',
    title: 'Radioprotection Dentaire',
    description: 'Désignation de Conseiller en Radioprotection (CRP) obligatoire depuis 2009. Prise en charge intégrale des contraintes réglementaires pour cabinets dentaires et centres d\'imagerie.',
    bulletPoints: [
      'Contrôles internes et suivi des dosimètres',
      'Calculs de blindage et conformité locaux',
      'Registre de radioprotection à jour'
    ],
    expiryDate: '19/10/2027',
    icon: Stethoscope,
    sizeClass: 'size-medium'
  },
  {
    id: 'medical',
    category: 'medical',
    categoryLabel: 'Secteur Médical',
    title: 'Radioprotection Médicale',
    description: 'Accompagnement rigoureux des structures médicales, cliniques et cabinets de radiologie. Révisions d\'agréments et déclarations administratives ASN/ASNR.',
    bulletPoints: [
      'Évaluation des risques et zonage radiologique',
      'Audit de conformité des équipements X',
      'Dossier technique de déclaration ASN/ASNR'
    ],
    expiryDate: '19/10/2027',
    icon: Hospital,
    sizeClass: 'size-medium'
  },
  {
    id: 'veto',
    category: 'veto',
    categoryLabel: 'Clinique Vétérinaire',
    title: 'Radioprotection Vétérinaire',
    description: 'Gestion de la conformité pour postes fixes et radiographie endobuccale vétérinaire selon la Décision 2009-DC-0147.',
    bulletPoints: [
      'Adaptation aux pratiques vétérinaires',
      'Fiches individuelles d\'exposition du personnel',
      'Formation à la sécurité lors des clichés'
    ],
    expiryDate: '19/10/2027',
    icon: Dog,
    sizeClass: 'size-medium'
  },
  {
    id: 'industriel',
    category: 'industriel',
    categoryLabel: 'Secteur Industriel',
    title: 'Radioprotection Industrielle',
    description: 'Expertise sur les appareils générateurs de rayons X à fins non médicales (contrôles CND, débit < 1 µSv/h à 0.1m).',
    bulletPoints: [
      'Vérifications périodiques des générateurs X',
      'Consignes de sécurité et zonages industriels',
      'Agrément étendu jusqu\'en 2030'
    ],
    expiryDate: '31/03/2030',
    icon: Factory,
    sizeClass: 'size-medium'
  },
  {
    id: 'radon',
    category: 'radon',
    categoryLabel: 'Mesures & Santé Publique',
    title: 'Mesure du Radon (Concentration Volumique)',
    description: 'Évaluation obligatoire du risque radon en sous-sol et rez-de-chaussée (Article R. 4451-1 du Code du Travail et Décret 2018-437). Pose de détecteurs solides de traces nucléaires (DSTN).',
    bulletPoints: [
      'Dépistage réglementaire des lieux de travail',
      'Pose de détecteurs DSTN pendant 2 mois min.',
      'Campagne recommandée de septembre à avril'
    ],
    expiryDate: 'Permanent',
    icon: Radio,
    sizeClass: 'size-large'
  }
]

const filteredServices = computed(() => {
  if (activeTab.value === 'all') return services
  return services.filter(s => s.category === activeTab.value)
})
</script>

<style scoped>
.bento-section {
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
  max-width: 680px;
}

.tab-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  background-color: #ffffff;
  padding: 0.4rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  max-width: flex-content;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--color-navy-dark);
  background-color: var(--color-bg-main);
}

.tab-btn.active {
  background-color: var(--color-navy-primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(30, 41, 66, 0.2);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.bento-card {
  background-color: var(--color-surface-card);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(0, 149, 235, 0.3);
}

.bento-card.featured {
  grid-column: span 2;
  background: linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%);
  border-color: rgba(0, 149, 235, 0.25);
}

.card-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.service-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background-color: var(--color-blue-light);
  color: var(--color-blue-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sector-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background-color: var(--color-bg-main);
  color: var(--color-navy-primary);
  border: 1px solid var(--color-border);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.card-text {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.55;
  margin-bottom: 1.25rem;
}

.points-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.points-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: var(--color-text-main);
}

.check-icon {
  color: var(--color-blue-accent);
  flex-shrink: 0;
}

.card-footer-badge {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}

.agreement-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-success);
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
}

.radon-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
}

.radon-status-badge.active-season {
  background-color: rgba(16, 185, 129, 0.12);
  color: #065f46;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.radon-status-badge.off-season {
  background-color: rgba(245, 158, 11, 0.12);
  color: #92400e;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  box-shadow: 0 0 6px currentColor;
}

@media (max-width: 992px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bento-card.featured {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-card.featured {
    grid-column: span 1;
  }
}
</style>
