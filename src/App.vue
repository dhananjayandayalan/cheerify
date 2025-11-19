<script setup lang="ts">
import { ref } from 'vue';
import DisclaimerModal from './components/DisclaimerModal.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import CheerInput from './components/CheerInput.vue';
import CheerModal from './components/CheerModal.vue';
import { generateCheer } from './utils/cheerGenerator';

const isModalOpen = ref(false);
const currentNote = ref('');
const currentUsername = ref('');
const isLoading = ref(false);
const disclaimerAccepted = ref(false);

const handleDisclaimerAccept = () => {
  disclaimerAccepted.value = true;
};

const handleCheer = async (username: string) => {
  isLoading.value = true;
  currentUsername.value = username;
  try {
    currentNote.value = await generateCheer(username);
    isModalOpen.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <DisclaimerModal @accept="handleDisclaimerAccept" />

  <div v-if="disclaimerAccepted">
    <header>
      <div class="logo">Cheerify</div>
      <ThemeSwitcher />
    </header>

    <main>
      <div class="hero">
        <h1>Spread Some Joy</h1>
        <p class="subtitle">Enter your twitter handle.</p>

        <div v-if="isLoading" class="loading">
          <p>Analyzing your Twitter personality... ✨</p>
        </div>
        <CheerInput v-else @cheer="handleCheer" />
      </div>
    </main>

    <CheerModal
      :isOpen="isModalOpen"
      :note="currentNote"
      :username="currentUsername"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: var(--color-bg);
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  letter-spacing: -1px;
}

main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 3rem;
  margin: 0;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.7;
  margin: 0;
  max-width: 400px;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.8;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 2.5rem;
  }

  header {
    padding: 1rem;
  }
}
</style>
