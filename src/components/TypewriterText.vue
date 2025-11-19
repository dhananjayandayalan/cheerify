<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  text: string;
  speed?: number;
}>();

const emit = defineEmits<{
  (e: 'finished'): void
}>();

const displayedText = ref('');
const isTyping = ref(false);

const typeText = async () => {
  displayedText.value = '';
  isTyping.value = true;
  const chars = props.text.split('');
  
  for (let i = 0; i < chars.length; i++) {
    displayedText.value += chars[i];
    await new Promise(resolve => setTimeout(resolve, props.speed || 50));
  }
  
  isTyping.value = false;
  emit('finished');
};

watch(() => props.text, () => {
  typeText();
});

onMounted(() => {
  typeText();
});
</script>

<template>
  <div class="typewriter">
    {{ displayedText }}<span class="cursor" v-if="isTyping">|</span>
  </div>
</template>

<style scoped>
.typewriter {
  font-family: var(--font-mono);
  white-space: pre-wrap;
  line-height: 1.6;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
