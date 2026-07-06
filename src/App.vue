<template>
  <div class="app-shell" :data-theme="theme">
    <header class="site-header">
      <nav class="site-nav" aria-label="Primary navigation">
        <router-link class="brand" to="/">{{ profile.handle }}</router-link>
        <div class="nav-links">
          <a v-for="section in sections" :key="section.href" :href="section.href">
            {{ section.label }}
          </a>
        </div>
        <div class="nav-actions">
          <button
            class="theme-toggle"
            type="button"
            :aria-label="themeButtonLabel"
            :title="themeButtonLabel"
            @click="toggleTheme"
          >
            <span aria-hidden="true">{{ themeIcon }}</span>
          </button>
          <a class="github-link" :href="profile.githubUrl" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>
    </header>

    <router-view />

    <footer class="mobile-nav" aria-label="Mobile navigation">
      <a v-for="section in mobileSections" :key="section.href" :href="section.href">
        {{ section.label }}
      </a>
    </footer>

    <div
      v-if="themeReveal"
      class="theme-reveal"
      :class="{ 'theme-reveal--active': themeReveal.active }"
      :style="themeRevealStyle"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script>
import { profile } from '@/data/portfolio';
import { sections } from '@/data/navigation';

export default {
  name: 'App',
  data() {
    return {
      profile,
      sections,
      theme: 'dark',
      themeReveal: null,
      revealTimeout: null,
    };
  },
  computed: {
    mobileSections() {
      return this.sections.filter((section) =>
        ['Intro', 'Projects', 'Experience', 'Contact'].includes(section.label)
      );
    },
    themeButtonLabel() {
      return this.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    },
    themeIcon() {
      return this.theme === 'dark' ? '☀' : '☾';
    },
    themeRevealStyle() {
      if (!this.themeReveal) {
        return {};
      }

      return {
        '--reveal-x': `${this.themeReveal.x}px`,
        '--reveal-y': `${this.themeReveal.y}px`,
        '--reveal-color': this.themeReveal.color,
      };
    },
  },
  created() {
    this.theme = this.getInitialTheme();
    this.applyTheme(this.theme);
  },
  beforeUnmount() {
    window.clearTimeout(this.revealTimeout);
  },
  methods: {
    getInitialTheme() {
      const savedTheme = window.localStorage.getItem('portfolio-theme');

      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }

      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    },
    applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
    },
    toggleTheme(event) {
      const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.localStorage.setItem('portfolio-theme', nextTheme);

      if (prefersReducedMotion) {
        this.theme = nextTheme;
        this.applyTheme(nextTheme);
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const color = nextTheme === 'dark' ? '#09090b' : '#f7f3ea';

      window.clearTimeout(this.revealTimeout);
      this.themeReveal = {
        x,
        y,
        color,
        active: false,
      };

      window.requestAnimationFrame(() => {
        this.themeReveal = {
          ...this.themeReveal,
          active: true,
        };
        this.theme = nextTheme;
        this.applyTheme(nextTheme);
      });

      this.revealTimeout = window.setTimeout(() => {
        this.themeReveal = null;
      }, 720);
    },
  },
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --page-bg: #09090b;
  --page-bg-soft: #111113;
  --panel-bg: rgba(9, 9, 11, 0.66);
  --panel-bg-strong: rgba(24, 24, 27, 0.82);
  --text-primary: #f4f4f5;
  --text-secondary: #d4d4d8;
  --text-muted: #a1a1aa;
  --text-faint: #71717a;
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-faint: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(248, 113, 113, 0.48);
  --accent: #f87171;
  --accent-soft: #fca5a5;
  --button-bg: #fafafa;
  --button-text: #09090b;
  --grid-dot: rgba(248, 113, 113, 0.15);
  --nav-bg: rgba(9, 9, 11, 0.76);
  --mobile-nav-bg: rgba(9, 9, 11, 0.86);
  --scroll-track: #18181b;
  --scroll-thumb: #52525b;
}

:root[data-theme="light"] {
  --page-bg: #f7f3ea;
  --page-bg-soft: #fffaf0;
  --panel-bg: rgba(255, 250, 240, 0.78);
  --panel-bg-strong: rgba(255, 255, 255, 0.88);
  --text-primary: #1c1917;
  --text-secondary: #44403c;
  --text-muted: #78716c;
  --text-faint: #a8a29e;
  --border-subtle: rgba(28, 25, 23, 0.13);
  --border-faint: rgba(28, 25, 23, 0.08);
  --border-hover: rgba(185, 28, 28, 0.36);
  --accent: #b91c1c;
  --accent-soft: #dc2626;
  --button-bg: #1c1917;
  --button-text: #fffaf0;
  --grid-dot: rgba(68, 64, 60, 0.16);
  --nav-bg: rgba(247, 243, 234, 0.78);
  --mobile-nav-bg: rgba(247, 243, 234, 0.9);
  --scroll-track: #e7e0d2;
  --scroll-thumb: #a8a29e;
}

html {
  background: var(--page-bg);
  scroll-behavior: smooth;
}

body {
  background: var(--page-bg);
  color: var(--text-primary);
  font-family: "Poppins", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a,
button {
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background-color 160ms ease,
    transform 160ms ease;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--scroll-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scroll-thumb);
  border-radius: 999px;
}

.app-shell {
  --page-bg: #09090b;
  --page-bg-soft: #111113;
  --panel-bg: rgba(9, 9, 11, 0.66);
  --panel-bg-strong: rgba(24, 24, 27, 0.82);
  --text-primary: #f4f4f5;
  --text-secondary: #d4d4d8;
  --text-muted: #a1a1aa;
  --text-faint: #71717a;
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-faint: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(248, 113, 113, 0.48);
  --accent: #f87171;
  --accent-soft: #fca5a5;
  --button-bg: #fafafa;
  --button-text: #09090b;
  --grid-dot: rgba(248, 113, 113, 0.15);
  --nav-bg: rgba(9, 9, 11, 0.76);
  --mobile-nav-bg: rgba(9, 9, 11, 0.86);
  --scroll-track: #18181b;
  --scroll-thumb: #52525b;
  background:
    radial-gradient(circle at top, rgba(127, 29, 29, 0.14), rgba(9, 9, 11, 0) 22rem),
    var(--page-bg);
  min-height: 100vh;
  position: relative;
  transition: background-color 220ms ease, color 220ms ease;
}

.app-shell[data-theme="light"] {
  --page-bg: #f7f3ea;
  --page-bg-soft: #fffaf0;
  --panel-bg: rgba(255, 250, 240, 0.78);
  --panel-bg-strong: rgba(255, 255, 255, 0.88);
  --text-primary: #1c1917;
  --text-secondary: #44403c;
  --text-muted: #78716c;
  --text-faint: #a8a29e;
  --border-subtle: rgba(28, 25, 23, 0.13);
  --border-faint: rgba(28, 25, 23, 0.08);
  --border-hover: rgba(185, 28, 28, 0.36);
  --accent: #b91c1c;
  --accent-soft: #dc2626;
  --button-bg: #1c1917;
  --button-text: #fffaf0;
  --grid-dot: rgba(68, 64, 60, 0.16);
  --nav-bg: rgba(247, 243, 234, 0.78);
  --mobile-nav-bg: rgba(247, 243, 234, 0.9);
  --scroll-track: #e7e0d2;
  --scroll-thumb: #a8a29e;
}

.app-shell::before {
  background-image: radial-gradient(circle, var(--grid-dot) 1px, transparent 1px);
  background-position: 0 0;
  background-size: 22px 22px;
  content: "";
  inset: 0;
  opacity: 0.95;
  pointer-events: none;
  position: fixed;
  z-index: 0;
}

.app-shell > * {
  position: relative;
  z-index: 2;
}

.site-header {
  backdrop-filter: blur(18px);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border-subtle);
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 50;
}

.site-nav {
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: auto 1fr auto;
  margin: 0 auto;
  min-height: 4.25rem;
  padding: 0 1.25rem;
  width: min(100%, 1040px);
}

.brand,
.github-link,
.nav-links a,
.mobile-nav a {
  color: var(--text-secondary);
  font-size: 0.86rem;
  text-decoration: none;
}

.brand {
  color: var(--text-primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-actions {
  align-items: center;
  display: flex;
  gap: 0.65rem;
  justify-self: end;
}

.theme-toggle {
  align-items: center;
  background: var(--panel-bg-strong);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 1rem;
  height: 2.15rem;
  justify-content: center;
  line-height: 1;
  width: 2.15rem;
}

.theme-toggle:hover {
  border-color: var(--border-hover);
  color: var(--accent-soft);
  transform: translateY(-1px);
}

.brand:hover,
.github-link:hover,
.nav-links a:hover,
.mobile-nav a:hover {
  color: var(--accent-soft);
}

.mobile-nav {
  backdrop-filter: blur(18px);
  background: var(--mobile-nav-bg);
  border-top: 1px solid var(--border-subtle);
  bottom: 0;
  display: none;
  gap: 0.25rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  left: 0;
  padding: 0.7rem;
  position: fixed;
  right: 0;
  z-index: 50;
}

.mobile-nav a {
  border-radius: 999px;
  display: inline-flex;
  justify-content: center;
  padding: 0.45rem 0.25rem;
}

.theme-reveal {
  background: var(--reveal-color);
  border-radius: 50%;
  height: 12px;
  left: var(--reveal-x);
  pointer-events: none;
  position: fixed;
  top: var(--reveal-y);
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  width: 12px;
  z-index: 1;
}

.theme-reveal--active {
  animation: themeReveal 520ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes themeReveal {
  to {
    transform: translate(-50%, -50%) scale(260);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 760px) {
  .site-nav {
    grid-template-columns: 1fr auto;
  }

  .nav-links {
    display: none;
  }

  .mobile-nav {
    display: grid;
  }
}
</style>
