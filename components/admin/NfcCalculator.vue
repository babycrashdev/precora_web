<template>
  <div class="calculator-container">
    <div class="calculator-header">
      <h2>🧮 Calculateur de Blindage NFC 15-160</h2>
      <p class="subtitle">
        Calcul instantané du facteur de transmission $f_g$, de l'épaisseur de plomb équivalente et des équivalences matériaux.
      </p>
    </div>

    <!-- Presets Section -->
    <div class="presets-section">
      <span class="presets-title">⚡ Préréglages usuels rapides :</span>
      <div class="preset-buttons">
        <button
          v-for="preset in PRESETS"
          :key="preset.id"
          type="button"
          :class="['preset-btn', { active: activePresetId === preset.id }]"
          @click="applyPreset(preset)"
          :title="preset.description"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <div class="calculator-grid">
      <!-- Inputs Form -->
      <div class="inputs-card">
        <h3 class="card-title">📝 Paramètres d'Installation</h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="input-cg">
              Débit équivalent de dose (\(c_g\))
              <span class="tooltip-icon" title="Débit équivalent de dose mesuré à 1 mètre en mSv.m²/h">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-cg" type="number" step="0.01" min="0" v-model.number="params.cg" class="form-input" />
              <span class="unit">mSv·m²/h</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-w">
              Charge de travail (\(W\))
              <span class="tooltip-icon" title="Charge de travail hebdomadaire en mA.min/semaine">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-w" type="number" step="1" min="0" v-model.number="params.w" class="form-input" />
              <span class="unit">mA·min/sem</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-f">
              Facteur de tension (\(f\))
              <span class="tooltip-icon" title="Facteur d'atténuation/tension maximale (généralement 1.0)">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-f" type="number" step="0.01" min="0" v-model.number="params.f" class="form-input" />
              <span class="unit">ratio</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-t">
              Facteur d'occupation (\(T\))
              <span class="tooltip-icon" title="Facteur d'occupation du local attenant (0.1 à 1.0)">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-t" type="number" step="0.05" min="0" max="1" v-model.number="params.t" class="form-input" />
              <span class="unit">ratio</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-hmax">
              Débit max réglementaire (\(H_{max}\))
              <span class="tooltip-icon" title="Limite de dose équivalente max par semaine (ex: 0.02 mSv/sem)">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-hmax" type="number" step="0.001" min="0.0001" v-model.number="params.hmax" class="form-input" />
              <span class="unit">mSv/sem</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-c">
              Distance au foyer (\(c\))
              <span class="tooltip-icon" title="Distance du foyer du tube X à la paroi à protéger en mètres">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-c" type="number" step="0.1" min="0.1" v-model.number="params.c" class="form-input" />
              <span class="unit">m</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-q">
              Intensité x temps max (\(q\))
              <span class="tooltip-icon" title="Produit max intensité par le temps sur 1 heure en mA.min/h">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-q" type="number" step="0.1" min="0.1" v-model.number="params.q" class="form-input" />
              <span class="unit">mA·min/h</span>
            </div>
          </div>

          <div class="form-group">
            <label for="input-kv">
              Tension du tube (\(kV\))
              <span class="tooltip-icon" title="Haute tension du tube à rayons X en kilovolts (50 à 300 kV)">ⓘ</span>
            </label>
            <div class="input-with-unit">
              <input id="input-kv" type="number" step="1" min="50" max="300" v-model.number="params.kv" class="form-input" />
              <span class="unit">kV</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="results-card">
        <h3 class="card-title">📊 Résultats du Calcul</h3>

        <div v-if="calcError" class="error-banner">
          ⚠️ {{ calcError }}
        </div>

        <div v-else-if="result" class="results-grid">
          <!-- Primary Lead Result -->
          <div class="result-box primary-result">
            <span class="result-label">🟢 Épaisseur de Plomb Nécessaire</span>
            <div class="result-value-big">
              {{ result.leadMm.toFixed(2) }} <span class="unit-text">mm Pb</span>
            </div>
            <span class="result-subtitle" v-if="result.fg >= 1">
              Atténuation naturelle suffisante (\(f_g \ge 1\))
            </span>
            <span class="result-subtitle" v-else>
              Basé sur un CDD de {{ interpolatedCdd.toFixed(2) }} mm à {{ params.kv }} kV
            </span>
          </div>

          <!-- fg Factor Scientic -->
          <div class="result-box">
            <span class="result-label">🔷 Facteur d'Atténuation \(f_g\)</span>
            <div class="result-value">
              {{ formatScientific(result.fg) }}
            </div>
            <span class="result-subtitle">Facteur sans dimension</span>
          </div>

          <!-- Concrete Equivalence -->
          <div class="result-box">
            <span class="result-label">🧱 Équivalence Béton</span>
            <div class="result-value">
              {{ result.concreteMm.toFixed(1) }} <span class="unit-text">mm</span>
            </div>
            <span class="result-subtitle">Béton de densité standard 2.3</span>
          </div>

          <!-- Plaster Equivalence -->
          <div class="result-box" :class="{ alert: !result.plasterApplicable }">
            <span class="result-label">🏗️ Équivalence Plâtre</span>
            <div class="result-value">
              <template v-if="result.plasterApplicable">
                {{ result.plasterMm.toFixed(1) }} <span class="unit-text">mm</span>
              </template>
              <template v-else>
                <span class="badge-danger">Non applicable</span>
              </template>
            </div>
            <span v-if="!result.plasterApplicable" class="result-subtitle text-danger">
              ⚠️ Épaisseur > 300 mm (Plâtre déconseillé)
            </span>
            <span v-else class="result-subtitle">
              Plâtre de construction standard
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PRESETS,
  calculateShielding,
  getInterpolatedCdd,
  type NfcPreset,
  type ShieldingResult
} from '../../composables/useNfc15160'

const activePresetId = ref<string>('dentaire')

const params = ref({
  cg: 1.0,
  w: 20.0,
  f: 1.0,
  t: 1.0,
  hmax: 0.02,
  c: 1.5,
  q: 0.5,
  kv: 70
})

const applyPreset = (preset: NfcPreset) => {
  activePresetId.value = preset.id
  params.value = {
    cg: preset.cg,
    w: preset.w,
    f: preset.f,
    t: preset.t,
    hmax: preset.hmax,
    c: preset.c,
    q: preset.q,
    kv: preset.kv
  }
}

const calcError = ref<string | null>(null)

const result = computed<ShieldingResult | null>(() => {
  calcError.value = null
  try {
    return calculateShielding(params.value)
  } catch (err: any) {
    calcError.value = err.message || 'Erreur lors du calcul.'
    return null
  }
})

const interpolatedCdd = computed(() => {
  return getInterpolatedCdd(params.value.kv)
})

const formatScientific = (num: number): string => {
  if (num === 0) return '0.00'
  return num.toExponential(2)
}
</script>

<style scoped>
.calculator-container {
  background: var(--color-surface-card, #ffffff);
  border-radius: var(--radius-card, 16px);
  padding: 2.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border, #e2e8f0);
}

.calculator-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.calculator-header h2 {
  font-size: 1.5rem;
  color: var(--color-navy-primary, #1e2942);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-muted, #64748b);
  font-size: 0.95rem;
}

/* Presets */
.presets-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f8fafc;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  flex-wrap: wrap;
}

.presets-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-navy-primary, #1e2942);
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: #ffffff;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-btn, 8px);
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-main, #1e293b);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  border-color: var(--color-blue-accent, #0095eb);
  color: var(--color-blue-accent, #0095eb);
}

.preset-btn.active {
  background: var(--color-navy-primary, #1e2942);
  color: #ffffff;
  border-color: var(--color-navy-primary, #1e2942);
}

/* Layout Grid */
.calculator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .calculator-grid {
    grid-template-columns: 1fr;
  }
}

.inputs-card, .results-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid #f1f5f9;
}

.card-title {
  font-size: 1.15rem;
  color: var(--color-navy-dark, #0f172a);
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-navy-primary, #1e2942);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.tooltip-icon {
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
  cursor: help;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  padding-right: 4.5rem;
  border-radius: var(--radius-btn, 8px);
  border: 1px solid var(--color-border, #e2e8f0);
  background: #ffffff;
  color: var(--color-text-main, #1e293b);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue-accent, #0095eb);
  box-shadow: 0 0 0 3px rgba(0, 149, 235, 0.15);
}

.unit {
  position: absolute;
  right: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted, #64748b);
  pointer-events: none;
}

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.result-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--color-border, #e2e8f0);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.primary-result {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #1e2942 0%, #0f172a 100%);
  color: #ffffff;
  border: 1px solid rgba(0, 149, 235, 0.3);
}

.primary-result .result-label {
  color: var(--color-blue-light, #e6f4fe);
}

.primary-result .result-subtitle {
  color: #94a3b8;
}

.result-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-navy-primary, #1e2942);
}

.result-value-big {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-blue-accent, #0095eb);
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-navy-dark, #0f172a);
}

.unit-text {
  font-size: 1rem;
  font-weight: 500;
  color: #cbd5e1;
}

.result-box:not(.primary-result) .unit-text {
  color: var(--color-text-muted, #64748b);
}

.result-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
}

.badge-danger {
  display: inline-block;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.text-danger {
  color: #ef4444;
}

.error-banner {
  background: #fef2f2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  font-weight: 500;
}
</style>
