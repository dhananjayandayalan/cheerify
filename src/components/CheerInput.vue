<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const emit = defineEmits<{
  (e: 'cheer', username: string): void
}>();

const handleSubmit = () => {
  if (username.value.trim()) {
    emit('cheer', username.value.trim());
  }
};
</script>

<template>
  <div class="cheer-input">
    <div class="input-group">
      <span class="prefix">@</span>
      <input 
        v-model="username" 
        type="text" 
        placeholder="twitter_handle" 
        @keyup.enter="handleSubmit"
      />
    </div>
    <button @click="handleSubmit" :disabled="!username.trim()">
      Click to know more!
    </button>
  </div>
</template>

<style scoped>
.cheer-input {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--color-border);
  padding: 0.5rem;
  width: 100%;
  transition: border-color 0.3s ease;
}

.input-group:focus-within {
  border-color: var(--color-text);
}

.prefix {
  font-size: 1.5rem;
  color: var(--color-text);
  opacity: 0.5;
  margin-right: 0.5rem;
}

input {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text);
  width: 100%;
  outline: none;
}

input::placeholder {
  color: var(--color-text);
  opacity: 0.3;
}

button {
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 4px;
  width: 100%;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  opacity: 0.9;
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
