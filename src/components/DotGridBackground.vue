<template>
  <div class="dot-grid-background">
    <div ref="wrapperRef" class="dot-grid-background__wrap">
      <canvas ref="canvasRef" class="dot-grid-background__canvas" />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef -- defineProps is a Vue SFC compiler macro */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

const props = defineProps({
  dotSize: { type: Number, default: 16 },
  gap: { type: Number, default: 32 },
  baseColor: { type: String, default: '#5227FF' },
  activeColor: { type: String, default: '#5227FF' },
  proximity: { type: Number, default: 150 },
  speedTrigger: { type: Number, default: 100 },
  shockRadius: { type: Number, default: 250 },
  shockStrength: { type: Number, default: 5 },
  maxSpeed: { type: Number, default: 5000 },
  resistance: { type: Number, default: 750 },
  returnDuration: { type: Number, default: 1.5 }
});

const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

const hexToRgb = (hex) => {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
};

const wrapperRef = ref(null);
const canvasRef = ref(null);
const dots = [];
const pointer = { x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0 };

const baseRgb = computed(() => hexToRgb(props.baseColor));
const activeRgb = computed(() => hexToRgb(props.activeColor));

const buildGrid = () => {
  const wrap = wrapperRef.value;
  const canvas = canvasRef.value;
  if (!wrap || !canvas) return;

  const { width, height } = wrap.getBoundingClientRect();
  // ponytail: cap DPR on a subtle bg canvas, full DPR costs 4x pixels for nothing visible
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);

  const cols = Math.floor((width + props.gap) / (props.dotSize + props.gap));
  const rows = Math.floor((height + props.gap) / (props.dotSize + props.gap));
  const cell = props.dotSize + props.gap;

  const gridW = cell * cols - props.gap;
  const gridH = cell * rows - props.gap;

  const startX = (width - gridW) / 2 + props.dotSize / 2;
  const startY = (height - gridH) / 2 + props.dotSize / 2;

  dots.length = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, _inertiaApplied: false });
    }
  }
};

const drawFrame = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const proxSq = props.proximity * props.proximity;
  const radius = props.dotSize / 2;
  const hot = [];

  // ponytail: one batched fill for idle dots instead of thousands of save/fill/restore
  ctx.fillStyle = props.baseColor;
  ctx.beginPath();
  for (const dot of dots) {
    const dx = dot.cx - pointer.x;
    const dy = dot.cy - pointer.y;
    if (dx * dx + dy * dy <= proxSq) {
      hot.push(dot);
      continue;
    }
    const ox = dot.cx + dot.xOffset;
    const oy = dot.cy + dot.yOffset;
    ctx.moveTo(ox + radius, oy);
    ctx.arc(ox, oy, radius, 0, Math.PI * 2);
  }
  ctx.fill();

  for (const dot of hot) {
    const ox = dot.cx + dot.xOffset;
    const oy = dot.cy + dot.yOffset;
    const dx = dot.cx - pointer.x;
    const dy = dot.cy - pointer.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const t = 1 - dist / props.proximity;
    const r = Math.round(baseRgb.value.r + (activeRgb.value.r - baseRgb.value.r) * t);
    const g = Math.round(baseRgb.value.g + (activeRgb.value.g - baseRgb.value.g) * t);
    const b = Math.round(baseRgb.value.b + (activeRgb.value.b - baseRgb.value.b) * t);

    ctx.beginPath();
    ctx.arc(ox, oy, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fill();
  }
};

let cleanup = null;

onMounted(() => {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  buildGrid();

  const ro = new ResizeObserver(buildGrid);
  if (wrapperRef.value) ro.observe(wrapperRef.value);

  if (reducedMotion) {
    drawFrame();
    cleanup = () => ro.disconnect();
    return;
  }

  let rafId = 0;
  let visible = true;
  const draw = () => {
    rafId = 0;
    if (!visible) return;
    drawFrame();
    rafId = requestAnimationFrame(draw);
  };

  const returnDot = (dot) => {
    gsap.to(dot, {
      xOffset: 0,
      yOffset: 0,
      duration: props.returnDuration,
      ease: 'elastic.out(1,0.75)'
    });
    dot._inertiaApplied = false;
  };

  const onMove = (e) => {
    const now = performance.now();
    const dt = pointer.lastTime ? now - pointer.lastTime : 16;
    const dx = e.clientX - pointer.lastX;
    const dy = e.clientY - pointer.lastY;
    let vx = (dx / dt) * 1000;
    let vy = (dy / dt) * 1000;
    let speed = Math.hypot(vx, vy);
    if (speed > props.maxSpeed) {
      const scale = props.maxSpeed / speed;
      vx *= scale;
      vy *= scale;
      speed = props.maxSpeed;
    }
    pointer.lastTime = now;
    pointer.lastX = e.clientX;
    pointer.lastY = e.clientY;
    pointer.vx = vx;
    pointer.vy = vy;
    pointer.speed = speed;

    const rect = canvasRef.value.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;

    // ponytail: squared compare, no sqrt per dot per mousemove
    const moveProxSq = props.proximity * props.proximity;
    for (const dot of dots) {
      const mdx = dot.cx - pointer.x;
      const mdy = dot.cy - pointer.y;
      if (speed > props.speedTrigger && mdx * mdx + mdy * mdy < moveProxSq && !dot._inertiaApplied) {
        dot._inertiaApplied = true;
        gsap.killTweensOf(dot);
        gsap.to(dot, {
          inertia: { xOffset: dot.cx - pointer.x + vx * 0.005, yOffset: dot.cy - pointer.y + vy * 0.005, resistance: props.resistance },
          onComplete: () => returnDot(dot)
        });
      }
    }
  };

  const onClick = (e) => {
    const rect = canvasRef.value.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const shockSq = props.shockRadius * props.shockRadius;
    for (const dot of dots) {
      const sdx = dot.cx - cx;
      const sdy = dot.cy - cy;
      // ponytail: squared pre-check, sqrt only for dots actually in the shockwave
      if (sdx * sdx + sdy * sdy >= shockSq || dot._inertiaApplied) continue;
      const dist = Math.sqrt(sdx * sdx + sdy * sdy);
      dot._inertiaApplied = true;
      gsap.killTweensOf(dot);
      const falloff = Math.max(0, 1 - dist / props.shockRadius);
      gsap.to(dot, {
        inertia: {
          xOffset: (dot.cx - cx) * props.shockStrength * falloff,
          yOffset: (dot.cy - cy) * props.shockStrength * falloff,
          resistance: props.resistance
        },
        onComplete: () => returnDot(dot)
      });
    }
  };

  const throttledMove = throttle(onMove, 50);
  window.addEventListener('mousemove', throttledMove, { passive: true });
  window.addEventListener('click', onClick);

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && rafId === 0) rafId = requestAnimationFrame(draw);
    },
    { threshold: 0 }
  );
  io.observe(wrapperRef.value);
  rafId = requestAnimationFrame(draw);

  cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('mousemove', throttledMove);
    window.removeEventListener('click', onClick);
  };
});

onBeforeUnmount(() => {
  if (cleanup) cleanup();
});
</script>

<style scoped>
.dot-grid-background {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100%;
}

.dot-grid-background__wrap {
  height: 100%;
  position: relative;
  width: 100%;
}

.dot-grid-background__canvas {
  height: 100%;
  inset: 0;
  pointer-events: none;
  position: absolute;
  width: 100%;
}
</style>
