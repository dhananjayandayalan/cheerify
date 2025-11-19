<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);
const progressText = ref('Initializing...');
let interval: number | null = null;

onMounted(() => {
  // Simulate progress stages
  const stages = [
    { until: 30, duration: 2000, text: 'Scraping Twitter profile...' },
    { until: 60, duration: 3000, text: 'Analyzing personality traits...' },
    { until: 90, duration: 4000, text: 'Generating unique note with AI...' },
    { until: 95, duration: 1000, text: 'Almost there...' }
  ];

  let currentStage = 0;
  const startTime = Date.now();

  interval = window.setInterval(() => {
    if (currentStage >= stages.length) {
      progress.value = Math.min(98, progress.value + 0.5);
      return;
    }

    const stage = stages[currentStage];
    if (!stage) return;

    const stageElapsed = Date.now() - startTime - stages.slice(0, currentStage).reduce((sum, s) => sum + s.duration, 0);
    const stageProgress = Math.min(1, stageElapsed / stage.duration);
    const prevStage = stages[currentStage - 1];
    const prevProgress = prevStage ? prevStage.until : 0;
    progress.value = prevProgress + (stage.until - prevProgress) * stageProgress;
    progressText.value = stage.text;

    if (stageProgress >= 1) {
      currentStage++;
    }
  }, 50);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<template>
  <div class="loading-container">
    <div class="animation-wrapper">
      <!-- Center person (lonely) -->
      <div class="person center-person">
        <div class="person-icon">👤</div>
      </div>

      <!-- Surrounding people that fade in -->
      <div class="person person-1">
        <div class="person-icon">👥</div>
      </div>
      <div class="person person-2">
        <div class="person-icon">👥</div>
      </div>
      <div class="person person-3">
        <div class="person-icon">👥</div>
      </div>
      <div class="person person-4">
        <div class="person-icon">👥</div>
      </div>

      <!-- Connection lines -->
      <svg class="connections" viewBox="0 0 200 200">
        <line class="line line-1" x1="100" y1="100" x2="50" y2="50" />
        <line class="line line-2" x1="100" y1="100" x2="150" y2="50" />
        <line class="line line-3" x1="100" y1="100" x2="50" y2="150" />
        <line class="line line-4" x1="100" y1="100" x2="150" y2="150" />
      </svg>

      <!-- Hearts appearing -->
      <div class="heart heart-1">♥</div>
      <div class="heart heart-2">♥</div>
      <div class="heart heart-3">♥</div>
    </div>

    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="progress-info">
        <p class="progress-text">{{ progressText }}</p>
        <p class="progress-percentage">{{ Math.round(progress) }}%</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: 300px;
  padding: 2rem;
}

.animation-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.person {
  position: absolute;
  font-size: 2rem;
  opacity: 0;
}

.center-person {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  animation: pulse 2s ease-in-out infinite;
  z-index: 10;
}

.person-1 {
  top: 10%;
  left: 10%;
  animation: fadeInPerson 0.5s ease-out 0.5s forwards;
}

.person-2 {
  top: 10%;
  right: 10%;
  animation: fadeInPerson 0.5s ease-out 1s forwards;
}

.person-3 {
  bottom: 10%;
  left: 10%;
  animation: fadeInPerson 0.5s ease-out 1.5s forwards;
}

.person-4 {
  bottom: 10%;
  right: 10%;
  animation: fadeInPerson 0.5s ease-out 2s forwards;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.line {
  stroke: var(--color-text);
  stroke-width: 2;
  opacity: 0.3;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}

.line-1 {
  animation: drawLine 0.8s ease-out 0.7s forwards;
}

.line-2 {
  animation: drawLine 0.8s ease-out 1.2s forwards;
}

.line-3 {
  animation: drawLine 0.8s ease-out 1.7s forwards;
}

.line-4 {
  animation: drawLine 0.8s ease-out 2.2s forwards;
}

.heart {
  position: absolute;
  font-size: 1.2rem;
  color: #ff6b6b;
  opacity: 0;
}

.heart-1 {
  top: 30%;
  left: 50%;
  animation: floatHeart 2s ease-in-out 2.5s infinite;
}

.heart-2 {
  top: 50%;
  left: 20%;
  animation: floatHeart 2s ease-in-out 3s infinite;
}

.heart-3 {
  top: 50%;
  right: 20%;
  animation: floatHeart 2s ease-in-out 3.5s infinite;
}

.progress-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-text), #6366f1);
  border-radius: 999px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.progress-text {
  font-size: 1rem;
  opacity: 0.8;
  text-align: left;
  flex: 1;
  margin: 0;
}

.progress-percentage {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.9;
  margin: 0;
  min-width: 50px;
  text-align: right;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes fadeInPerson {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
    opacity: 0.5;
  }
}

@keyframes floatHeart {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }
}

@keyframes fadeText {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .animation-wrapper {
    width: 150px;
    height: 150px;
  }

  .person {
    font-size: 1.5rem;
  }

  .heart {
    font-size: 1rem;
  }

}
</style>
