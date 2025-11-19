<script setup lang="ts">
import { watch } from 'vue';
import { soundEffects } from '../utils/soundEffects';

const props = defineProps<{
  isOpen: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

// Play error sound when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    soundEffects.playError();
  }
});

const handleClose = () => {
  soundEffects.playModalClose();
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="error-modal">
          <div class="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p class="error-message">{{ errorMessage }}</p>
          <button @click="handleClose" class="close-button">
            Try Again
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-overlay);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.error-modal {
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: shake 0.5s;
}

h2 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  color: var(--color-text);
}

.error-message {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  color: var(--color-text);
  opacity: 0.8;
}

.close-button {
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.close-button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.close-button:active {
  transform: translateY(0);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style>
