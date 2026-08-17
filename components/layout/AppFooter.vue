<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="brand-header">
            <ShieldCheck :size="24" class="brand-icon" />
            <span class="brand-title">PRECORA</span>
          </div>
          <p class="brand-tagline">
            Organisme Compétent en Radioprotection (OCR). Conseil, vérifications réglementaires, gestion dosimétrique, mesure du radon et calculs de blindage.
          </p>
          <div class="accreditation-pill">
            <Award :size="14" />
            <span>Qualianor N° 176 CR Ind 0 • RCP AXA</span>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Navigation</h4>
          <ul class="col-links">
            <li><a href="#metiers">Nos Métiers</a></li>
            <li><a href="#expert">L'Expert &amp; Zone</a></li>
            <li><a href="#conformite">Conformité</a></li>
            <li><a href="#contact">Contact &amp; Devis</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Secteurs</h4>
          <ul class="col-links">
            <li><a href="#metiers">Radioprotection Dentaire</a></li>
            <li><a href="#metiers">Radioprotection Médicale</a></li>
            <li><a href="#metiers">Radioprotection Vétérinaire</a></li>
            <li><a href="#metiers">Radioprotection Industrielle</a></li>
            <li><a href="#metiers">Mesure du Radon</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Contact Direct</h4>
          <p class="contact-line"><strong>Expert :</strong> Olivier Lacaton</p>
          <p class="contact-line"><strong>Téléphone :</strong> 06 18 65 21 16</p>
          <p class="contact-line"><strong>Email :</strong> contact@precora.fr</p>
          <p class="contact-line"><strong>Zone :</strong> Lot (46), Corrèze (19) &amp; limitrophes</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} PRECORA — Olivier Lacaton. Tous droits réservés.
        </p>

        <div class="footer-bottom-links">
          <span class="legal-text">N° Accréditation 176 CR Ind 0</span>
          <span class="separator">•</span>
          <NuxtLink to="/admin" class="admin-link">
            <Lock :size="14" />
            <span>🔐 Espace Pro</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, Award, Lock } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: var(--color-navy-dark);
  color: #94a3b8;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4rem 1.5rem 2rem;
  font-size: 0.9rem;
}

.footer-container {
  max-width: 1240px;
  margin: 0 auto;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 2.5rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #ffffff;
  margin-bottom: 0.75rem;
}

.brand-icon {
  color: var(--color-blue-accent);
}

.brand-title {
  font-family: var(--font-family-heading);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-tagline {
  line-height: 1.55;
  margin-bottom: 1.25rem;
  font-size: 0.88rem;
}

.accreditation-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-blue-accent);
  font-size: 0.8rem;
  font-weight: 600;
}

.col-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.col-links a {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.col-links a:hover {
  color: var(--color-blue-accent);
}

.contact-line {
  line-height: 1.7;
  font-size: 0.88rem;
}

.contact-line strong {
  color: #cbd5e1;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.75rem;
  font-size: 0.85rem;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.separator {
  color: #475569;
}

.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #94a3b8;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 500;
  transition: all 0.2s ease;
}

.admin-link:hover {
  color: #ffffff;
  background-color: rgba(0, 149, 235, 0.2);
  border-color: rgba(0, 149, 235, 0.4);
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
