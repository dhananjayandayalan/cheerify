<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { theme, setTheme } = useTheme();
</script>

<template>
  <div class="theme-switcher">
    <button 
      v-for="t in ['light', 'dark', 'system']" 
      :key="t"
      :class="{ active: theme === t }"
      @click="setTheme(t as 'light' | 'dark' | 'system')"
    >
      {{ t.charAt(0).toUpperCase() + t.slice(1) }}
    </button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  gap: 0.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 0.25rem;
  border-radius: 999px;
}

button {
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  opacity: 0.6;
  transition: all 0.2s ease;
}

button:hover {
  opacity: 1;
  background: var(--color-hover);
}

button.active {
  opacity: 1;
  background: var(--color-text);
  color: var(--color-bg);
}
</style>
