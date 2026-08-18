<template>
  <div class="date-editor-container">
    <div class="editor-header">
      <div>
        <h2>⚙️ Éditeur de Contenu & Agréments</h2>
        <p class="subtitle">Modifiez les dates d'échéance des agréments et le message d'alerte en toute simplicité.</p>
      </div>

      <!-- Advanced settings toggle (discret) -->
      <button 
        type="button" 
        class="btn-advanced-toggle" 
        @click="showAdvanced = !showAdvanced"
        title="Paramètres de synchronisation"
      >
        <span>{{ showAdvanced ? 'Masquer options' : '⚙️ Options' }}</span>
      </button>
    </div>

    <!-- Advanced Settings (uniquement si ouvert manuellement) -->
    <transition name="slide-fade">
      <div v-if="showAdvanced" class="advanced-settings-card">
        <div class="advanced-header">
          <h4>⚙️ Paramètres Avancés (Développeur)</h4>
          <button type="button" class="btn-close-advanced" @click="showAdvanced = false">✕</button>
        </div>
        <p class="advanced-hint">
          Par défaut, le token de publication est géré et chiffré automatiquement via les secrets du projet. Vous pouvez forcer un token manuel ici si besoin.
        </p>
        <div class="grid-2">
          <div class="form-group">
            <label for="manual-repo">Dépôt GitHub</label>
            <input id="manual-repo" type="text" v-model="manualRepo" class="form-input text-input" />
          </div>
          <div class="form-group">
            <label for="manual-branch">Branche</label>
            <input id="manual-branch" type="text" v-model="manualBranch" class="form-input text-input" />
          </div>
          <div class="form-group full-width">
            <label for="manual-token">Token Manuel (Optionnel)</label>
            <input id="manual-token" type="password" v-model="manualToken" placeholder="Laisser vide pour utiliser le token automatique chiffré" class="form-input text-input" />
          </div>
        </div>
      </div>
    </transition>

    <form @submit.prevent="saveContent" class="editor-form">
      <!-- Section Agréments -->
      <div class="form-section">
        <h3 class="section-title">📜 Agréments Réglementaires & Certifications</h3>
        
        <div class="grid-2">
          <div class="form-group">
            <label for="date-med-dent">Agrément Dentaire, Médical & Vétérinaire</label>

            <div class="input-row">
              <input 
                id="date-med-dent"
                type="date" 
                v-model="medDentDate"
                @change="updateMedDentFormatted"
                class="form-input"
              />
              <input 
                type="text" 
                v-model="medDentFormatted"
                placeholder="Ex: 19/10/2027"
                class="form-input text-input"
              />
            </div>
            <span class="field-hint">Échéance de l'agrément Qualianor N° 176 CR Ind 0</span>
          </div>

          <div class="form-group">
            <label for="date-indus">Agrément Industriel</label>
            <div class="input-row">
              <input 
                id="date-indus"
                type="date" 
                v-model="indusDate"
                @change="updateIndusFormatted"
                class="form-input"
              />
              <input 
                type="text" 
                v-model="indusFormatted"
                placeholder="Ex: 31/03/2030"
                class="form-input text-input"
              />
            </div>
            <span class="field-hint">Échéance pour les installations d'imagerie industrielle</span>
          </div>
        </div>

        <div class="form-group full-width margin-top">
          <label for="qualianor-info">Information Accréditation / Qualianor</label>
          <input 
            id="qualianor-info"
            type="text" 
            v-model="qualianorInfo"
            placeholder="Ex: Accréditation Qualianor N° 176 CR Ind 0"
            class="form-input text-input"
          />
        </div>
      </div>

      <!-- Section Alerte Réglementaire -->
      <div class="form-section">
        <div class="section-title-row">
          <h3 class="section-title">🔔 Alerte Réglementaire (Bannière du Site)</h3>
          <label class="toggle-switch">
            <input type="checkbox" v-model="alertForm.enabled" />
            <span class="slider"></span>
            <span class="toggle-label">{{ alertForm.enabled ? 'Active' : 'Masquée' }}</span>
          </label>
        </div>

        <div class="grid-2 margin-top">
          <div class="form-group">
            <label for="alert-title">Titre de l'Alerte</label>
            <input 
              id="alert-title"
              type="text" 
              v-model="alertForm.title"
              class="form-input text-input"
              placeholder="Titre explicatif"
            />
          </div>

          <div class="form-group">
            <label for="alert-type">Niveau d'Alerte</label>
            <select id="alert-type" v-model="alertForm.type" class="form-input select-input">
              <option value="warning">Alerte Orange (Important)</option>
              <option value="info">Information Bleue (Standard)</option>
              <option value="danger">Urgence Rouge (Critique)</option>
            </select>
          </div>
        </div>

        <div class="form-group full-width margin-top">
          <label for="alert-msg">Message de la bannière</label>
          <textarea 
            id="alert-msg"
            v-model="alertForm.message" 
            rows="3"
            class="form-input text-area"
            placeholder="Description détaillée transmise aux clients..."
          ></textarea>
        </div>
      </div>

      <!-- Submit & Feedback -->
      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="btn-save">
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>🚀 Enregistrer et Publier</span>
        </button>
      </div>

      <div v-if="feedbackMessage" :class="['feedback-banner', feedbackType]">
        <div class="feedback-content" v-html="feedbackMessage"></div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useContent } from '../../composables/useContent'
import { useAdminAuth } from '../../composables/useAdminAuth'

const { content, refresh } = useContent()
const { decryptedGithubToken } = useAdminAuth()

const isSubmitting = ref(false)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error' | 'warning'>('success')

// Advanced overrides (optional)
const showAdvanced = ref(false)
const manualRepo = ref('babycrashdev/precora_web')
const manualBranch = ref('main')
const manualToken = ref('')

// Reactive local state
const medDentDate = ref('')
const medDentFormatted = ref('')
const indusDate = ref('')
const indusFormatted = ref('')
const qualianorInfo = ref('')

const alertForm = ref({
  enabled: true,
  type: 'warning',
  title: '',
  message: ''
})

const populateForm = () => {
  if (!content.value) return

  const medDent = content.value.agreements.find(a => a.id === 'medical-dentaire-veto')
  if (medDent) {
    medDentDate.value = medDent.expiryDate || ''
    medDentFormatted.value = medDent.expiryFormatted || ''
  }

  const indus = content.value.agreements.find(a => a.id === 'industrie')
  if (indus) {
    indusDate.value = indus.expiryDate || ''
    indusFormatted.value = indus.expiryFormatted || ''
  }

  const qualianor = content.value.company.accreditations?.find(a => a.id === 'qualianor')
  qualianorInfo.value = qualianor ? qualianor.name : ''

  if (content.value.alert) {
    alertForm.value = {
      enabled: content.value.alert.enabled,
      type: content.value.alert.type,
      title: content.value.alert.title,
      message: content.value.alert.message
    }
  }
}

onMounted(() => {
  populateForm()
})

watch(content, () => {
  populateForm()
}, { deep: true })

const updateMedDentFormatted = () => {
  if (medDentDate.value) {
    const [year, month, day] = medDentDate.value.split('-')
    if (year && month && day) {
      medDentFormatted.value = `${day}/${month}/${year}`
    }
  }
}

const updateIndusFormatted = () => {
  if (indusDate.value) {
    const [year, month, day] = indusDate.value.split('-')
    if (year && month && day) {
      indusFormatted.value = `${day}/${month}/${year}`
    }
  }
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const buildUpdatedContent = () => {
  const updated = JSON.parse(JSON.stringify(content.value || {}))

  if (Array.isArray(updated.agreements)) {
    const medDent = updated.agreements.find((a: any) => a.id === 'medical-dentaire-veto')
    if (medDent) {
      medDent.expiryDate = medDentDate.value
      medDent.expiryFormatted = medDentFormatted.value
    }

    const indus = updated.agreements.find((a: any) => a.id === 'industrie')
    if (indus) {
      indus.expiryDate = indusDate.value
      indus.expiryFormatted = indusFormatted.value
    }
  }

  if (updated.company?.accreditations) {
    const qualianor = updated.company.accreditations.find((a: any) => a.id === 'qualianor')
    if (qualianor) {
      qualianor.name = qualianorInfo.value
      qualianor.badge = qualianorInfo.value
    }
  }

  updated.alert = {
    enabled: alertForm.value.enabled,
    type: alertForm.value.type,
    title: alertForm.value.title,
    message: alertForm.value.message
  }

  return updated
}

const saveContent = async () => {
  isSubmitting.value = true
  feedbackMessage.value = ''

  try {
    const updatedContent = buildUpdatedContent()
    const token = manualToken.value.trim() || decryptedGithubToken.value.trim()
    const repo = manualRepo.value.trim() || 'babycrashdev/precora_web'
    const branch = manualBranch.value.trim() || 'main'

    // Cas 1 : Token GitHub disponible (chiffré ou manuel)
    if (token) {
      const filePath = 'server/data/content.json'
      
      const getFileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      })

      if (!getFileRes.ok) {
        throw new Error(`Erreur d'accès (${getFileRes.status}). Vérifiez les droits du token.`)
      }

      const fileData = await getFileRes.json()
      const currentSha = fileData.sha

      const jsonString = JSON.stringify(updatedContent, null, 2)
      const base64Content = utf8ToBase64(jsonString)

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'chore(content): mise à jour du contenu depuis l\'espace admin',
          content: base64Content,
          sha: currentSha,
          branch: branch
        })
      })

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}))
        throw new Error(errJson.message || `Erreur de publication (${putRes.status})`)
      }

      if (content.value) {
        Object.assign(content.value, updatedContent)
      }

      feedbackType.value = 'success'
      feedbackMessage.value = '✅ <strong>Modifications publiées avec succès !</strong><br>Le site se met à jour automatiquement en arrière-plan. Il sera visible pour tous les visiteurs dans 1 à 2 minutes.'
      return
    }

    // Cas 2 : Environnement de développement local (Node)
    try {
      await $fetch('/api/content', {
        method: 'POST',
        body: updatedContent
      })
      await refresh()
      feedbackType.value = 'success'
      feedbackMessage.value = '✅ Le contenu a été sauvegardé avec succès en local !'
      return
    } catch {
      feedbackType.value = 'warning'
      feedbackMessage.value = '⚠️ Le token de publication GitHub n\'est pas configuré dans les secrets du projet.'
    }

  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMessage.value = `❌ ${err.message || 'Une erreur est survenue lors de la sauvegarde.'}`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.date-editor-container {
  background: var(--color-surface-card, #ffffff);
  border-radius: var(--radius-card, 16px);
  padding: 2.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border, #e2e8f0);
}

.editor-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.editor-header h2 {
  font-size: 1.5rem;
  color: var(--color-navy-primary, #1e2942);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-muted, #64748b);
  font-size: 0.95rem;
}

.btn-advanced-toggle {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-navy-primary, #1e2942);
    border-color: #cbd5e1;
  }
}

.advanced-settings-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.advanced-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.advanced-header h4 {
  font-size: 0.95rem;
  margin: 0;
  color: var(--color-navy-dark, #0f172a);
}

.btn-close-advanced {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94a3b8;
}

.advanced-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 1rem;
}

/* Form sections */
.form-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.75rem;
  margin-bottom: 2rem;
  border: 1px solid #f1f5f9;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.15rem;
  color: var(--color-navy-dark, #0f172a);
  margin-bottom: 1rem;
}

.section-title-row .section-title {
  margin-bottom: 0;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.margin-top {
  margin-top: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-navy-primary, #1e2942);
}

.input-row {
  display: flex;
  gap: 0.75rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-btn, 8px);
  border: 1px solid var(--color-border, #e2e8f0);
  background: #ffffff;
  color: var(--color-text-main, #1e293b);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue-accent, #0095eb);
  box-shadow: 0 0 0 3px rgba(0, 149, 235, 0.15);
}

.field-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted, #64748b);
}

/* Switch toggle */
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.toggle-switch input {
  display: none;
}

.slider {
  width: 44px;
  height: 24px;
  background-color: #cbd5e1;
  border-radius: 12px;
  position: relative;
  transition: background-color 0.2s ease;
}

.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.toggle-switch input:checked + .slider {
  background-color: var(--color-blue-accent, #0095eb);
}

.toggle-switch input:checked + .slider::before {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-navy-primary, #1e2942);
}

/* Actions & Feedback */
.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  background: var(--color-blue-accent, #0095eb);
  color: #ffffff;
  font-weight: 600;
  padding: 0.95rem 2.5rem;
  border-radius: var(--radius-btn, 8px);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease, transform 0.1s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: var(--color-blue-hover, #007cc3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.feedback-banner {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-btn, 8px);
  font-size: 0.95rem;
  line-height: 1.5;
}

.feedback-banner.success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.feedback-banner.warning {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}

.feedback-banner.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
