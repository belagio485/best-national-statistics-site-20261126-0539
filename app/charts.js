// NusaAngka chart builders — small hand-rolled SVG, no library.
// Each function returns an SVG string; views.js places it in the page.

const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;");

function niceMax(value) {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const unit = value / power;
  const nice = unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10;
  return nice * power;
}

export function fmt(n, digits = 0) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// Vertical bar chart. points: [{label, value}]
export function barChart(points, opts = {}) {
  const width = opts.width ?? 720;
  const height = opts.height ?? 300;
  const color = opts.color ?? "#0e7c7b";
  const padL = 46, padR = 10, padT = 18, padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const max = niceMax(Math.max(...points.map((p) => p.value), 0));
  const step = innerW / points.length;
  const barW = Math.min(44, step * 0.62);
  let svg = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label ?? "Bar chart")}">`;
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = padT + innerH - (v / max) * innerH;
    svg += `<line class="grid" x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}"/>`;
    svg += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end">${fmt(v, opts.digits ?? 0)}</text>`;
  }
  points.forEach((p, i) => {
    const h = Math.max(0, (p.value / max) * innerH);
    const x = padL + i * step + (step - barW) / 2;
    const y = padT + innerH - h;
    const fill = p.value < 0 ? "#e4572e" : color;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="${fill}"><title>${esc(p.label)}: ${fmt(p.value, opts.digits ?? 1)}</title></rect>`;
    svg += `<text x="${x + barW / 2}" y="${height - 12}" text-anchor="middle">${esc(p.label)}</text>`;
    if (opts.showValues) {
      svg += `<text x="${x + barW / 2}" y="${y - 5}" text-anchor="middle" font-weight="700">${fmt(p.value, opts.digits ?? 1)}</text>`;
    }
  });
  svg += `<line class="axis" x1="${padL}" y1="${padT + innerH}" x2="${width - padR}" y2="${padT + innerH}"/>`;
  return svg + "</svg>";
}

// Line chart with area fill. points: [{label, value}]
export function lineChart(points, opts = {}) {
  const width = opts.width ?? 720;
  const height = opts.height ?? 300;
  const color = opts.color ?? "#0b3b4f";
  const padL = 52, padR = 14, padT = 18, padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const values = points.map((p) => p.value);
  const rawMax = Math.max(...values);
  const rawMin = Math.min(...values);
  const span = rawMax - rawMin || 1;
  const min = rawMin - span * 0.15;
  const max = rawMax + span * 0.15;
  const x = (i) => padL + (i / Math.max(1, points.length - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;
  let svg = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label ?? "Line chart")}">`;
  for (let i = 0; i <= 4; i++) {
    const v = min + ((max - min) / 4) * i;
    svg += `<line class="grid" x1="${padL}" y1="${y(v)}" x2="${width - padR}" y2="${y(v)}"/>`;
    svg += `<text x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${fmt(v, opts.digits ?? 0)}</text>`;
  }
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  svg += `<polygon points="${padL},${padT + innerH} ${line} ${width - padR},${padT + innerH}" fill="${color}" opacity="0.12"/>`;
  svg += `<polyline points="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  points.forEach((p, i) => {
    svg += `<circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="${color}"><title>${esc(p.label)}: ${fmt(p.value, opts.digits ?? 1)}</title></circle>`;
    if (i % Math.ceil(points.length / 8) === 0 || i === points.length - 1) {
      svg += `<text x="${x(i)}" y="${height - 12}" text-anchor="middle">${esc(p.label)}</text>`;
    }
  });
  const last = points[points.length - 1];
  svg += `<text x="${x(points.length - 1)}" y="${y(last.value) - 10}" text-anchor="middle" font-weight="800" fill="${color}">${fmt(last.value, opts.digits ?? 1)}</text>`;
  svg += `<line class="axis" x1="${padL}" y1="${padT + innerH}" x2="${width - padR}" y2="${padT + innerH}"/>`;
  return svg + "</svg>";
}

// Horizontal bars for ranked shares. rows: [{label, value, color}]
export function hBars(rows, opts = {}) {
  const width = opts.width ?? 720;
  const rowH = 30;
  const height = rows.length * rowH + 16;
  const labelW = opts.labelWidth ?? 210;
  const padR = 58;
  const innerW = width - labelW - padR;
  const max = Math.max(...rows.map((r) => r.value), 0.0001);
  let svg = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label ?? "Ranked bars")}">`;
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = (r.value / max) * innerW;
    svg += `<text x="${labelW - 8}" y="${y + 15}" text-anchor="end">${esc(r.label)}</text>`;
    svg += `<rect x="${labelW}" y="${y + 3}" width="${w}" height="16" rx="4" fill="${r.color ?? "#0e7c7b"}"><title>${esc(r.label)}: ${fmt(r.value, opts.digits ?? 1)}${esc(opts.unit ?? "")}</title></rect>`;
    svg += `<text x="${labelW + w + 7}" y="${y + 16}" font-weight="700">${fmt(r.value, opts.digits ?? 1)}${esc(opts.unit ?? "")}</text>`;
  });
  return svg + "</svg>";
}

// Donut chart. slices: [{label, value, color}]
export function donutChart(slices, opts = {}) {
  const size = opts.size ?? 300;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.58;
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  let angle = -Math.PI / 2;
  let svg = `<svg class="chart" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.label ?? "Donut chart")}" style="max-width:${size}px;margin:0 auto">`;
  slices.forEach((s) => {
    const sweep = (s.value / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + sweep), y2 = cy + r * Math.sin(angle + sweep);
    const ix1 = cx + inner * Math.cos(angle + sweep), iy1 = cy + inner * Math.sin(angle + sweep);
    const ix2 = cx + inner * Math.cos(angle), iy2 = cy + inner * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    svg += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z" fill="${s.color}"><title>${esc(s.label)}: ${fmt(s.value, 1)}%</title></path>`;
    angle += sweep;
  });
  svg += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="800" fill="#0b3b4f">${esc(opts.centerTop ?? "")}</text>`;
  svg += `<text x="${cx}" y="${cy + 16}" text-anchor="middle">${esc(opts.centerBottom ?? "")}</text>`;
  return svg + "</svg>";
}

// Population pyramid. rows: [{group, male, female}] youngest first.
export function pyramidChart(rows, opts = {}) {
  const width = opts.width ?? 720;
  const rowH = 24;
  const height = rows.length * rowH + 40;
  const mid = width / 2;
  const half = width / 2 - 92;
  const max = Math.max(...rows.flatMap((r) => [r.male, r.female]));
  let svg = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label ?? "Population pyramid")}">`;
  svg += `<text x="${mid - half}" y="16" font-weight="800" fill="#0b3b4f">Male</text>`;
  svg += `<text x="${mid + half}" y="16" text-anchor="end" font-weight="800" fill="#e4572e">Female</text>`;
  [...rows].reverse().forEach((r, i) => {
    const y = 26 + i * rowH;
    const mw = (r.male / max) * half;
    const fw = (r.female / max) * half;
    svg += `<rect x="${mid - mw}" y="${y}" width="${mw}" height="16" rx="3" fill="#0b3b4f"><title>${esc(r.group)} male: ${fmt(r.male, 1)}%</title></rect>`;
    svg += `<rect x="${mid}" y="${y}" width="${fw}" height="16" rx="3" fill="#e4572e"><title>${esc(r.group)} female: ${fmt(r.female, 1)}%</title></rect>`;
    svg += `<text x="${mid - mw - 5}" y="${y + 13}" text-anchor="end">${fmt(r.male, 1)}</text>`;
    svg += `<text x="${mid + fw + 5}" y="${y + 13}">${fmt(r.female, 1)}</text>`;
    svg += `<text x="${mid}" y="${y + 13}" text-anchor="middle" fill="#14232b" font-weight="700" style="paint-order:stroke;stroke:#faf7f0;stroke-width:3">${esc(r.group)}</text>`;
  });
  svg += `<line class="axis" x1="${mid}" y1="22" x2="${mid}" y2="${height - 8}"/>`;
  return svg + "</svg>";
}
