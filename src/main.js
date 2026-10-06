import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

inject()
injectSpeedInsights()

const app = createApp(App)

// ponytail: one IntersectionObserver directive for all scroll reveals, no lib
const revealObserver = ('IntersectionObserver' in window)
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
  : null;

app.directive('reveal', {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !revealObserver) {
      el.classList.add('is-visible');
      return;
    }
    if (binding.value !== undefined) {
      el.style.setProperty('--reveal-delay', `${Number(binding.value) || 0}ms`);
    }
    el.classList.add('reveal');
    revealObserver.observe(el);
  },
  unmounted(el) {
    if (revealObserver) revealObserver.unobserve(el);
  },
});

app.use(router).mount('#app')


