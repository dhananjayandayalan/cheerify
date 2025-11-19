<script setup lang="ts">
import { ref } from 'vue';
import DisclaimerModal from './components/DisclaimerModal.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import CheerInput from './components/CheerInput.vue';
import CheerModal from './components/CheerModal.vue';
import ErrorModal from './components/ErrorModal.vue';
import LoadingAnimation from './components/LoadingAnimation.vue';
import { generateCheer } from './utils/cheerGenerator';

const isModalOpen = ref(false);
const isErrorModalOpen = ref(false);
const currentNote = ref('');
const currentUsername = ref('');
const errorMessage = ref('');
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
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    isErrorModalOpen.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleErrorClose = () => {
  isErrorModalOpen.value = false;
  errorMessage.value = '';
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

        <LoadingAnimation v-if="isLoading" />
        <CheerInput v-else @cheer="handleCheer" />
      </div>
    </main>

    <CheerModal
      :isOpen="isModalOpen"
      :note="currentNote"
      :username="currentUsername"
      @close="isModalOpen = false"
    />

    <ErrorModal
      :isOpen="isErrorModalOpen"
      :errorMessage="errorMessage"
      @close="handleErrorClose"
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


@media (max-width: 600px) {
  h1 {
    font-size: 2.5rem;
  }

  header {
    padding: 1rem;
  }
}
</style>
