<template>
  <div class="landing-layout">
    <AppHeader />
    <main>
      <HeroSection />
      <BentoServices />
      <ExpertSection />
      <ConformiteSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import HeroSection from '~/components/home/HeroSection.vue'
import BentoServices from '~/components/home/BentoServices.vue'
import ExpertSection from '~/components/home/ExpertSection.vue'
import ConformiteSection from '~/components/home/ConformiteSection.vue'
import ContactSection from '~/components/home/ContactSection.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

useHead({
  title: 'PRECORA - Organisme Compétent en Radioprotection | Olivier Lacaton',
  meta: [
    {
      name: 'description',
      content: 'PRECORA - Expertise, désignation de CRP, mesure du radon et conformité en radioprotection dentaire, médicale, vétérinaire et industrielle dans le Lot (46), Corrèze (19) et Sud-Ouest.'
    }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

.landing-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
