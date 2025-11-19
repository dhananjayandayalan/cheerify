<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits<{
  (e: 'accept'): void
}>();

const isVisible = ref(false);

onMounted(() => {
  // Check if user has already accepted the disclaimer
  const hasAccepted = localStorage.getItem('cheerify-disclaimer-accepted');
  if (!hasAccepted) {
    isVisible.value = true;
  } else {
    emit('accept');
  }
});

const handleAccept = () => {
  localStorage.setItem('cheerify-disclaimer-accepted', 'true');
  isVisible.value = false;
  emit('accept');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="disclaimer-overlay">
        <div class="disclaimer-content">
          <div class="disclaimer-header">
            <h2>Important Notice</h2>
          </div>

          <div class="disclaimer-body">
            <p class="disclaimer-intro">
              Welcome to Cheerify! Before you proceed, please take a moment to review the following information:
            </p>

            <div class="disclaimer-notice">
              <h3>Twitter Account Privacy</h3>
              <p>
                This service retrieves publicly available information from Twitter accounts to generate personalized messages.
                Please note that:
              </p>
              <ul>
                <li>
                  <strong>Private accounts</strong> may not be accessible through our service due to privacy restrictions
                  imposed by Twitter's API.
                </li>
                <li>
                  The service may return limited or no data for accounts with restricted privacy settings.
                </li>
                <li>
                  For private accounts, generic messages will be generated instead of personalized content.
                </li>
              </ul>
            </div>

            <div class="disclaimer-data">
              <h3>Data Usage</h3>
              <p>
                We respect your privacy. The information retrieved is used solely to generate personalized messages
                and is not stored, shared, or used for any other purpose.
              </p>
            </div>

            <p class="disclaimer-footer">
              By clicking "I Understand," you acknowledge that you have read and understood this notice.
            </p>
          </div>

          <div class="disclaimer-actions">
            <button @click="handleAccept" class="accept-btn">
              I Understand & Continue
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.disclaimer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.disclaimer-content {
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.disclaimer-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.disclaimer-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-text);
  text-align: center;
}

.disclaimer-body {
  padding: 2rem;
  color: var(--color-text);
  line-height: 1.6;
}

.disclaimer-intro {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  opacity: 0.9;
}

.disclaimer-notice,
.disclaimer-data {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--color-text);
  color: var(--color-bg);
  border-radius: 8px;
}

.disclaimer-notice h3,
.disclaimer-data h3 {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.disclaimer-notice p,
.disclaimer-data p {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.disclaimer-notice ul {
  margin: 0.75rem 0 0;
  padding-left: 1.5rem;
}

.disclaimer-notice li {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.disclaimer-notice li:last-child {
  margin-bottom: 0;
}

.disclaimer-footer {
  margin: 0;
  font-size: 0.95rem;
  text-align: center;
  font-style: italic;
  opacity: 0.8;
}

.disclaimer-actions {
  padding: 1.5rem 2rem 2rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: center;
}

.accept-btn {
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  width: 100%;
  max-width: 300px;
}

.accept-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.accept-btn:active {
  transform: translateY(0);
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

/* Scrollbar styling */
.disclaimer-content::-webkit-scrollbar {
  width: 8px;
}

.disclaimer-content::-webkit-scrollbar-track {
  background: transparent;
}

.disclaimer-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.disclaimer-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text);
}

@media (max-width: 600px) {
  .disclaimer-header h2 {
    font-size: 1.5rem;
  }

  .disclaimer-body {
    padding: 1.5rem;
  }

  .disclaimer-notice,
  .disclaimer-data {
    padding: 1rem;
  }

  .disclaimer-notice h3,
  .disclaimer-data h3 {
    font-size: 1.1rem;
  }

  .accept-btn {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
}
</style>
