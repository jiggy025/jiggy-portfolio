/**
 * Hero field: the JRF request stream drawn as characters on an 8 by 16 grid.
 *
 * Left of the axis, raw requests arrive as dense, noisy packets carrying real payload fragments.
 * At the axis they resolve into one lane per job state, from Submitted to Completed.
 * Density decides the character (" .:-=+*#%@") and its tint (the theme's four glyph colours, then cobalt).
 *
 * Runs at 30 fps, pauses off screen, follows the pointer with a small lens,
 * and draws one still frame under reduced motion. Without script, the CSS dot grid stands in.
 */
(() => {
  const canvas = document.querySelector('[data-field]');
  const hero = canvas && canvas.closest('.hero');
  const inner = hero && hero.querySelector('.hero__inner');
  if (!canvas || !hero || !inner || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CELL_W = 8;
  const CELL_H = 16;
  const RAMP = ' .:-=+*#%@';

  // The five JRF states and a real fragment of each request's payload (from the X-ray's plan sheet)
  const LANES = [
    { state: 'Submitted', raw: '"asset":"C2025A000325"' },
    { state: 'Validated', raw: '"rail":"Submitted -> Validated"' },
    { state: 'In Service', raw: '"tech":"Boboi"' },
    { state: 'Delivered', raw: '"trip":"Delivered -> At Branch"' },
    { state: 'Completed', raw: '"audit":"job_request_event"' },
  ];

  // Read the theme's colours from the tokens, so the canvas never carries its own literals
  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();
  const TINTS = ['--color-glyph-1', '--color-glyph-2', '--color-glyph-3', '--color-glyph-4', '--color-accent-deep'].map(token);
  const INK = token('--color-ink-2');
  const MUTED = token('--color-muted');
  const ACCENT = token('--color-accent');
  const PAPER = token('--color-paper');

  // Value noise: a smooth random field, the classic building block for organic patterns
  const hash = (x, y) => {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const smooth = (t) => t * t * (3 - 2 * t);
  const noise = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = smooth(x - xi);
    const v = smooth(y - yi);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const ramp = (from, to, n) => clamp01((n - from) / (to - from));

  let cols = 0;
  let rows = 0;
  let laneRows = [];
  let fieldStart = 0;
  let axisCol = 0;
  let wide = true;
  let pointer = null;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL_W);
    rows = Math.ceil(h / CELL_H);

    // Align the field to the content box, so at 1920 it grows with the gutters, not into the text
    const box = inner.getBoundingClientRect();
    const heroBox = hero.getBoundingClientRect();
    const left = box.left - heroBox.left;
    const right = left + box.width;
    wide = w >= 960;
    if (wide) {
      fieldStart = Math.floor((left + box.width * 0.53) / CELL_W);
      axisCol = Math.floor((left + box.width * 0.82) / CELL_W);
      const top = Math.floor(rows * 0.2);
      const span = Math.floor(rows * 0.6);
      laneRows = LANES.map((_, i) => top + Math.round((span * i) / (LANES.length - 1)));
    } else {
      // Narrow: the field is a band under the text, lanes stacked at the bottom
      fieldStart = 0;
      axisCol = Math.floor(right / CELL_W) - 14;
      const top = rows - 13;
      laneRows = LANES.map((_, i) => top + i * 2);
    }
  };

  const draw = (t) => {
    const w = cols * CELL_W;
    ctx.clearRect(0, 0, w, rows * CELL_H);
    ctx.font = `400 ${CELL_H * 0.72}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';

    const startRow = wide ? 0 : laneRows[0] - 3;
    for (let r = Math.max(0, startRow); r < rows; r += 1) {
      // Distance to the nearest lane shapes the turbulence into streams
      let lane = 0;
      let laneDist = Infinity;
      for (let i = 0; i < laneRows.length; i += 1) {
        const d = Math.abs(r - laneRows[i]);
        if (d < laneDist) { laneDist = d; lane = i; }
      }
      const laneWeight = Math.exp(-(laneDist * laneDist) / (wide ? 10 : 3));

      for (let c = Math.max(0, fieldStart - 2); c < axisCol; c += 1) {
        const x = c * CELL_W;
        const y = r * CELL_H;
        const fade = wide ? ramp(fieldStart - 2, fieldStart + 12, c) : 1;
        // A packet per lane travels toward the axis; noise keeps it ragged
        const speed = 9 + lane * 1.7;
        const period = Math.max(24, axisCol - fieldStart + 10);
        const head = fieldStart - 10 + ((t * speed + lane * 37) % period);
        const behind = head - c;
        const packet = behind > 0 && behind < 26 ? Math.exp(-behind / 9) : 0;
        const turb = noise(c * 0.09 - t * 0.55, r * 0.21 + lane * 3.1);
        let d = (turb * 0.55 * laneWeight + packet * laneWeight * 0.95 + turb * 0.12) * fade;
        if (pointer) {
          const dx = (x - pointer.x) / 90;
          const dy = (y - pointer.y) / 60;
          d += Math.max(0, 0.35 - (dx * dx + dy * dy) * 0.35);
        }
        if (d < 0.14) continue;
        const k = clamp01(d);
        ctx.fillStyle = TINTS[Math.min(TINTS.length - 1, Math.floor(k * TINTS.length))];
        ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.floor(k * (RAMP.length - 1)) + 1)], x, y);
      }
    }

    // Each lane's payload fragment rides just behind its packet
    LANES.forEach((ln, i) => {
      const speed = 9 + i * 1.7;
      const period = Math.max(24, axisCol - fieldStart + 10);
      const head = fieldStart - 10 + ((t * speed + i * 37) % period);
      const textW = ctx.measureText(ln.raw).width;
      const startX = Math.round(head - 8) * CELL_W - textW;
      if (startX < (fieldStart + 4) * CELL_W || head > axisCol - 1) return;
      const y = laneRows[i] * CELL_H;
      ctx.fillStyle = PAPER;
      ctx.fillRect(startX - 4, y, textW + 8, CELL_H);
      ctx.fillStyle = TINTS[3];
      ctx.fillText(ln.raw, startX, y);
    });

    // The axis, where a raw request becomes a typed job state
    ctx.fillStyle = ACCENT;
    ctx.fillRect(axisCol * CELL_W + CELL_W / 2, laneRows[0] * CELL_H - CELL_H * 1.5, 1, (laneRows[laneRows.length - 1] - laneRows[0] + 3) * CELL_H);
    if (wide) {
      const labelY = (laneRows[0] - 3) * CELL_H;
      const left = 'POST /api/requests';
      const leftW = ctx.measureText(left).width;
      const leftX = (axisCol - 1) * CELL_W - leftW;
      ctx.fillStyle = PAPER;
      ctx.fillRect(leftX - 6, labelY - 2, leftW + 12, CELL_H + 4);
      ctx.fillStyle = MUTED;
      ctx.fillText(left, leftX, labelY);
      ctx.fillText('job_request_event', (axisCol + 2) * CELL_W, labelY);
    }

    // Resolved side: a calm, even stream per lane, with the state named once
    LANES.forEach((ln, i) => {
      const y = laneRows[i] * CELL_H;
      const labelCol = axisCol + 3;
      const labelEnd = labelCol + Math.ceil(ln.state.length * 0.78) + 1;
      ctx.fillStyle = ACCENT;
      ctx.fillRect((axisCol - 1) * CELL_W, y + CELL_H / 2, CELL_W * 3, 1);
      ctx.fillStyle = i === LANES.length - 1 ? ACCENT : INK;
      ctx.fillText(ln.state, labelCol * CELL_W, y);
      ctx.fillStyle = TINTS[1];
      for (let c = labelEnd + 1; c < cols; c += 1) {
        const tick = noise(c * 0.6 - t * 2.2, i * 5.3) > 0.45 ? '|' : ':';
        ctx.fillText(tick, c * CELL_W, y);
      }
    });
  };

  resize();
  document.documentElement.classList.add('has-field');

  if (reducedMotion) {
    // One composed still: the moment every lane has a packet in flight
    const still = () => { resize(); draw(4.2); };
    still();
    window.addEventListener('resize', still);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(still);
    return;
  }

  let running = false;
  let last = 0;
  const start = performance.now();
  const frame = (now) => {
    if (!running) return;
    if (now - last >= 1000 / 30) {
      last = now;
      draw((now - start) / 1000);
    }
    requestAnimationFrame(frame);
  };

  new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting;
    if (visible && !running) { running = true; requestAnimationFrame(frame); }
    if (!visible) running = false;
  }).observe(hero);

  window.addEventListener('resize', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  hero.addEventListener('pointermove', (e) => {
    const box = hero.getBoundingClientRect();
    pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
  });
  hero.addEventListener('pointerleave', () => { pointer = null; });
})();
