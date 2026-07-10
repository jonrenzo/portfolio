<template>
  <main class="portfolio-home" id="intro">
    <section class="intro-grid section-block">
      <div class="intro-copy">
        <p class="eyebrow">{{ profile.handle }} / {{ profile.location }}</p>
        <h1>{{ profile.name }}</h1>
        <p class="role">{{ profile.role }}</p>
        <p class="summary">{{ profile.summary }}</p>

        <div class="focus-list" aria-label="Current focus areas">
          <span v-for="item in profile.focus" :key="item">{{ item }}</span>
        </div>

        <div class="action-row" aria-label="Primary links">
          <a
            v-for="link in profile.links"
            :key="link.label"
            class="text-link"
            :href="link.href"
            :target="isExternal(link.href) ? '_blank' : undefined"
            :rel="isExternal(link.href) ? 'noreferrer' : undefined"
          >
            {{ link.label }}
          </a>
          <a class="text-link" href="#contact">Contact</a>
        </div>
      </div>

      <aside class="profile-panel" aria-label="Profile summary">
        <div class="avatar-frame">
          <Transition name="avatar-theme" mode="out-in">
            <img
              :key="activeAvatar"
              class="avatar"
              :src="activeAvatar"
              :alt="`Portrait of ${profile.name}, ${profile.role}`"
            />
          </Transition>
        </div>
        <div>
          <p class="panel-label">Available for</p>
          <p class="panel-value">Full Stack, junior developer roles, and project collaborations.</p>
        </div>
      </aside>
    </section>

    <section class="metrics-grid" aria-label="Portfolio proof metrics">
      <div v-for="metric in metrics" :key="metric.label" class="metric-item">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </div>
    </section>

    <section class="section-block" id="projects">
      <SectionHeading number="01" title="Featured Projects" />
      <div class="featured-grid">
        <article v-for="(project, index) in featuredProjects" :key="project.id" class="project-card">
          <div class="project-media">
            <img
              :src="projectImage(project)"
              :alt="`${project.name} project preview`"
              loading="lazy"
              @error="setFallbackImage"
            />
          </div>
          <div class="project-body">
            <div class="project-title-row">
              <h2>{{ project.name }}</h2>
              <span>#{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <p>{{ project.description }}</p>
            <ul class="tech-list" :aria-label="`${project.name} technologies`">
              <li v-for="tech in project.tech" :key="tech">{{ tech }}</li>
            </ul>
            <div class="project-links">
              <a v-if="project.github" :href="project.github" target="_blank" rel="noreferrer">Source</a>
              <a v-if="project.demo" :href="project.demo" target="_blank" rel="noreferrer">Live</a>
            </div>
          </div>
        </article>
      </div>

      <details class="archive-list">
        <summary>More project work</summary>
        <ul>
          <li v-for="project in archivedProjects" :key="project.id">
            <span>{{ project.name }}</span>
            <small>{{ project.tech.join(', ') }}</small>
          </li>
        </ul>
      </details>
    </section>

    <section class="section-block" id="stack">
      <SectionHeading number="02" title="Stack" />
      <div class="stack-layout">
        <div>
          <h2>Technologies</h2>
          <ul class="pill-grid">
            <li v-for="item in stack" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          <h2>Tools</h2>
          <ul class="pill-grid">
            <li v-for="item in tools" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section-block" id="experience">
      <SectionHeading number="03" title="Experience" />
      <div class="experience-list">
        <details
          v-for="(experience, index) in experiences"
          :key="`${experience.company}-${experience.role}`"
          class="experience-card"
          :open="index === 0"
        >
          <summary class="experience-summary">
            <span class="experience-period">{{ experience.period }}</span>
            <span class="experience-title">
              <strong>{{ experience.role }}</strong>
              <small>{{ experience.company }}</small>
            </span>
            <span class="experience-location">{{ experience.location }}</span>
            <span class="experience-toggle" aria-hidden="true"></span>
          </summary>
          <div class="experience-content">
            <ul>
              <li v-for="bullet in experience.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </div>
        </details>
      </div>
    </section>

    <section class="section-block" id="education">
      <SectionHeading number="04" title="Education & Focus" />
      <div class="timeline-item">
        <p class="eyebrow">{{ education.organization }}</p>
        <h2>{{ education.title }}</h2>
        <p>{{ education.description }}</p>
      </div>
    </section>

    <section class="section-block" id="github">
      <SectionHeading number="05" title="GitHub" />
      <div class="github-panel">
        <div class="github-panel-header">
          <div>
            <p class="eyebrow">Public activity</p>
            <h2>@{{ profile.githubUsername }}</h2>
          </div>
          <a class="text-link" :href="profile.githubUrl" target="_blank" rel="noreferrer">
            View profile
          </a>
        </div>

        <div v-if="!githubGraphFailed" class="github-graph-wrap">
          <img
            class="github-graph"
            :src="profile.githubGraphUrl"
            :alt="`${profile.githubUsername} GitHub contribution graph`"
            loading="lazy"
            @error="githubGraphFailed = true"
          />
        </div>
        <div v-else class="github-fallback">
          <p>Contribution graph unavailable right now.</p>
          <a class="text-link" :href="profile.githubUrl" target="_blank" rel="noreferrer">
            Open GitHub profile
          </a>
        </div>
      </div>
    </section>

    <section class="section-block contact-section" id="contact">
      <SectionHeading number="06" title="Contact" />
      <div class="contact-grid">
        <div>
          <h2>Let’s build something useful.</h2>
          <p>
            I’m open to recruiter conversations, internships, junior developer roles,
            and focused project collaborations.
          </p>
        </div>
        <div class="contact-actions">
          <a class="button-link" :href="profile.githubUrl" target="_blank" rel="noreferrer">
            View GitHub
          </a>
          <button class="button-link secondary" type="button" @click="copyGithubUrl">
            {{ copyLabel }}
          </button>
          <a class="button-link secondary" :href="profile.resumeUrl">Resume</a>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { defineComponent, h } from 'vue';
import { education, experiences, metrics, profile, projects, stack, tools } from '@/data/portfolio';

const SectionHeading = defineComponent({
  name: 'SectionHeading',
  props: {
    number: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  render() {
    return h('header', { class: 'section-heading' }, [
      h('span', this.number),
      h('h2', this.title),
    ]);
  },
});

export default {
  name: 'HomeView',
  components: {
    SectionHeading,
  },
  data() {
    return {
      profile,
      projects,
      stack,
      tools,
      education,
      experiences,
      metrics,
      copyLabel: 'Copy GitHub',
      githubGraphFailed: false,
      activeTheme: document.documentElement.dataset.theme || 'dark',
    };
  },
  mounted() {
    this.themeObserver = new MutationObserver(() => {
      this.activeTheme = document.documentElement.dataset.theme || 'dark';
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  },
  beforeUnmount() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  },
  computed: {
    activeAvatar() {
      if (typeof this.profile.avatar === 'string') {
        return this.profile.avatar;
      }

      return this.profile.avatar[this.activeTheme] || this.profile.avatar.light;
    },
    featuredProjects() {
      const featuredOrder = [
        'TelcoVantage ERP System',
        'Telcovantage Site Map Reader',
        'MediSync System',
        'QuestCommute',
      ];

      return featuredOrder
        .map((projectName) => this.projects.find((project) => project.name === projectName))
        .filter(Boolean);
    },
    archivedProjects() {
      return this.projects.filter((project) => !project.featured);
    },
  },
  methods: {
    isExternal(href) {
      return /^https?:\/\//.test(href);
    },
    projectImage(project) {
      return `/img/portfolio-${project.imageUrl}.png`;
    },
    setFallbackImage(event) {
      event.target.src = '/img/portfolio-default.png';
    },
    async copyGithubUrl() {
      try {
        if (!navigator.clipboard) {
          throw new Error('Clipboard API unavailable');
        }

        await navigator.clipboard.writeText(this.profile.githubUrl);
        this.copyLabel = 'GitHub copied';
      } catch (error) {
        window.location.href = this.profile.githubUrl;
      } finally {
        window.setTimeout(() => {
          this.copyLabel = 'Copy GitHub';
        }, 1800);
      }
    },
  },
};
</script>

<style scoped>
.portfolio-home {
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: 6rem 1.25rem 7rem;
  color: var(--text-primary);
  text-align: left;
}

.section-block {
  scroll-margin-top: 7rem;
  border-top: 1px solid var(--border-subtle);
  padding: 3.25rem 0;
}

.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 2rem;
  align-items: end;
  border-top: 0;
  min-height: 70vh;
  padding-top: 1rem;
}

.eyebrow {
  color: var(--accent);
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.78rem;
  margin-bottom: 0.85rem;
}

.intro-copy h1 {
  color: var(--text-primary);
  font-family: "Geist Pixel", "Poppins", ui-monospace, monospace;
  font-size: clamp(2.9rem, 8vw, 6.25rem);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.05;
  max-width: 11ch;
}

.role {
  color: var(--text-secondary);
  font-size: 1.12rem;
  font-weight: 500;
  margin-top: 1.5rem;
}

.summary {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.75;
  margin-top: 1rem;
  max-width: 680px;
}

.focus-list,
.action-row,
.tech-list,
.project-links,
.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.focus-list {
  margin-top: 1.5rem;
}

.focus-list span,
.pill-grid li,
.tech-list li {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  padding: 0.35rem 0.7rem;
}

.action-row {
  margin-top: 2rem;
}

.text-link,
.project-links a {
  color: var(--text-primary);
  font-size: 0.9rem;
  text-decoration: underline;
  text-decoration-color: var(--border-hover);
  text-underline-offset: 0.35rem;
}

.text-link:hover,
.project-links a:hover {
  color: var(--accent-soft);
}

.profile-panel {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  display: grid;
  gap: 1.25rem;
  padding: 1rem;
}

.avatar-frame {
  animation: avatarIdle 7s ease-in-out infinite;
  border-radius: 0.8rem;
  box-shadow: 0 0 0 rgba(248, 113, 113, 0);
  overflow: hidden;
}

.avatar {
  aspect-ratio: 1;
  display: block;
  object-fit: cover;
  width: 100%;
}

@keyframes avatarIdle {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(248, 113, 113, 0);
    transform: translateY(0) scale(1);
  }

  50% {
    box-shadow: 0 0.75rem 2rem rgba(248, 113, 113, 0.08);
    transform: translateY(-0.22rem) scale(1.006);
  }
}

.avatar-theme-enter-active,
.avatar-theme-leave-active {
  transition:
    opacity 220ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 260ms ease;
}

.avatar-theme-enter-from {
  filter: blur(8px) saturate(0.85);
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.avatar-theme-leave-to {
  filter: blur(6px) saturate(0.85);
  opacity: 0;
  transform: scale(1.03) translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .avatar-frame {
    animation: none;
  }

  .avatar-theme-enter-active,
  .avatar-theme-leave-active {
    transition: opacity 80ms linear;
  }

  .avatar-theme-enter-from,
  .avatar-theme-leave-to {
    filter: none;
    transform: none;
  }
}

.panel-label {
  color: var(--text-faint);
  font-size: 0.78rem;
  text-transform: uppercase;
}

.panel-value {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 0.35rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid var(--border-subtle);
  border-top: 1px solid var(--border-subtle);
}

.metric-item {
  padding: 1.35rem 0;
}

.metric-item + .metric-item {
  border-left: 1px solid var(--border-subtle);
  padding-left: 1.35rem;
}

.metric-item strong {
  color: var(--text-primary);
  display: block;
  font-size: 2rem;
  line-height: 1;
}

.metric-item span {
  color: var(--text-muted);
  display: block;
  font-size: 0.84rem;
  margin-top: 0.4rem;
}

.section-heading {
  align-items: baseline;
  display: flex;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.section-heading span {
  color: var(--accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.78rem;
}

.section-heading h2 {
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
}

.featured-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  transition: border-color 180ms ease, transform 180ms ease;
}

.project-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.project-media {
  aspect-ratio: 16 / 9;
  background: var(--page-bg-soft);
  border-bottom: 1px solid var(--border-subtle);
}

.project-media img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.project-body {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.project-title-row {
  align-items: baseline;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.project-title-row h2,
.stack-layout h2,
.timeline-item h2,
.contact-grid h2 {
  color: var(--text-primary);
  font-size: 1.02rem;
  font-weight: 600;
}

.project-title-row span {
  color: var(--text-faint);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
}

.project-body p,
.experience-content li,
.timeline-item p,
.contact-grid p {
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.65;
  margin-top: 0.8rem;
}

.tech-list {
  list-style: none;
  margin-top: 1rem;
  padding: 0;
}

.project-links {
  margin-top: auto;
  padding-top: 1.25rem;
}

.archive-list {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  margin-top: 1rem;
  padding: 1rem;
}

.archive-list summary {
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 700;
}

.archive-list ul {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.archive-list li {
  align-items: baseline;
  border-top: 1px solid var(--border-faint);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding-top: 0.75rem;
}

.archive-list small {
  color: var(--text-muted);
  text-align: right;
}

.stack-layout {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1.4fr 1fr;
}

.pill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.experience-list {
  display: grid;
  gap: 0.65rem;
}

.experience-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 0.85rem;
  overflow: hidden;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.experience-card[open],
.experience-card:hover {
  border-color: var(--border-hover);
}

.experience-summary {
  align-items: center;
  cursor: pointer;
  display: grid;
  gap: 0.85rem;
  grid-template-columns: 8.5rem minmax(0, 1fr) 6.5rem 1rem;
  list-style: none;
  padding: 0.85rem 1rem;
}

.experience-summary::-webkit-details-marker {
  display: none;
}

.experience-summary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -4px;
}

.experience-period {
  color: var(--accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.72rem;
}

.experience-title {
  display: grid;
  gap: 0.12rem;
  min-width: 0;
}

.experience-title strong {
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
}

.experience-title small,
.experience-location {
  color: var(--text-muted);
  font-size: 0.78rem;
}

.experience-location {
  text-align: right;
}

.experience-toggle {
  border-bottom: 1.5px solid var(--text-faint);
  border-right: 1.5px solid var(--text-faint);
  height: 0.45rem;
  justify-self: end;
  transform: rotate(45deg);
  transition: transform 180ms ease;
  width: 0.45rem;
}

.experience-card[open] .experience-toggle {
  transform: rotate(-135deg);
}

.experience-content {
  border-top: 1px solid var(--border-faint);
  padding: 0 1rem 0.95rem 9.5rem;
}

.experience-content ul {
  display: grid;
  gap: 0.45rem;
  list-style: none;
  margin: 0.85rem 0 0;
  padding: 0;
}

.experience-content li {
  margin-top: 0;
  padding-left: 1.15rem;
  position: relative;
}

.experience-content li::before {
  background: var(--accent);
  border-radius: 999px;
  content: "";
  height: 0.35rem;
  left: 0;
  position: absolute;
  top: 0.62rem;
  width: 0.35rem;
}

.timeline-item,
.contact-grid {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 1.25rem;
}

.contact-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.contact-actions {
  justify-content: flex-end;
}

.button-link {
  align-items: center;
  background: var(--button-bg);
  border: 1px solid var(--button-bg);
  border-radius: 999px;
  color: var(--button-text);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 0.9rem;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0 1rem;
  text-decoration: none;
  white-space: nowrap;
}

.button-link.secondary {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-subtle);
}

.button-link:hover {
  border-color: var(--accent-soft);
}

.github-panel {
  background: var(--panel-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  overflow: hidden;
  padding: 1.25rem;
}

.github-panel-header {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.github-panel-header h2 {
  color: var(--text-primary);
  font-size: 1.02rem;
  font-weight: 600;
}

.github-graph-wrap {
  background: var(--panel-bg-strong);
  border: 1px solid var(--border-faint);
  border-radius: 0.8rem;
  overflow-x: auto;
  padding: 1rem;
}

.github-graph {
  display: block;
  min-width: 720px;
  width: 100%;
}

.github-fallback {
  align-items: center;
  background: var(--panel-bg-strong);
  border: 1px solid var(--border-faint);
  border-radius: 0.8rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
}

.github-fallback p {
  color: var(--text-muted);
  font-size: 0.92rem;
}

@media (max-width: 820px) {
  .portfolio-home {
    padding-top: 4.5rem;
  }

  .intro-grid,
  .featured-grid,
  .stack-layout,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .experience-summary {
    grid-template-columns: minmax(0, 1fr) 1rem;
  }

  .experience-period,
  .experience-title,
  .experience-location {
    grid-column: 1;
  }

  .experience-toggle {
    grid-column: 2;
    grid-row: 1 / span 3;
  }

  .experience-location {
    text-align: left;
  }

  .experience-content {
    padding: 0 1rem 0.95rem;
  }

  .intro-grid {
    min-height: auto;
  }

  .profile-panel {
    max-width: 420px;
  }

  .contact-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .portfolio-home {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .section-block {
    padding: 2.5rem 0;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-item,
  .metric-item + .metric-item {
    border-left: 0;
    padding-left: 0;
  }

  .metric-item + .metric-item {
    border-top: 1px solid var(--border-subtle);
  }

  .archive-list li {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }

  .archive-list small {
    text-align: left;
  }

  .github-panel-header,
  .github-fallback {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
