/**
 * Hero field: the JRF request stream drawn as characters on an 8 by 16 grid.
 *
 * Left of the axis, raw requests arrive as dense, noisy packets carrying real payload fragments.
 * At the axis each one becomes a typed job state and travels on as a thin stream to its label,
 * which sits at the right edge of the content. Now and then a request loses the @Version race:
 * its lane shows 409 Conflict, the stream stalls, and the next pass retries it.
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
  const TRAIL = 26; // how many cells a packet's dense tail spans

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
  const ERROR = token('--color-error');
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

  // Layout in cells, recomputed on resize
  let cols = 0;
  let rows = 0;
  let laneRows = [];
  let fieldStart = 0; // where raw packets begin on lanes that share rows with the text
  let laneStart = []; // per lane: lanes clear of the text start from the left edge of the content
  let axisCol = 0; // where raw becomes typed
  let labelEnd = 0; // the right edge of the content box: labels end here
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
    labelEnd = Math.floor((left + width) / CELL_W);

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
      axisCol = Math.floor((left + width * 0.76) / CELL_W);
      const top = Math.floor(rows * 0.12);
      const span = Math.floor(rows * 0.76);
      laneRows = LANES.map((_, i) => top + Math.round((span * i) / (LANES.length - 1)));
      // A lane above or below the text block wraps around it, so its raw side starts at the content's left edge
      const contentLeft = Math.floor(left / CELL_W);
      laneStart = laneRows.map((r) => (r < textBox.t - 2 || r > textBox.b + 2 ? contentLeft : fieldStart));
    } else {
      // Narrow: the field is a band under the text, lanes stacked at the bottom
      fieldStart = Math.floor(left / CELL_W);
      axisCol = Math.floor((left + width * 0.42) / CELL_W);
      const top = rows - 13;
      laneRows = LANES.map((_, i) => top + i * 2);
      laneStart = laneRows.map(() => fieldStart);
    }
  };

  // Each lane's packet runs on a loop: across the raw side at lane speed, then along the typed side three times faster.
  // Every loop is one request.
  const TYPED_SPEED = 3;
  const laneSpeed = (i) => 9 + i * 1.7;
  const packetAt = (i, t) => {
    const from = laneStart[i];
    const rawLen = axisCol - (from - 10);
    const typedLen = (labelEnd + TRAIL - axisCol) / TYPED_SPEED;
    const period = Math.max(20, rawLen + typedLen);
    const travel = t * laneSpeed(i) + i * 37;
    const cycle = Math.floor(travel / period);
    const pos = travel % period;
    const head = pos < rawLen ? from - 10 + pos : axisCol + (pos - rawLen) * TYPED_SPEED;
    // About one request in four loses the @Version race (the same pseudo-random pick each time this cycle comes round)
    const failed = hash(cycle, i + 11) < 0.25;
    return { head, failed };
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

    const packets = LANES.map((_, i) => packetAt(i, t));
    let showingError = false;
    packets.forEach((pk) => {
      if (pk.failed && pk.head > axisCol) {
        if (showingError) pk.failed = false;
        showingError = true;
      }
    });
    const startRow = wide ? 0 : laneRows[0] - 3;

    // 1. Raw side: turbulence shaped into streams around each lane, plus a faint ambient cloud around the text
    for (let r = Math.max(0, startRow); r < rows; r += 1) {
      let lane = 0;
      let laneDist = Infinity;
      for (let i = 0; i < laneRows.length; i += 1) {
        const d = Math.abs(r - laneRows[i]);
        if (d < laneDist) { laneDist = d; lane = i; }
      }
      const laneWeight = Math.exp(-(laneDist * laneDist) / (wide ? 10 : 3));
      const { head, failed } = packets[lane];

      for (let c = 0; c < axisCol; c += 1) {
        const clear = textClear(c, r);
        if (clear === 0) continue;
        const x = c * CELL_W;
        const y = r * CELL_H;
        const inLanes = wide ? ramp(laneStart[lane] - 2, laneStart[lane] + 10, c) : 1;
        const behind = head - c;
        const packet = behind > 0 && behind < TRAIL ? Math.exp(-behind / 9) : 0;
        const turb = noise(c * 0.09 - t * 0.55, r * 0.21 + lane * 3.1);
        // A failed request piles up against the axis while it waits to retry
        const queue = failed && head > axisCol && c > axisCol - 10 ? 0.35 * laneWeight : 0;
        let d = (turb * 0.55 * laneWeight + packet * laneWeight * 0.95 + turb * 0.12) * inLanes + queue;
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

    // 2. Payload fragments ride behind their packet until it reaches the axis
    LANES.forEach((ln, i) => {
      const { head } = packets[i];
      if (head > axisCol + 4) return;
      const textW = ctx.measureText(ln.raw).width;
      const startX = Math.round(head - 8) * CELL_W - textW;
      if (startX < (laneStart[i] + 4) * CELL_W || startX + textW > (axisCol - 1) * CELL_W) return;
      const y = laneRows[i] * CELL_H;
      ctx.fillStyle = PAPER;
      ctx.fillRect(startX - 4, y, textW + 8, CELL_H);
      ctx.fillStyle = TINTS[3];
      ctx.fillText(ln.raw, startX, y);
    });

    // 3. The axis, where a raw request becomes a typed job state
    const axisX = axisCol * CELL_W + CELL_W / 2;
    ctx.fillStyle = ACCENT;
    ctx.fillRect(axisX, laneRows[0] * CELL_H - CELL_H * 1.5, 1, (laneRows[laneRows.length - 1] - laneRows[0] + 3) * CELL_H);
    if (wide) {
      const labelY = (laneRows[0] - 3) * CELL_H;
      const left = 'POST /api/requests';
      const leftW = ctx.measureText(left).width;
      ctx.fillStyle = PAPER;
      ctx.fillRect(axisX - leftW - 18, labelY - 2, leftW + 12, CELL_H + 4);
      ctx.fillStyle = MUTED;
      ctx.fillText(left, axisX - leftW - 12, labelY);
      const right = 'job_request_event';
      ctx.fillText(right, labelEnd * CELL_W - ctx.measureText(right).width, labelY);
    }

    // 4. Typed side: a hairline from the axis to each label, the packet's typed stream running along it
    LANES.forEach((ln, i) => {
      const { head, failed } = packets[i];
      const y = laneRows[i] * CELL_H;
      const midY = y + CELL_H / 2;
      const stateW = ctx.measureText(ln.state).width;
      const labelX = labelEnd * CELL_W - stateW;
      const lineEnd = labelX - CELL_W;
      const passed = head > axisCol;
      const stallX = axisX + (lineEnd - axisX) * 0.4;

      // The leader: a dotted hairline in the lightest glyph tint
      ctx.fillStyle = TINTS[1];
      for (let x = axisX + CELL_W; x < lineEnd; x += 4) ctx.fillRect(x, midY, 2, 1);

      if (passed && failed) {
        // 409: the stream stops partway, dashed in the error colour, with the status beside the axis
        ctx.fillStyle = ERROR;
        const reach = Math.min(stallX, axisX + (head - axisCol) * CELL_W);
        for (let x = axisX + 2; x < reach; x += 6) ctx.fillRect(x, midY - 0.5, 4, 2);
        ctx.fillRect(reach, y + 3, 1, CELL_H - 6);
        const code = wide ? '409 Conflict, retrying' : '409';
        const codeW = ctx.measureText(code).width;
        const codeX = axisX + 10;
        ctx.fillStyle = PAPER;
        ctx.fillRect(codeX - 4, y - CELL_H, codeW + 8, CELL_H);
        ctx.fillStyle = ERROR;
        ctx.fillText(code, codeX, y - CELL_H + 1);
      } else if (passed) {
        // Typed and on its way: a short solid run that slides from the axis to the label
        const tip = Math.min(lineEnd, axisX + (head - axisCol) * CELL_W);
        const tail = Math.max(axisX, tip - CELL_W * 8);
        ctx.fillStyle = ACCENT;
        ctx.fillRect(tail, midY - 0.5, tip - tail, 2);
      }

      // The state's label at the edge of the content; it lights up as its request arrives
      const arrived = passed && !failed && head > labelEnd - 6 && head < labelEnd + TRAIL - 6;
      ctx.fillStyle = PAPER;
      ctx.fillRect(labelX - 4, y, stateW + 8, CELL_H);
      ctx.fillStyle = arrived || i === LANES.length - 1 ? ACCENT : INK;
      ctx.fillText(ln.state, labelX, y);

      // Past the content edge, the typed events keep streaming into the gutter
      if (wide) {
        ctx.fillStyle = TINTS[0];
        for (let c = labelEnd + 2; c < cols; c += 1) {
          ctx.fillText(noise(c * 0.6 - t * 2.2, i * 5.3) > 0.45 ? '|' : ':', c * CELL_W, y);
        }
      }
    });
  };

  resize();
  document.documentElement.classList.add('has-field');

  if (reducedMotion) {
    // One composed still: a moment with packets in flight and one lane retrying
    const still = () => { resize(); draw(6.4); };
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
