/* ══════════════════════════════════════════════════════════════
   SCHEMA.JS — libreria condivisa per gli schemi tecnici SVG
   Include con <script src="schema.js"></script>.
   Tutte le funzioni restituiscono stringhe SVG da concatenare
   dentro Sch.svg(W, H, corpo). Coordinate in pixel SVG (y verso il basso),
   angoli in radianti, 0 = destra, positivi in senso orario sullo schermo.
══════════════════════════════════════════════════════════════ */
const Sch = (() => {
  const C = {
    acc:'#4fc3f7', amber:'#ffa726', red:'#ef5350', green:'#66bb6a', violet:'#b39ddb',
    mut:'#9a9dab', dim:'#7d8090', bg:'#1c1d23', bg1:'#141519', text:'#e8e9ec'
  };
  const MONO = "DM Mono, monospace", COND = "Barlow Condensed, sans-serif";
  const f = v => (+v).toFixed(1);
  const mid = n => 'ah-' + n;

  // contenitore: definisce i marker (uno per colore) e applica font di base
  function svg(W, H, body, extra = '') {
    const mk = Object.entries(C).map(([k, col]) =>
      `<marker id="${mid(k)}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
         <path d="M0.5,0.8 L6.2,3.5 L0.5,6.2 z" fill="${col}"/></marker>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" ${extra}>
      <defs>${mk}</defs>${body}</svg>`;
  }

  // solo i marker (per SVG scritti a mano che usano le funzioni della libreria)
  const defs = () => `<defs>${Object.entries(C).map(([k, col]) =>
    `<marker id="${mid(k)}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0.5,0.8 L6.2,3.5 L0.5,6.2 z" fill="${col}"/></marker>`).join('')}</defs>`;

  function txt(x, y, s, o = {}) {
    const { c = C.mut, size = 10, anchor = 'middle', font = MONO, weight = 400, rot = 0, ls = 0 } = o;
    const t = rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : '';
    return `<text x="${f(x)}" y="${f(y)}" fill="${c}" font-family="${font}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${ls}"${t}>${s}</text>`;
  }
  function label(x, y, s, o = {}) { return txt(x, y, s, { font: COND, size: 12, ls: 1, c: C.mut, ...o }); }

  function line(x1, y1, x2, y2, o = {}) {
    const { c = C.mut, w = 1, dash = '' } = o;
    return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  }
  // linea d'asse (tratto-punto)
  const axis = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { c: C.dim, w: .8, dash: '9 3 2 3' });
  const circle = (cx, cy, r, o = {}) => {
    const { c = C.mut, w = 1, fill = 'none', dash = '' } = o;
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Math.max(r, 0))}" fill="${fill}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  const poly = (pts, o = {}) => {
    const { c = C.mut, w = 1, fill = 'none', close = true } = o;
    return `<${close ? 'polygon' : 'polyline'} points="${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`;
  };

  // quota lineare tra due punti, spostata di `off` px in direzione perpendicolare;
  // disegna le linee di richiamo e il testo (ruotato lungo la quota se `rot`)
  function dim(x1, y1, x2, y2, text, o = {}) {
    const { off = 18, c = C.mut, size = 10, ext = true, flip = false, hor = false } = o;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    const ax = x1 + nx * off, ay = y1 + ny * off, bx = x2 + nx * off, by = y2 + ny * off;
    const e = off > 0 ? 3 : -3;
    let s = '';
    if (ext) s += line(x1, y1, ax + nx * e, ay + ny * e, { c, w: .6 }) + line(x2, y2, bx + nx * e, by + ny * e, { c, w: .6 });
    s += `<line x1="${f(ax)}" y1="${f(ay)}" x2="${f(bx)}" y2="${f(by)}" stroke="${c}" stroke-width=".9" marker-start="url(#${mid(cname(c))})" marker-end="url(#${mid(cname(c))})"/>`;
    if (hor) {   // testo orizzontale accanto alla quota (per quote verticali)
      const sg = (nx * (flip ? -1 : 1)) >= 0 ? 1 : -1;
      return s + txt((ax + bx) / 2 + sg * 5, (ay + by) / 2 + 3, text, { c, size, anchor: sg > 0 ? 'start' : 'end' });
    }
    let ang = Math.atan2(dy, dx) * 180 / Math.PI;
    if (ang > 90 || ang < -90) ang += 180;
    const tx = (ax + bx) / 2 + nx * (flip ? -1 : 1) * 7, ty = (ay + by) / 2 + ny * (flip ? -1 : 1) * 7 + 3;
    s += txt(tx, ty, text, { c, size, rot: Math.abs(ang) < 1 ? 0 : ang });
    return s;
  }
  function cname(col) { return Object.keys(C).find(k => C[k] === col) || 'mut'; }

  // freccia di forza che parte da (x,y) con componenti (dx,dy) in pixel; l'etichetta sta in punta
  function force(x, y, dx, dy, text = '', o = {}) {
    const { c = C.amber, w = 2, size = 11, dist = 9, anchor } = o;
    const L = Math.hypot(dx, dy) || 1;
    const ex = x + dx, ey = y + dy;
    let s = `<line x1="${f(x)}" y1="${f(y)}" x2="${f(ex)}" y2="${f(ey)}" stroke="${c}" stroke-width="${w}" marker-end="url(#${mid(cname(c))})"/>`;
    if (text) {
      const tx = ex + dx / L * dist, ty = ey + dy / L * dist + 3;
      s += txt(tx, ty, text, { c, size, weight: 500, anchor: anchor || (Math.abs(dx) > Math.abs(dy) * 1.5 ? (dx > 0 ? 'start' : 'end') : 'middle') });
    }
    return s;
  }

  // arco di quota angolare con etichetta
  function arcDim(cx, cy, r, a1, a2, text, o = {}) {
    const { c = C.mut, size = 10, tdist = 12 } = o;
    const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const p2 = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
    const sweep = a2 > a1 ? 1 : 0;
    const am = (a1 + a2) / 2;
    return `<path d="M${f(p1[0])},${f(p1[1])} A${f(r)},${f(r)} 0 0 ${sweep} ${f(p2[0])},${f(p2[1])}" fill="none" stroke="${c}" stroke-width=".9" marker-start="url(#${mid(cname(c))})" marker-end="url(#${mid(cname(c))})"/>`
      + txt(cx + (r + tdist) * Math.cos(am), cy + (r + tdist) * Math.sin(am) + 3, text, { c, size });
  }

  // momento: arco con freccia
  function moment(cx, cy, r, text = '', o = {}) {
    const { c = C.violet, a1 = -2.4, a2 = 0.6, size = 11 } = o;
    const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)], p2 = [cx + r * Math.cos(a2), cy + r * Math.sin(a2)];
    return `<path d="M${f(p1[0])},${f(p1[1])} A${f(r)},${f(r)} 0 1 1 ${f(p2[0])},${f(p2[1])}" fill="none" stroke="${c}" stroke-width="2" marker-end="url(#${mid(cname(c))})"/>`
      + (text ? txt(cx, cy - r - 6, text, { c, size, weight: 500 }) : '');
  }

  // legenda dei simboli: items = [[simbolo, descrizione, colore?], ...]; disposta in colonna
  function legend(items, x, y, o = {}) {
    const { size = 9.5, gap = 14, w = 150 } = o;
    const h = items.length * gap + 10;
    let s = `<rect x="${x - 6}" y="${y - 12}" width="${w}" height="${h}" rx="4" fill="${C.bg1}" stroke="rgba(255,255,255,.07)"/>`;
    items.forEach((it, i) => {
      s += txt(x, y + i * gap, it[0], { c: it[2] || C.acc, size, anchor: 'start', weight: 500 });
      s += txt(x + 38, y + i * gap, it[1], { c: C.mut, size, anchor: 'start' });
    });
    return s;
  }

  // legenda orizzontale: items = [[simbolo, descrizione, colore?], ...], distribuita a passo fisso
  function legendRow(items, x, y, o = {}) {
    const { size = 9, step = 100 } = o;
    return items.map((it, i) => {
      const xi = x + i * step;
      return txt(xi, y, it[0], { c: it[2] || C.acc, size, anchor: 'start', weight: 500 })
        + txt(xi + 8 + it[0].length * 5.4, y, it[1], { c: C.mut, size, anchor: 'start' });
    }).join('');
  }

  // piccolo avviso "non in scala"
  const note = (x, y, s, anchor = 'start') => txt(x, y, s, { c: C.dim, size: 8.5, anchor });

  // sovrapposizione per trasmissioni a cinghia/catena a due pulegge (assi orizzontali).
  // o: {x1,x2,yc,r1,r2,th (angolo tangenti), betaDeg, tight, slack, note}
  // Convenzione: puleggia 1 motrice che gira in senso orario ⇒ lato teso in basso, lato lento in alto.
  function belt(o) {
    const { x1, x2, yc, r1, r2, th, tight = 'T₁ teso', slack = 'T₂ lento', note = '' } = o;
    const betaDeg = Number.isFinite(+o.betaDeg) ? +o.betaDeg : (Math.PI - 2 * th) * 180 / Math.PI;
    let s = defs();
    // rotazioni
    s += moment(x1, yc, Math.max(Math.min(r1 * 0.62, 22), 8), r1 > 26 ? 'ω₁' : '', { c: C.violet, a1: -2.6, a2: 0.4, size: 10 });
    s += moment(x2, yc, Math.max(Math.min(r2 * 0.62, 22), 8), r2 > 26 ? 'ω₂' : '', { c: C.violet, a1: -2.6, a2: 0.4, size: 10 });
    // arco di avvolgimento sulla puleggia 1 (lato opposto alla puleggia 2)
    const ra = r1 + 7, a1 = Math.PI / 2 + th, a2 = 3 * Math.PI / 2 - th;
    const P = a => [x1 + ra * Math.cos(a), yc + ra * Math.sin(a)];
    const p1 = P(a1), p2 = P(a2);
    s += `<path d="M${f(p1[0])},${f(p1[1])} A${f(ra)},${f(ra)} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${f(p2[0])},${f(p2[1])}" fill="none" stroke="${C.red}" stroke-width="2.2"/>`;
    s += txt(x1 - 6, yc + r1 + 20, `β₁ = ${(+betaDeg).toFixed(0)}°`, { c: C.red, size: 10, anchor: 'end', weight: 500 });
    // strand: direzione e etichette (il punto medio di ciascun tratto retto)
    const u = [x1 - r1 * Math.sin(th), yc - r1 * Math.cos(th)], u2 = [x2 - r2 * Math.sin(th), yc - r2 * Math.cos(th)];
    const l = [x1 - r1 * Math.sin(th), yc + r1 * Math.cos(th)], l2 = [x2 - r2 * Math.sin(th), yc + r2 * Math.cos(th)];
    const mid2 = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const mu = mid2(u, u2), ml = mid2(l, l2);
    const dirU = Math.atan2(u2[1] - u[1], u2[0] - u[0]);            // verso destra
    const dirL = Math.atan2(l[1] - l2[1], l[0] - l2[0]);            // verso sinistra
    const arr = (m, ang, off, col) => {
      const nx = Math.sin(ang) * off, ny = -Math.cos(ang) * off, L = 16;
      const cx = m[0] + nx, cy = m[1] + ny;
      return `<line x1="${f(cx - Math.cos(ang) * L)}" y1="${f(cy - Math.sin(ang) * L)}" x2="${f(cx + Math.cos(ang) * L)}" y2="${f(cy + Math.sin(ang) * L)}" stroke="${col}" stroke-width="2" marker-end="url(#${mid(cname(col))})"/>`;
    };
    s += arr(mu, dirU, 11, C.amber) + arr(ml, dirL, 11, C.red);
    s += txt(mu[0], mu[1] + 18, slack, { c: C.amber, size: 9.5, weight: 500 });
    s += txt(ml[0], ml[1] - 14, tight, { c: C.red, size: 9.5, weight: 500 });
    if (note) s += txt(10, 16, note, { c: C.mut, size: 9, anchor: 'start' });
    return s;
  }

  return { legendRow, belt, defs, C, MONO, COND, svg, txt, label, line, axis, circle, poly, dim, force, arcDim, moment, legend, note, f };
})();
