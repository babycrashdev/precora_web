<template>
  <div class="date-editor-container">
    <div class="editor-header">
      <div>
        <h2>⚙️ Éditeur de Contenu & Agréments</h2>
        <p class="subtitle">Modifiez les dates d'échéance des agréments et le message d'alerte en temps réel.</p>
      </div>

      <!-- GitHub Sync Status Badge -->
      <div class="sync-badge-container">
        <button type="button" class="btn-toggle-sync" @click="showSyncSettings = !showSyncSettings">
          <span v-if="githubToken" class="badge-status-synced">🟢 Synchro GitHub Prête</span>
          <span v-else class="badge-status-missing">⚠️ Configurer Synchro GitHub</span>
          <span class="gear-icon">⚙️</span>
        </button>
      </div>
    </div>

    <!-- GitHub Settings Accordion / Modal Box -->
    <transition name="slide-fade">
      <div v-if="showSyncSettings" class="sync-settings-card">
        <div class="sync-settings-header">
          <h4>🔑 Configuration de la Publication Automatique (GitHub)</h4>
          <button type="button" class="btn-close-sync" @click="showSyncSettings = false">✕</button>
        </div>
        <p class="sync-explanation">
          Comme votre site est hébergé en statique, les modifications sont directement enregistrées sur GitHub, ce qui redéploie automatiquement le site en ligne pour tous les visiteurs.
        </p>

        <div class="grid-2">
          <div class="form-group full-width">
            <label for="gh-token">
              GitHub Personal Access Token (PAT)
              <a 
                href="https://github.com/settings/tokens/new?scopes=repo&description=Precora+Admin+Sync" 
                target="_blank" 
                rel="noopener"
                class="token-help-link"
              >
                🔗 Générer un token GitHub en 1 clic
              </a>
            </label>
            <div class="input-with-toggle">
              <input 
                id="gh-token"
                :type="showToken ? 'text' : 'password'"
                v-model="githubToken"
                @input="saveGithubConfig"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                class="form-input text-input"
              />
              <button type="button" class="btn-eye" @click="showToken = !showToken" :title="showToken ? 'Masquer' : 'Afficher'">
                {{ showToken ? '👁️' : '🙈' }}
              </button>
            </div>
            <span class="field-hint">Le token est stocké uniquement dans votre navigateur et n'est jamais transmis à des tiers.</span>
          </div>

          <div class="form-group">
            <label for="gh-repo">Dépôt GitHub (Propriétaire/Dépôt)</label>
            <input 
              id="gh-repo"
              type="text" 
              v-model="githubRepo"
              @input="saveGithubConfig"
              class="form-input text-input"
              placeholder="babycrashdev/precora_web"
            />
          </div>

          <div class="form-group">
            <label for="gh-branch">Branche cible</label>
            <input 
              id="gh-branch"
              type="text" 
              v-model="githubBranch"
              @input="saveGithubConfig"
              class="form-input text-input"
              placeholder="main"
            />
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
        <button type="button" @click="exportJsonBackup" class="btn-secondary" title="Télécharger le fichier content.json">
          📥 Télécharger JSON
        </button>
        <button type="submit" :disabled="isSubmitting" class="btn-save">
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>🚀 Publier les Modifications</span>
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

const { content, refresh } = useContent()

const isSubmitting = ref(false)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error' | 'warning'>('success')

// GitHub Sync Config
const showSyncSettings = ref(false)
const showToken = ref(false)
const githubToken = ref('')
const githubRepo = ref('babycrashdev/precora_web')
const githubBranch = ref('main')

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

const loadGithubConfig = () => {
  if (import.meta.client) {
    githubToken.value = localStorage.getItem('precora_gh_token') || ''
    githubRepo.value = localStorage.getItem('precora_gh_repo') || 'babycrashdev/precora_web'
    githubBranch.value = localStorage.getItem('precora_gh_branch') || 'main'
  }
}

const saveGithubConfig = () => {
  if (import.meta.client) {
    localStorage.setItem('precora_gh_token', githubToken.value.trim())
    localStorage.setItem('precora_gh_repo', githubRepo.value.trim())
    localStorage.setItem('precora_gh_branch', githubBranch.value.trim())
  }
}

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
  loadGithubConfig()
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

// UTF-8 to Base64 helper
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const exportJsonBackup = () => {
  if (!content.value) return
  const updatedContent = buildUpdatedContent()
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(updatedContent, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', dataStr)
  downloadAnchor.setAttribute('download', 'content.json')
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

const buildUpdatedContent = () => {
  const updated = JSON.parse(JSON.stringify(content.value || {}))

  // Update agreements
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

  // Update qualianor info badge
  if (updated.company?.accreditations) {
    const qualianor = updated.company.accreditations.find((a: any) => a.id === 'qualianor')
    if (qualianor) {
      qualianor.name = qualianorInfo.value
      qualianor.badge = qualianorInfo.value
    }
  }

  // Update alert
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
    const token = githubToken.value.trim()
    const repo = githubRepo.value.trim() || 'babycrashdev/precora_web'
    const branch = githubBranch.value.trim() || 'main'

    // Cas 1 : GitHub Token configuré (Publication via API GitHub)
    if (token) {
      const filePath = 'server/data/content.json'
      
      // Étape 1 : Récupérer le SHA du fichier existant
      const getFileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      })

      if (!getFileRes.ok) {
        if (getFileRes.status === 401 || getFileRes.status === 403) {
          throw new Error('Token GitHub invalide ou droits insuffisants (assurez-vous que le token a la permission "repo" ou "contents:write").')
        }
        throw new Error(`Impossible de récupérer le fichier sur GitHub (${getFileRes.status} ${getFileRes.statusText})`)
      }

      const fileData = await getFileRes.json()
      const currentSha = fileData.sha

      // Étape 2 : Committer la mise à jour sur GitHub
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
        throw new Error(errJson.message || `Erreur GitHub lors de l'enregistrement (${putRes.status})`)
      }

      // Succès GitHub
      if (content.value) {
        Object.assign(content.value, updatedContent)
      }

      feedbackType.value = 'success'
      feedbackMessage.value = '🚀 <strong>Modifications enregistrées et publiées sur GitHub !</strong><br>Le déploiement automatique est lancé sur votre serveur FTP. Votre site sera à jour dans 1 à 2 minutes.'
      return
    }

    // Cas 2 : Tentative API locale (si serveur de développement local actif)
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
      // Si l'API locale échoue et qu'il n'y a pas de token GitHub
      showSyncSettings.value = true
      feedbackType.value = 'warning'
      feedbackMessage.value = '⚠️ <strong>Token GitHub requis</strong> : Pour publier les changements sur votre site statique, veuillez renseigner votre token GitHub ci-dessus.'
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
  flex-wrap: wrap;
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

/* Sync badge & trigger */
.btn-toggle-sync {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #f8fafc;
  border: 1px solid var(--color-border, #cbd5e1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
}

.badge-status-synced {
  color: #059669;
}

.badge-status-missing {
  color: #d97706;
}

/* Sync Settings Card */
.sync-settings-card {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.sync-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.sync-settings-header h4 {
  font-size: 1.05rem;
  color: #166534;
  margin: 0;
}

.btn-close-sync {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #166534;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background: rgba(22, 101, 52, 0.1);
  }
}

.sync-explanation {
  font-size: 0.85rem;
  color: #15803d;
  margin-bottom: 1.25rem;
  line-height: 1.4;
}

.token-help-link {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-blue-accent, #0095eb);
  text-decoration: underline;
  margin-left: 0.5rem;
}

.input-with-toggle {
  position: relative;
  display: flex;
  align-items: center;
}

.btn-eye {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
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
  gap: 1rem;
  align-items: center;
}

.btn-secondary {
  background: #ffffff;
  color: var(--color-navy-primary, #1e2942);
  border: 1px solid var(--color-border, #cbd5e1);
  padding: 0.85rem 1.5rem;
  border-radius: var(--radius-btn, 8px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
}

.btn-save {
  background: var(--color-blue-accent, #0095eb);
  color: #ffffff;
  font-weight: 600;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-btn, 8px);
  border: none;
  cursor: pointer;
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
