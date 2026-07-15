/* ═══════════════════════════════════════════════════════════════════════════
   DATABASE CINGHIE DENTATE (trasmissioni sincrone / timing belt)
   ───────────────────────────────────────────────────────────────────────────
   Riferimenti normativi:
     • ISO 5296  — Cinghie dentate trapezoidali, serie imperiale (MXL…XXH)
     • ISO 5294 / ISO 5295 — Puleggie per cinghie dentate
     • ISO 13050 — Cinghie dentate a passo metrico, profili curvilinei (HTD 3M…14M)
     • DIN 7721  — Cinghie dentate a passo metrico trapezoidale (T2.5…T20)
     • Profili AT (dente rinforzato) — dati costruttori (Optibelt/BRECOflex/Megadyne)

   ATTENZIONE — I valori di "Fu_spec" (tiro utile ammissibile specifico, N per mm
   di larghezza) e "v_max" sono valori di RIFERIMENTO ricavati dai cataloghi dei
   principali costruttori (Gates, Optibelt, ContiTech, SIT, Megadyne) a condizioni
   nominali (denti in presa ≥ 6, temperatura ambiente, servizio continuo). Servono
   per un pre-dimensionamento. La scelta definitiva della cinghia va SEMPRE
   confrontata con il catalogo del fornitore selezionato.

   Campi di ogni profilo:
     sistema  : famiglia (HTD | T | AT | IMP)
     nome     : sigla profilo
     p        : passo [mm]
     hd       : altezza dente cinghia [mm] (indicativa)
     zmin     : n° minimo denti puleggia (limite di flessione)
     vmax     : velocità cinghia massima consigliata [m/s]
     Fu_spec  : tiro utile ammissibile per mm di larghezza [N/mm]
     larg     : larghezze standard disponibili [mm]  (per IMP: {code, b})
     Lp       : lunghezze primitive standard disponibili [mm]
   ═══════════════════════════════════════════════════════════════════════════ */

const PROFILI = {

  /* ─── HTD — profilo curvilineo, ISO 13050 ─────────────────────────────── */
  '3M':  { sistema:'HTD', nome:'HTD 3M',  p:3.0,  hd:1.17, zmin:10, vmax:80, Fu_spec:8,
           larg:[6,9,15],
           Lp:[120,141,150,159,177,201,225,240,264,285,300,339,375,420,447,486,525,600,675,750] },
  '5M':  { sistema:'HTD', nome:'HTD 5M',  p:5.0,  hd:2.06, zmin:14, vmax:80, Fu_spec:18,
           larg:[9,15,25],
           Lp:[300,340,375,400,420,450,475,500,565,600,635,670,710,750,800,850,900,1000,1125,1250,1420,1595,1800,2000] },
  '8M':  { sistema:'HTD', nome:'HTD 8M',  p:8.0,  hd:3.36, zmin:22, vmax:60, Fu_spec:55,
           larg:[20,30,50,85],
           Lp:[480,560,600,640,720,800,840,880,960,1040,1120,1200,1280,1440,1600,1760,2000,2240,2400,2600,2800,3280,3600] },
  '14M': { sistema:'HTD', nome:'HTD 14M', p:14.0, hd:6.02, zmin:28, vmax:45, Fu_spec:130,
           larg:[40,55,85,115,170],
           Lp:[966,1190,1400,1610,1778,2002,2100,2310,2450,2590,2800,3150,3500,3850,4326,4578,4956,5320,6006] },

  /* ─── T — trapezoidale metrico, DIN 7721 ──────────────────────────────── */
  'T2.5':{ sistema:'T', nome:'T2.5', p:2.5,  hd:1.2, zmin:10, vmax:80, Fu_spec:4,
           larg:[4,6,10,16],
           Lp:[120,145,150,177.5,200,215,245,285,305,330,380,420,455,480,540,600,650,780,950] },
  'T5':  { sistema:'T', nome:'T5',   p:5.0,  hd:2.2, zmin:10, vmax:80, Fu_spec:10,
           larg:[6,10,16,25],
           Lp:[100,120,165,200,255,300,340,375,420,455,500,545,600,660,720,780,860,940,1075,1140,1210,1380,1500,1610,1780,1950,2200,2500] },
  'T10': { sistema:'T', nome:'T10',  p:10.0, hd:4.5, zmin:12, vmax:60, Fu_spec:25,
           larg:[10,16,25,32,50],
           Lp:[260,330,410,450,500,560,610,660,720,780,840,890,960,1010,1080,1140,1210,1250,1320,1390,1450,1560,1610,1780,1960,2250,2500,2600,2960,3130,3450] },
  'T20': { sistema:'T', nome:'T20',  p:20.0, hd:8.0, zmin:15, vmax:40, Fu_spec:60,
           larg:[25,32,50,75,100],
           Lp:[1000,1260,1400,1580,1780,2000,2260,2540,2900,3380,4200,4400,4880] },

  /* ─── AT — trapezoidale metrico, dente rinforzato ─────────────────────── */
  'AT5': { sistema:'AT', nome:'AT5',  p:5.0,  hd:2.7, zmin:15, vmax:80, Fu_spec:20,
           larg:[10,16,25,32,50],
           Lp:[225,255,280,300,340,375,390,420,455,500,545,600,610,660,710,780,840,900,975,1050,1125,1210,1280,1350,1500,1610,1720,1900,2100,2250,2500] },
  'AT10':{ sistema:'AT', nome:'AT10', p:10.0, hd:5.0, zmin:15, vmax:60, Fu_spec:55,
           larg:[16,25,32,50,75,100],
           Lp:[500,600,700,750,780,840,890,920,960,1010,1080,1150,1210,1250,1280,1350,1400,1500,1600,1700,1800,1860,1940,2000,2250,2500,2700,2860,3050,3200,3500,4000,4400,4780,5000] },
  'AT20':{ sistema:'AT', nome:'AT20', p:20.0, hd:8.0, zmin:18, vmax:40, Fu_spec:120,
           larg:[25,32,50,75,100],
           Lp:[1280,1400,1580,1780,2000,2250,2500,2800,3080,3400,4160,4600,5000,6000] },

  /* ─── Imperiali — trapezoidale, ISO 5296 (passo in mm) ────────────────── */
  'MXL': { sistema:'IMP', nome:'MXL', p:2.032,  hd:0.51, zmin:10, vmax:80, Fu_spec:2.5,
           larg:[{code:'012',b:3.0},{code:'025',b:6.4}],
           Lp:[63.5,81.3,101.6,111.8,132.1,152.4,177.8,203.2,228.6,254,304.8,355.6,406.4] },
  'XL':  { sistema:'IMP', nome:'XL',  p:5.08,   hd:1.27, zmin:10, vmax:80, Fu_spec:6,
           larg:[{code:'025',b:6.4},{code:'037',b:9.5}],
           Lp:[152.4,203.2,254,304.8,355.6,406.4,457.2,508,558.8,609.6,660.4,711.2,812.8,914.4,1016] },
  'L':   { sistema:'IMP', nome:'L',   p:9.525,  hd:1.91, zmin:10, vmax:60, Fu_spec:15,
           larg:[{code:'050',b:12.7},{code:'075',b:19.1},{code:'100',b:25.4}],
           Lp:[266.7,304.8,342.9,381,419.1,457.2,533.4,609.6,685.8,762,838.2,914.4,990.6,1143,1219.2,1524] },
  'H':   { sistema:'IMP', nome:'H',   p:12.7,   hd:2.29, zmin:14, vmax:45, Fu_spec:40,
           larg:[{code:'075',b:19.1},{code:'100',b:25.4},{code:'150',b:38.1},{code:'200',b:50.8},{code:'300',b:76.2}],
           Lp:[609.6,762,914.4,1066.8,1219.2,1371.6,1524,1676.4,1828.8,2133.6,2438.4,2743.2,3048,3556,4064] },
  'XH':  { sistema:'IMP', nome:'XH',  p:22.225, hd:6.35, zmin:18, vmax:35, Fu_spec:90,
           larg:[{code:'200',b:50.8},{code:'300',b:76.2},{code:'400',b:101.6}],
           Lp:[1289.05,1422.4,1568.45,1778,1968.5,2159,2540,2921,3302,3683,4064] }
};

/* Ordine di visualizzazione dei profili per famiglia */
const SISTEMI = {
  HTD: { label:'HTD',       desc:'Curvilineo alta coppia (ISO 13050)', profili:['3M','5M','8M','14M'] },
  T:   { label:'T metrico', desc:'Trapezoidale metrico (DIN 7721)',    profili:['T2.5','T5','T10','T20'] },
  AT:  { label:'AT',        desc:'Trapezoidale dente rinforzato',      profili:['AT5','AT10','AT20'] },
  IMP: { label:'Imperiale', desc:'Trapezoidale in pollici (ISO 5296)', profili:['MXL','XL','L','H','XH'] }
};

/* ───────────────────────────────────────────────────────────────────────────
   FATTORI DI SERVIZIO Ks  (base, da sommare eventuali addendi)
   Fonte: prassi cataloghi cinghie sincrone. Ks_tot = Ks_base + add_ore + add_i
   ─────────────────────────────────────────────────────────────────────────── */
const MOTORE = {
  uniforme:  { desc:'Motore uniforme (elettrico, turbina, ≤4 cil.)', k:0.0 },
  medio:     { desc:'Urti medi (motore c.c., 4-6 cilindri)',         k:0.2 },
  forte:     { desc:'Urti forti (monocilindrico, comb. interna)',    k:0.4 }
};

const CARICO = {
  uniforme:  { desc:'Uniforme — nastri leggeri, ventilatori',            k:1.0 },
  medio:     { desc:'Urti medi — trasportatori, agitatori, macch. ut.',  k:1.4 },
  forte:     { desc:'Urti forti — frantoi, presse, laminatoi',           k:1.8 }
};

const ORE = {
  breve:  { desc:'≤ 10 h/giorno',      k:0.0 },
  medio:  { desc:'10 – 16 h/giorno',   k:0.1 },
  continuo:{ desc:'> 16 h/giorno',     k:0.2 }
};

/* Espone i simboli globalmente (i moduli caricano il file via <script src>) */
