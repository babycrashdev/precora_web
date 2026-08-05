<template>
  <section id="contact" class="contact-section">
    <div class="section-container">
      <div class="contact-grid">
        <!-- Form Info Left -->
        <div class="info-card">
          <div class="info-badge">
            <MessageSquare :size="16" />
            <span>Contact &amp; Devis</span>
          </div>

          <h2 class="info-title">Échangeons sur Vos Besoins en Radioprotection</h2>
          <p class="info-desc">
            Vous souhaitez désigner un Conseiller en Radioprotection, réaliser un calcul de blindage (NFC 15-160) ou lancer une campagne de mesure Radon ? Contactez-nous pour une prise en charge rapide.
          </p>

          <div class="direct-contact-list">
            <a href="tel:+33618652116" class="contact-item">
              <div class="item-icon phone">
                <Phone :size="20" />
              </div>
              <div class="item-details">
                <span class="item-label">Ligne Directe (Olivier Lacaton)</span>
                <span class="item-val">06 18 65 21 16</span>
              </div>
            </a>

            <a href="mailto:contact@precora.fr" class="contact-item">
              <div class="item-icon mail">
                <Mail :size="20" />
              </div>
              <div class="item-details">
                <span class="item-label">Adresse Email</span>
                <span class="item-val">contact@precora.fr</span>
              </div>
            </a>

            <div class="contact-item non-clickable">
              <div class="item-icon clock">
                <Clock :size="20" />
              </div>
              <div class="item-details">
                <span class="item-label">Engagement de Réponse</span>
                <span class="item-val">Retour sous 24h à 48h ouvrées</span>
              </div>
            </div>
          </div>

          <div class="assurance-badge">
            <ShieldCheck :size="18" class="icon-shield" />
            <span>Vos données sont strictement confidentielles et traitées par PRECORA.</span>
          </div>
        </div>

        <!-- Form Right -->
        <div class="form-card">
          <h3 class="form-title">Envoyer un Message</h3>

          <div v-if="submitted" class="success-message">
            <div class="success-icon">
              <CheckCircle2 :size="32" />
            </div>
            <h4>Message envoyé avec succès !</h4>
            <p>Merci {{ form.name }}. Olivier Lacaton reprendra contact avec vous très rapidement au {{ form.phone }}.</p>
            <button class="reset-btn" @click="resetForm">Nouveau message</button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="contact-form" novalidate>
            <div class="form-group">
              <label for="name">Nom complet <span class="req">*</span></label>
              <input 
                id="name"
                v-model.trim="form.name"
                type="text"
                placeholder="Dr. Jean Dupont"
                :class="{ 'has-error': errors.name }"
              />
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Adresse Email <span class="req">*</span></label>
                <input 
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  placeholder="jean.dupont@exemple.fr"
                  :class="{ 'has-error': errors.email }"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="phone">Téléphone <span class="req">*</span></label>
                <input 
                  id="phone"
                  v-model.trim="form.phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  :class="{ 'has-error': errors.phone }"
                />
                <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="profession">Activité / Profession <span class="req">*</span></label>
              <select 
                id="profession"
                v-model="form.profession"
                :class="{ 'has-error': errors.profession }"
              >
                <option value="" disabled selected>Sélectionnez votre secteur</option>
                <option value="dentaire">Cabinet Dentaire</option>
                <option value="medical">Structure Médicale / Radiologie</option>
                <option value="veto">Clinique Vétérinaire</option>
                <option value="industriel">Industrie / Contrôle X</option>
                <option value="radon">Mesure Radon</option>
                <option value="autre">Autre</option>
              </select>
              <span v-if="errors.profession" class="error-text">{{ errors.profession }}</span>
            </div>

            <div class="form-group">
              <label for="message">Message ou demande spécifique <span class="req">*</span></label>
              <textarea 
                id="message"
                v-model.trim="form.message"
                rows="4"
                placeholder="Précisez votre demande (désignation CRP, renouvellement, calcul de blindage, localisation...)"
                :class="{ 'has-error': errors.message }"
              ></textarea>
              <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <Send :size="18" />
              <span>{{ isSubmitting ? 'Envoi en cours...' : 'Envoyer la Demande' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Send 
} from 'lucide-vue-next'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  profession: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  profession: '',
  message: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)

const validateForm = (): boolean => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.profession = ''
  errors.message = ''

  if (!form.name || form.name.length < 2) {
    errors.name = 'Veuillez saisir votre nom complet.'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Veuillez saisir une adresse email valide.'
    isValid = false
  }

  const phoneCleaned = form.phone.replace(/\s+/g, '')
  if (!form.phone || phoneCleaned.length < 10) {
    errors.phone = 'Veuillez saisir un numéro de téléphone valide (10 chiffres min).'
    isValid = false
  }

  if (!form.profession) {
    errors.profession = 'Veuillez sélectionner votre activité.'
    isValid = false
  }

  if (!form.message || form.message.length < 10) {
    errors.message = 'Votre message doit contenir au moins 10 caractères.'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true

  // Simulation d'envoi API
  setTimeout(() => {
    isSubmitting.value = false
    submitted.value = true
  }, 600)
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.profession = ''
  form.message = ''
  submitted.value = false
}
</script>

<style scoped>
.contact-section {
  padding: 5rem 1.5rem;
  background-color: var(--color-navy-primary);
  color: #ffffff;
}

.section-container {
  max-width: 1240px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  align-items: start;
}

.info-card {
  display: flex;
  flex-direction: column;
}

.info-badge {
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

.info-title {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.85rem;
  line-height: 1.2;
}

.info-desc {
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.direct-contact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.contact-item {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.1rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.25s ease;
  text-decoration: none;
}

.contact-item:not(.non-clickable):hover {
  background-color: rgba(0, 149, 235, 0.12);
  border-color: rgba(0, 149, 235, 0.3);
  transform: translateX(4px);
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon.phone {
  background-color: rgba(0, 149, 235, 0.2);
  color: var(--color-blue-accent);
}

.item-icon.mail {
  background-color: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}

.item-icon.clock {
  background-color: rgba(245, 158, 11, 0.2);
  color: var(--color-warning);
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-label {
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.assurance-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #94a3b8;
}

.icon-shield {
  color: var(--color-blue-accent);
  flex-shrink: 0;
}

/* Form Card */
.form-card {
  background-color: #ffffff;
  color: var(--color-text-main);
  border-radius: var(--radius-card);
  padding: 2.25rem;
  box-shadow: var(--shadow-md);
}

.form-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-navy-dark);
  margin-bottom: 1.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-navy-dark);
}

.req {
  color: var(--color-danger);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-btn);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-main);
  font-size: 0.95rem;
  color: var(--color-text-main);
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-blue-accent);
  box-shadow: 0 0 0 3px rgba(0, 149, 235, 0.15);
  background-color: #ffffff;
}

.form-group input.has-error,
.form-group select.has-error,
.form-group textarea.has-error {
  border-color: var(--color-danger);
  background-color: #fef2f2;
}

.error-text {
  font-size: 0.8rem;
  color: var(--color-danger);
  font-weight: 500;
}

.submit-btn {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem;
  border-radius: var(--radius-btn);
  background: linear-gradient(135deg, var(--color-blue-accent), #007cc3);
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 6px 18px rgba(0, 149, 235, 0.3);
  transition: all 0.25s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 149, 235, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.success-message h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy-dark);
  margin-bottom: 0.5rem;
}

.success-message p {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.reset-btn {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-btn);
  background-color: var(--color-bg-main);
  border: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-navy-dark);
}

.reset-btn:hover {
  background-color: var(--color-border);
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
