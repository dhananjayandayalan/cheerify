<script setup lang="ts">
import { ref } from 'vue';
import TypewriterText from './TypewriterText.vue';
import { generatePDF } from '../utils/pdfGenerator';

const props = defineProps<{
  isOpen: boolean;
  note: string;
  username: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const isTypingFinished = ref(false);

const handleTypingFinished = () => {
  isTypingFinished.value = true;
};

const handleDownload = () => {
  generatePDF(props.note, props.username);
};

const close = () => {
  emit('close');
  isTypingFinished.value = false; // Reset for next time
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <button class="close-btn" @click="close">&times;</button>
          
          <div class="note-container">
            <TypewriterText 
              :text="note" 
              @finished="handleTypingFinished" 
            />
          </div>

          <div class="signature" v-if="isTypingFinished">
            <p>With Love ♥️</p>
            <p>Dhanan :)</p>
          </div>

          <div class="actions" v-if="isTypingFinished">
            <button @click="handleDownload" class="download-btn">
              Download PDF
            </button>
          </div>
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

.modal-content {
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--color-text);
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-container {
  font-size: 1.2rem;
  min-height: 100px;
}

.signature {
  margin-top: 1rem;
  font-family: var(--font-mono);
  opacity: 0;
  animation: fadeIn 1s forwards;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  animation: fadeIn 1s forwards 0.5s;
}

.download-btn {
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
