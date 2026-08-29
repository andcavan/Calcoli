/* ═══════════════════════════════════════════════════════════════════
   CONNESSIONI BULLONATE — Database filettature, classi e materiali

   Fonti:
   - ISO 261 / ISO 724   : filettature metriche ISO, profilo base
   - ISO 898-1           : classi di resistenza viti (Rm, Rp0,2)
   - ISO 4014 / ISO 4017 : viti a testa esagonale (dw, sw)
   - ISO 273 (serie media): diametro foro dh
   - VDI 2230 Blatt 1    : attriti, materiali, pressioni limite, fatica
   - EN 1993-1-8         : coefficienti giunti strutturali

   Filettature — colonne tabellate:
   d   = diametro nominale [mm]
   p   = passo [mm]
   d2  = diametro medio (fianchi) [mm]      — ISO 724
   dw  = diametro d'appoggio sottotesta [mm] — ISO 4014
   dh  = diametro foro, serie media [mm]     — ISO 273
   sw  = apertura chiave [mm]

   Calcolati a runtime (buildThreads):
   d3  = d − 1.226869·p   diametro di nocciolo [mm]        — ISO 724
   ds  = (d2 + d3)/2      diametro resistente [mm]
   As  = π/4·ds²          area resistente [mm²]
   A3  = π/4·d3²          area di nocciolo [mm²]
   D1  = d − 1.0825·p     diametro interno della madrevite [mm]
═══════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════
//  FILETTATURE METRICHE ISO
// ═══════════════════════════════════
const FILETTI_GROSSO_RAW = [
  // [d,  p,     d2,     dw,   dh,   sw]
  {d:3,  p:0.5,  d2:2.675,  dw:4.6,  dh:3.4,  sw:5.5},
  {d:4,  p:0.7,  d2:3.545,  dw:5.9,  dh:4.5,  sw:7},
  {d:5,  p:0.8,  d2:4.480,  dw:6.9,  dh:5.5,  sw:8},
  {d:6,  p:1.0,  d2:5.350,  dw:8.9,  dh:6.6,  sw:10},
  {d:8,  p:1.25, d2:7.188,  dw:11.6, dh:9.0,  sw:13},
  {d:10, p:1.5,  d2:9.026,  dw:14.6, dh:11.0, sw:16},
  {d:12, p:1.75, d2:10.863, dw:16.6, dh:13.5, sw:18},
  {d:14, p:2.0,  d2:12.701, dw:19.6, dh:15.5, sw:21},
  {d:16, p:2.0,  d2:14.701, dw:22.5, dh:17.5, sw:24},
  {d:18, p:2.5,  d2:16.376, dw:25.3, dh:20.0, sw:27},
  {d:20, p:2.5,  d2:18.376, dw:28.2, dh:22.0, sw:30},
  {d:22, p:2.5,  d2:20.376, dw:31.7, dh:24.0, sw:34},
  {d:24, p:3.0,  d2:22.051, dw:33.6, dh:26.0, sw:36},
  {d:27, p:3.0,  d2:25.051, dw:38.0, dh:30.0, sw:41},
  {d:30, p:3.5,  d2:27.727, dw:42.8, dh:33.0, sw:46},
  {d:33, p:3.5,  d2:30.727, dw:46.6, dh:36.0, sw:50},
  {d:36, p:4.0,  d2:33.402, dw:51.1, dh:39.0, sw:55},
];

const FILETTI_FINE_RAW = [
  {d:8,  p:1.0,  d2:7.350,  dw:11.6, dh:9.0,  sw:13,  label:'M8×1'},
  {d:10, p:1.0,  d2:9.350,  dw:14.6, dh:11.0, sw:16,  label:'M10×1'},
  {d:10, p:1.25, d2:9.188,  dw:14.6, dh:11.0, sw:16,  label:'M10×1.25'},
  {d:12, p:1.25, d2:11.188, dw:16.6, dh:13.5, sw:18,  label:'M12×1.25'},
  {d:12, p:1.5,  d2:11.026, dw:16.6, dh:13.5, sw:18,  label:'M12×1.5'},
  {d:14, p:1.5,  d2:13.026, dw:19.6, dh:15.5, sw:21,  label:'M14×1.5'},
  {d:16, p:1.5,  d2:15.026, dw:22.5, dh:17.5, sw:24,  label:'M16×1.5'},
  {d:18, p:1.5,  d2:17.026, dw:25.3, dh:20.0, sw:27,  label:'M18×1.5'},
  {d:20, p:1.5,  d2:19.026, dw:28.2, dh:22.0, sw:30,  label:'M20×1.5'},
  {d:22, p:1.5,  d2:21.026, dw:31.7, dh:24.0, sw:34,  label:'M22×1.5'},
  {d:24, p:2.0,  d2:22.701, dw:33.6, dh:26.0, sw:36,  label:'M24×2'},
  {d:27, p:2.0,  d2:25.701, dw:38.0, dh:30.0, sw:41,  label:'M27×2'},
  {d:30, p:2.0,  d2:28.701, dw:42.8, dh:33.0, sw:46,  label:'M30×2'},
  {d:33, p:2.0,  d2:31.701, dw:46.6, dh:36.0, sw:50,  label:'M33×2'},
  {d:36, p:3.0,  d2:34.051, dw:51.1, dh:39.0, sw:55,  label:'M36×3'},
];

// Completa ogni riga con le grandezze derivate (ISO 724)
function buildThreads(rows) {
  return rows.map(r => {
    const d3 = r.d - 1.226869 * r.p;          // nocciolo vite
    const ds = (r.d2 + d3) / 2;               // diametro resistente
    const D1 = r.d - 1.0825 * r.p;            // interno madrevite
    return Object.assign({}, r, {
      d3, ds, D1,
      As: Math.PI / 4 * ds * ds,
      A3: Math.PI / 4 * d3 * d3,
      AN: Math.PI / 4 * r.d * r.d,            // sezione gambo liscio
      label: r.label || ('M' + r.d),
    });
  });
}

const FILETTI = {
  grosso: buildThreads(FILETTI_GROSSO_RAW),
  fine:   buildThreads(FILETTI_FINE_RAW),
};

// ═══════════════════════════════════
//  CLASSI DI RESISTENZA — ISO 898-1
//  Rm e Rp0,2 in MPa. Per la 8.8 la norma
//  distingue d ≤ 16 (800/640) e d > 16 (830/660).
// ═══════════════════════════════════
const CLASSI = {
  '4.6':  {Rm:400,  Rp:240,  ec3:false},
  '5.6':  {Rm:500,  Rp:300,  ec3:false},
  '5.8':  {Rm:500,  Rp:400,  ec3:false},
  '6.8':  {Rm:600,  Rp:480,  ec3:false},
  '8.8':  {Rm:800,  Rp:640,  ec3:true, big:{Rm:830, Rp:660}},  // big = d > 16 mm
  '9.8':  {Rm:900,  Rp:720,  ec3:false},
  '10.9': {Rm:1000, Rp:900,  ec3:true},
  '12.9': {Rm:1200, Rp:1080, ec3:true},
};

// Restituisce {Rm, Rp} tenendo conto del diametro (ISO 898-1)
function classeProps(cls, d) {
  const c = CLASSI[cls];
  if (c.big && d > 16) return {Rm: c.big.Rm, Rp: c.big.Rp};
  return {Rm: c.Rm, Rp: c.Rp};
}

// ═══════════════════════════════════
//  COEFFICIENTI D'ATTRITO — VDI 2230 tab. A5
//  muG = filetto, muK = sottotesta (valori medi delle classi)
// ═══════════════════════════════════
const ATTRITI = [
  {id:'A',  desc:'Acciaio brunito, asciutto',        muG:0.15, muK:0.15},
  {id:'B',  desc:'Acciaio brunito, oliato',          muG:0.12, muK:0.12},
  {id:'C',  desc:'Zincato, asciutto',                muG:0.14, muK:0.14},
  {id:'D',  desc:'Zincato, oliato',                  muG:0.11, muK:0.11},
  {id:'E',  desc:'Zinco-lamellare (Dacromet)',       muG:0.10, muK:0.10},
  {id:'F',  desc:'Fosfatato, oliato',                muG:0.11, muK:0.11},
  {id:'G',  desc:'MoS₂ / grasso a base solida',      muG:0.08, muK:0.08},
  {id:'H',  desc:'Inox A2/A4, con pasta antigrippo', muG:0.14, muK:0.14},
  {id:'I',  desc:'Inox A2/A4, asciutto',             muG:0.23, muK:0.23},
];

// ═══════════════════════════════════
//  MATERIALI DELLE FLANGE / MADREVITE — VDI 2230 tab. A9
//  E   = modulo elastico [MPa]
//  pG  = pressione limite sotto testa/dado [MPa]
//  tauB= resistenza a taglio del filetto interno [MPa] ≈ 0,6·Rm del materiale
//        (per le ghise, meno duttili, si assume τB ≈ Rm)
// ═══════════════════════════════════
const MATERIALI = [
  {id:'S235',   desc:'Acciaio S235 (Fe360)',        E:210000, pG:490,  tauB:215},
  {id:'S275',   desc:'Acciaio S275',                E:210000, pG:550,  tauB:260},
  {id:'S355',   desc:'Acciaio S355 (Fe510)',        E:210000, pG:630,  tauB:295},
  {id:'C45',    desc:'Acciaio C45 bonificato',      E:205000, pG:700,  tauB:420},
  {id:'42CrMo4',desc:'Acciaio 42CrMo4 bonificato',  E:205000, pG:870,  tauB:600},
  {id:'GJL250', desc:'Ghisa grigia EN-GJL-250',     E:110000, pG:850,  tauB:250},
  {id:'GJS500', desc:'Ghisa sferoidale EN-GJS-500', E:175000, pG:750,  tauB:300},
  {id:'AlMgSi1',desc:'Alluminio AlMgSi1 (6082)',    E:70000,  pG:230,  tauB:185},
  {id:'AlZnMg', desc:'Alluminio AlZnMgCu1.5 (7075)',E:72000,  pG:370,  tauB:325},
];

// Fattore di riduzione dell'area di taglio efficace del filetto interno.
// Tiene conto della dilatazione della madrevite e della distribuzione non uniforme
// del carico sui filetti ingaggiati (fattori C1·C3 del modello di Alexander, VDI 2230 §5.5.5).
// Con C = 0,5 la lunghezza minima di avvitamento risulta ≈ 1·d in acciaio da costruzione,
// ≈ 0,8·d in acciaio bonificato e ≈ 2·d in lega di alluminio: valori in linea con la pratica.
const C_FILETTO = 0.5;

// ═══════════════════════════════════
//  METODI DI SERRAGGIO — fattore di serraggio αA (VDI 2230 tab. A8)
// ═══════════════════════════════════
const SERRAGGIO = [
  {id:'idraulico', desc:'Tenditore idraulico / allungamento', alfa:1.2},
  {id:'angolo',    desc:'Serraggio ad angolo (oltre snerv.)', alfa:1.0},
  {id:'dinam',     desc:'Chiave dinamometrica tarata',        alfa:1.7},
  {id:'avvitatore',desc:'Avvitatore a impulsi tarato',        alfa:2.5},
  {id:'mano',      desc:'Chiave a mano (senza controllo)',    alfa:4.0},
];

// ═══════════════════════════════════
//  ASSESTAMENTO fZ [µm] — VDI 2230 tab. 5.4/1
//  Somma dei contributi: filetto + testa/dado + interfacce interne.
//  Valori riferiti a carico prevalentemente assiale (rugosità media).
// ═══════════════════════════════════
const ASSESTAMENTO = [
  {id:'fine',   desc:'Superfici rettificate / Rz < 10 µm', filetto:3, testa:2.5, interf:1.5},
  {id:'media',  desc:'Superfici tornite / Rz 10–40 µm',    filetto:3, testa:3.0, interf:2.0},
  {id:'grossa', desc:'Superfici grezze / Rz > 40 µm',      filetto:3, testa:4.0, interf:3.0},
];

// ═══════════════════════════════════
//  FATICA — VDI 2230 §5.5.2
//  Ampiezza ammissibile per filetti RULLATI PRIMA del trattamento termico (SV):
//    σAS = 0.85 · (150/d + 45)   [MPa]
//  Per filetti rullati DOPO il trattamento (SG) il limite è più alto
//  (fattore correttivo dipendente dal precarico) — qui non considerato.
// ═══════════════════════════════════
function sigmaAS(d) {
  return 0.85 * (150 / d + 45);
}

// ═══════════════════════════════════
//  EN 1993-1-8 — coefficienti giunti strutturali
// ═══════════════════════════════════
const EC3 = {
  gM2: 1.25,          // resistenza dei bulloni a rottura (§2.2 tab. 2.1)
  gM3: 1.25,          // scorrimento allo SLU (cat. C)
  gM3ser: 1.10,       // scorrimento allo SLE (cat. B)
  k2_hex: 0.9,        // trazione, viti a testa esagonale (tab. 3.4)
  k2_svas: 0.63,      // trazione, viti a testa svasata
  // αv per taglio (tab. 3.4): 0.6 se il gambo liscio è nel piano di taglio,
  // 0.6 per 4.6/5.6/8.8 filettate, 0.5 per 4.8/5.8/6.8/10.9 filettate
  alfaV: (cls, filettoNelPiano) => {
    if (!filettoNelPiano) return 0.6;
    // 0.5 per 4.8, 5.8, 6.8 e 10.9 (tab. 3.4). La 12.9 non e' coperta dalla
    // norma: per analogia con la 10.9 si adotta il valore piu' cautelativo.
    return ['4.8','5.8','6.8','10.9','12.9'].includes(cls) ? 0.5 : 0.6;
  },
  // Classi di superficie per giunti ad attrito (EN 1090-2 tab. 18)
  superfici: [
    {id:'A', desc:'Classe A — sabbiata, metallizzata Al/Zn', mu:0.50},
    {id:'B', desc:'Classe B — sabbiata + primer alcalzinco', mu:0.40},
    {id:'C', desc:'Classe C — spazzolata / fiamma',          mu:0.30},
    {id:'D', desc:'Classe D — non trattata',                 mu:0.20},
  ],
  // Acciaio delle lamiere collegate: fy / fu [MPa] (EN 10025)
  lamiere: [
    {id:'S235', desc:'S235', fy:235, fu:360},
    {id:'S275', desc:'S275', fy:275, fu:430},
    {id:'S355', desc:'S355', fy:355, fu:490},
    {id:'S420', desc:'S420', fy:420, fu:520},
  ],
};
