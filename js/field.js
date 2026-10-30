/**
 * Hero field: the JRF request stream drawn as characters on an 8 by 16 grid.
 *
 * Each lane carries one request at a time, in four phases:
 *   raw    a dense, noisy packet drags its JSON fragment toward the axis, where the fragment scrambles as it is typed
 *   typed  the job state slides from the axis to the content edge, a short trail behind it
 *   hold   (only when the request lost the @Version race) the state stalls in red with 409, then is retried
 *   done   at the edge it shows a check and 200, and fades out
 *
 * Density decides the character (" .:-=+*#%@") and its tint (the theme's four glyph colours, then cobalt).
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
  const TRAIL = 26; // cells of dense tail behind a raw packet
  const HOLD = 1.6; // seconds a failed request waits before its retry
  const DONE = 1.1; // seconds the check stays before it has faded out
  const STALL = 0.28; // how far along the typed side a failed request gets before it stalls

  // The five JRF states and a real fragment of each request's payload (from the X-ray's plan sheet)
  const LANES = [
    { state: 'Submitted', raw: '{"asset":"C2025A000325"}' },
    { state: 'Validated', raw: '{"rail":"Submitted -> Validated"}' },
    { state: 'In Service', raw: '{"tech":"Boboi"}' },
    { state: 'Delivered', raw: '{"trip":"Delivered -> At Branch"}' },
    { state: 'Completed', raw: '{"audit":"job_request_event"}' },
  ];

  // Read the theme's colours from the tokens, so the canvas never carries its own literals.
  // They are re-read whenever light/dark mode changes (js/theme.js fires 'themechange').
  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();
  let TINTS, INK, MUTED, ACCENT, ERROR, PAPER;
  const readColors = () => {
    TINTS = ['--color-glyph-1', '--color-glyph-2', '--color-glyph-3', '--color-glyph-4', '--color-accent-deep'].map(token);
    INK = token('--color-ink');
    MUTED = token('--color-muted');
    ACCENT = token('--color-accent');
    ERROR = token('--color-error');
    PAPER = token('--color-paper');
  };
  readColors();
  window.addEventListener('themechange', readColors);

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
  const easeInOut = (n) => (n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2);
  const easeOut = (n) => 1 - Math.pow(1 - n, 3);

  // Layout in cells, recomputed on resize
  let cols = 0;
  let rows = 0;
  let laneRows = [];
  let laneStart = []; // per lane: lanes clear of the text start from the content's left edge
  let fieldStart = 0;
  let axisCol = 0; // where raw becomes typed
  let edgeCol = 0; // the right edge of the content box: typed states travel to here
  let textBox = null; // the headline block, in cells, which the field keeps clear of
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

    // The content box is the container minus its side padding, so the field lines up with the nav and text
    const heroBox = hero.getBoundingClientRect();
    const box = inner.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(inner).paddingLeft) || 0;
    const left = box.left - heroBox.left + pad;
    const width = box.width - pad * 2;
    edgeCol = Math.floor((left + width) / CELL_W);

    // The text block: the union of the headline, the sentence and the buttons, padded by a few cells.
    // A Range measures the text itself; the elements' own boxes stretch to the full container width.
    let tl = Infinity; let tt = Infinity; let tr = -Infinity; let tb = -Infinity;
    Array.from(inner.children).forEach((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      tl = Math.min(tl, r.left - heroBox.left); tt = Math.min(tt, r.top - heroBox.top);
      tr = Math.max(tr, r.right - heroBox.left); tb = Math.max(tb, r.bottom - heroBox.top);
    });
    textBox = { l: Math.floor(tl / CELL_W) - 4, t: Math.floor(tt / CELL_H) - 2, r: Math.ceil(tr / CELL_W) + 5, b: Math.ceil(tb / CELL_H) + 2 };

    wide = w >= 960;
    if (wide) {
      fieldStart = Math.max(textBox.r, Math.floor((left + width * 0.5) / CELL_W));
      axisCol = Math.floor((left + width * 0.66) / CELL_W);
      const top = Math.floor(rows * 0.18);
      const span = Math.floor(rows * 0.64);
      laneRows = LANES.map((_, i) => top + Math.round((span * i) / (LANES.length - 1)));
      const contentLeft = Math.floor(left / CELL_W);
      laneStart = laneRows.map((r) => (r < textBox.t - 2 || r > textBox.b + 2 ? contentLeft : fieldStart));
    } else {
      // Narrow: the field is a band under the text, lanes stacked at the bottom
      fieldStart = Math.floor(left / CELL_W);
      axisCol = Math.floor((left + width * 0.36) / CELL_W);
      const top = rows - 13;
      laneRows = LANES.map((_, i) => top + i * 2);
      laneStart = laneRows.map(() => fieldStart);
    }
  };

  // One request per lane per loop. The loop length is fixed, so a failed request (hold, then retry)
  // and a clean one take the same time: the clean one simply travels the typed side more slowly.
  const laneSpeed = (i) => 10 + i * 1.6;
  const requestAt = (i, t) => {
    const speed = laneSpeed(i);
    const from = laneStart[i] - 10;
    const rawDur = (axisCol - from) / speed;
    const typedDur = Math.max(1.4, (edgeCol - axisCol) / (speed * 2.2));
    const period = rawDur + HOLD + typedDur + DONE;
    const shifted = t + hash(i, 5) * period;
    const cycle = Math.floor(shifted / period);
    const tau = shifted - cycle * period;
    const failed = hash(cycle, i + 11) < 0.3;
    const req = { rawHead: from + tau * speed, failed, phase: 'raw', p: 0, done: 0, retried: false };
    if (tau < rawDur) return req;

    const s = tau - rawDur;
    if (failed) {
      if (s < HOLD) {
        req.phase = 'hold';
        req.p = STALL * easeOut(Math.min(1, s / 0.45));
      } else if (s < HOLD + typedDur) {
        req.phase = 'typed';
        req.retried = true;
        req.p = STALL + (1 - STALL) * easeInOut((s - HOLD) / typedDur);
      } else {
        req.phase = 'done';
        req.retried = true;
        req.p = 1;
        req.done = (s - HOLD - typedDur) / DONE;
      }
    } else if (s < HOLD + typedDur) {
      req.phase = 'typed';
      req.p = easeInOut(s / (HOLD + typedDur));
    } else {
      req.phase = 'done';
      req.p = 1;
      req.done = (s - HOLD - typedDur) / DONE;
    }
    return req;
  };

  // A cell is kept clear when it sits under the text block; the edge of the block fades in over a few cells
  const textClear = (c, r) => {
    if (!textBox) return 1;
    const dx = Math.max(textBox.l - c, 0, c - textBox.r);
    const dy = Math.max(textBox.t - r, 0, r - textBox.b);
    if (dx === 0 && dy === 0) return 0;
    return clamp01(Math.max(dx / 6, dy / 3));
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, cols * CELL_W, rows * CELL_H);
    ctx.font = `400 ${CELL_H * 0.72}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    const charW = ctx.measureText('0').width;

    const reqs = LANES.map((_, i) => requestAt(i, t));
    // Only one lane is ever in trouble at a time, so an error reads as an event and not as noise
    let errorShown = false;
    reqs.forEach((q) => {
      if (q.failed && q.phase === 'hold') {
        if (errorShown) q.failed = false;
        errorShown = true;
      }
    });

    // 1. Raw side: turbulence shaped into streams around each lane
    const startRow = wide ? 0 : laneRows[0] - 3;
    for (let r = Math.max(0, startRow); r < rows; r += 1) {
      let lane = 0;
      let laneDist = Infinity;
      for (let i = 0; i < laneRows.length; i += 1) {
        const d = Math.abs(r - laneRows[i]);
        if (d < laneDist) { laneDist = d; lane = i; }
      }
      const laneWeight = Math.exp(-(laneDist * laneDist) / (wide ? 10 : 3));
      const q = reqs[lane];

      for (let c = 0; c < axisCol; c += 1) {
        const clear = textClear(c, r);
        if (clear === 0) continue;
        const x = c * CELL_W;
        const y = r * CELL_H;
        const inLane = wide ? ramp(laneStart[lane] - 2, laneStart[lane] + 10, c) : 1;
        const behind = q.rawHead - c;
        const packet = behind > 0 && behind < TRAIL ? Math.exp(-behind / 9) : 0;
        const turb = noise(c * 0.09 - t * 0.55, r * 0.21 + lane * 3.1);
        // A request waiting on its retry piles up against the axis
        const queue = q.phase === 'hold' && q.failed && c > axisCol - 10 ? 0.4 * laneWeight : 0;
        let d = ((turb * 0.55 + packet * 0.95) * laneWeight + turb * 0.12) * inLane + queue;
        d *= clear;
        if (pointer) {
          const dx = (x - pointer.x) / 90;
          const dy = (y - pointer.y) / 60;
          d += Math.max(0, 0.35 - (dx * dx + dy * dy) * 0.35) * clear;
        }
        if (d < 0.14) continue;
        const k = clamp01(d);
        ctx.fillStyle = TINTS[Math.min(TINTS.length - 1, Math.floor(k * TINTS.length))];
        ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.floor(k * (RAMP.length - 1)) + 1)], x, y);
      }
    }

    const axisX = axisCol * CELL_W + CELL_W / 2;
    const edgeX = edgeCol * CELL_W;

    // 2. The JSON fragment rides behind its packet and scrambles as it reaches the axis, where it is typed
    LANES.forEach((ln, i) => {
      const q = reqs[i];
      const endX = (q.rawHead - 6) * CELL_W;
      const startX = endX - ln.raw.length * charW;
      if (endX < (laneStart[i] + 6) * CELL_W || startX > axisX) return;
      const y = laneRows[i] * CELL_H;
      ctx.fillStyle = PAPER;
      ctx.fillRect(Math.max(startX - 4, 0), y, Math.min(endX, axisX) - startX + 6, CELL_H);
      for (let k = 0; k < ln.raw.length; k += 1) {
        const cx = startX + k * charW;
        if (cx > axisX - charW) break;
        const near = (cx - (axisX - 10 * CELL_W)) / (10 * CELL_W); // 0 far from the axis, 1 at it
        const scramble = near > 0 && hash(k + i * 31, Math.floor(t * 14)) < near * 0.8;
        ctx.fillStyle = scramble ? TINTS[4] : TINTS[3];
        ctx.fillText(scramble ? RAMP[2 + Math.floor(hash(k, Math.floor(t * 20)) * 7)] : ln.raw[k], cx, y);
      }
    });

    // 3. The axis: a dotted rule with end caps, labelled with where requests come from and where they land
    const axisTop = (laneRows[0] - 1.5) * CELL_H;
    const axisBottom = (laneRows[laneRows.length - 1] + 2) * CELL_H;
    ctx.fillStyle = ACCENT;
    for (let y = axisTop; y < axisBottom; y += 4) ctx.fillRect(axisX, y, 1, 2);
    ctx.fillRect(axisX - 4, axisTop, 9, 1);
    ctx.fillRect(axisX - 4, axisBottom, 9, 1);
    if (wide) {
      const labelY = axisTop - CELL_H * 1.6;
      const left = 'POST /api/requests';
      const leftW = ctx.measureText(left).width;
      ctx.fillStyle = PAPER;
      ctx.fillRect(axisX - leftW / 2 - 6, labelY - 2, leftW + 12, CELL_H + 4);
      ctx.fillStyle = INK;
      ctx.fillText(left, axisX - leftW / 2, labelY);
      const right = 'job_request_event';
      ctx.fillText(right, edgeX - ctx.measureText(right).width, labelY);
    }

    // 4. Typed side: the state travels to the edge, stalls in red when it has to retry, and checks out at the edge
    LANES.forEach((ln, i) => {
      const q = reqs[i];
      const y = laneRows[i] * CELL_H;
      const midY = y + CELL_H / 2;

      // Lane texture: a dotted hairline the whole way across
      ctx.fillStyle = TINTS[1];
      for (let x = axisX + CELL_W; x < edgeX; x += 4) ctx.fillRect(x, midY, 2, 1);
      if (q.phase === 'raw') return;

      const stateW = ctx.measureText(ln.state).width;
      const travel = edgeX - stateW - (axisX + 14);
      const labelX = axisX + 14 + q.p * travel;

      if (q.phase === 'done') {
        // 200: the check sits in front of the state at the edge, and the pair fades out
        ctx.globalAlpha = 1 - easeOut(clamp01(q.done));
        const ok = '✓ 200';
        const okW = ctx.measureText(ok).width;
        ctx.fillStyle = PAPER;
        ctx.fillRect(labelX - okW - 14, y, okW + stateW + 18, CELL_H);
        ctx.fillStyle = ACCENT;
        ctx.fillText(ok, labelX - okW - 10, y);
        ctx.fillStyle = q.retried ? ACCENT : INK;
        ctx.fillText(ln.state, labelX, y);
        ctx.globalAlpha = 1;
        return;
      }

      const holding = q.phase === 'hold' && q.failed;
      // The trail: a short solid run behind the state, dashed red while it waits on a retry
      const trailEnd = labelX - 6;
      const trailStart = Math.max(axisX + 2, trailEnd - CELL_W * 9);
      ctx.fillStyle = holding ? ERROR : ACCENT;
      if (holding) {
        for (let x = trailStart; x < trailEnd; x += 6) ctx.fillRect(x, midY - 0.5, 3, 2);
      } else {
        ctx.fillRect(trailStart, midY - 0.5, trailEnd - trailStart, 2);
      }

      const tag = holding ? '409 ↻' : q.retried ? '↻ 1' : '';
      const tagW = tag ? ctx.measureText(tag).width + 8 : 0;
      ctx.fillStyle = PAPER;
      ctx.fillRect(labelX - 4, y, stateW + tagW + 8, CELL_H);
      ctx.fillStyle = holding ? ERROR : q.retried ? ACCENT : INK;
      ctx.fillText(ln.state, labelX, y);
      if (tag) {
        ctx.fillStyle = holding ? ERROR : MUTED;
        ctx.fillText(tag, labelX + stateW + 8, y);
      }
    });
  };

  resize();
  document.documentElement.classList.add('has-field');

  if (reducedMotion) {
    // One composed still: packets in flight, a state on its way, one request waiting on its retry
    const still = () => { resize(); draw(7.3); };
    still();
    window.addEventListener('resize', still);
    window.addEventListener('themechange', still);
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
