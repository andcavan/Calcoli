/* ═══════════════════════════════════════════════════════════════════════════
   DATABASE CINGHIE TRAPEZOIDALI E PIANE (trasmissioni ad attrito)
   ───────────────────────────────────────────────────────────────────────────
   Riferimenti normativi:
     • ISO 4184 / DIN 2215 — Cinghie trapezoidali classiche (Z, A, B, C, D, E)
     • ISO 4184 / DIN 7753 — Cinghie trapezoidali strette (SPZ, SPA, SPB, SPC)
     • Cinghie piane — nessuna sezione normata: dimensionate per larghezza,
       spessore e materiale (cuoio, tessuto gommato)

   ATTENZIONE — Il modello di calcolo usato in questa scheda è quello
   "classico" capstan/Eytelwein con correzione per forza centrifuga, arco di
   avvolgimento e lunghezza: è il metodo di pre-dimensionamento riportato
   nella manualistica (es. Boniardi, Shigley) e NON riproduce esattamente le
   tabelle di potenza nominale dei singoli costruttori (che includono
   correzioni empiriche aggiuntive per fatica a flessione). I valori di
   "Tmax" (tiro massimo ammissibile per singola cinghia) e "mlin" (massa
   lineare) sono valori di RIFERIMENTO, ordine di grandezza tipico dei
   cataloghi (Gates, Optibelt, ContiTech). La scelta definitiva va SEMPRE
   confrontata con il catalogo del fornitore selezionato.

   Campi di ogni profilo:
     nome      : sigla profilo
     bp        : larghezza primitiva [mm]
     h         : altezza sezione [mm]
     dmin      : diametro minimo puleggia consigliato [mm]
     mlin      : massa lineare [kg/m] (per la forza centrifuga F_c = mlin·v²)
     Tmax      : tiro massimo ammissibile per singola cinghia [N] (riferimento)
     vmax      : velocità periferica massima consigliata [m/s]
     Lp        : lunghezze primitive standard disponibili [mm] (sottoinsieme rappresentativo)
   ═══════════════════════════════════════════════════════════════════════════ */

const SEZIONI = {
  classiche: { label:'Classiche', desc:'ISO 4184 / DIN 2215', profili:['Z','A','B','C','D','E'] },
  strette:   { label:'Strette (SP)', desc:'ISO 4184 / DIN 7753', profili:['SPZ','SPA','SPB','SPC'] }
};

const PROFILI_V = {
  /* ─── Classiche — ISO 4184 / DIN 2215 ─────────────────────────────────── */
  Z:  { nome:'Z',   bp:8.5,  h:6.0,  dmin:50,  mlin:0.06, Tmax:180,  vmax:30,
        Lp:[400,450,500,560,630,710,800,900,1000,1120,1250,1400,1600] },
  A:  { nome:'A',   bp:11.0, h:8.0,  dmin:75,  mlin:0.10, Tmax:320,  vmax:30,
        Lp:[700,800,900,1000,1120,1250,1400,1600,1800,2000,2240,2500,2800,3150] },
  B:  { nome:'B',   bp:14.0, h:9.0,  dmin:125, mlin:0.17, Tmax:500,  vmax:30,
        Lp:[1250,1400,1600,1800,2000,2240,2500,2800,3150,3550,4000,4500,5000] },
  C:  { nome:'C',   bp:19.0, h:11.0, dmin:200, mlin:0.30, Tmax:880,  vmax:25,
        Lp:[2000,2240,2500,2800,3150,3550,4000,4500,5000,5600,6300,7100] },
  D:  { nome:'D',   bp:27.0, h:14.0, dmin:355, mlin:0.60, Tmax:1600, vmax:25,
        Lp:[3550,4000,4500,5000,5600,6300,7100,8000,9000,10000] },
  E:  { nome:'E',   bp:32.0, h:17.0, dmin:500, mlin:0.87, Tmax:2200, vmax:22,
        Lp:[4500,5000,5600,6300,7100,8000,9000,10000,11200] },

  /* ─── Strette (SP) — ISO 4184 / DIN 7753 ──────────────────────────────── */
  SPZ:{ nome:'SPZ', bp:8.5,  h:8.0,  dmin:63,  mlin:0.07, Tmax:270,  vmax:35,
        Lp:[630,700,800,900,1000,1120,1250,1400,1600,1800,2000,2240] },
  SPA:{ nome:'SPA', bp:11.0, h:10.0, dmin:90,  mlin:0.12, Tmax:430,  vmax:35,
        Lp:[900,1000,1120,1250,1400,1600,1800,2000,2240,2500,2800,3150] },
  SPB:{ nome:'SPB', bp:14.0, h:13.0, dmin:140, mlin:0.20, Tmax:750,  vmax:35,
        Lp:[1250,1400,1600,1800,2000,2240,2500,2800,3150,3550,4000,4500,5000] },
  SPC:{ nome:'SPC', bp:19.0, h:18.0, dmin:224, mlin:0.37, Tmax:1300, vmax:30,
        Lp:[2000,2240,2500,2800,3150,3550,4000,4500,5000,5600,6300,7100] }
};

/* Cinghia piana — non normata: caratterizzata da materiale (coefficiente
   d'attrito puleggia-cinghia e tensione ammissibile per mm² di sezione) e
   spessore commerciale. La larghezza è l'incognita di progetto. */
const MATERIALI_PIATTA = {
  cuoio:   { desc:'Cuoio conciato al cromo',        f:0.30, sigma_amm:2.2, spessori:[3,4,5,6,8] },
  gommata: { desc:'Tessuto gommato multistrato',     f:0.35, sigma_amm:3.0, spessori:[3,4,5,6,8,10] },
  poliamm: { desc:'Poliammide/poliuretano rivestito', f:0.40, sigma_amm:4.0, spessori:[2,3,4,5] }
};
const DENSITA_PIATTA = 1100; // kg/m³, valore medio indicativo per la massa lineare

/* Fattore correttivo per l'arco di avvolgimento β (sulla puleggia piccola),
   tabella universale (identica su tutti i cataloghi di cinghie ad attrito).
   Interpolata linearmente tra i punti tabellati. */
const ARCO_CORR = [
  { beta:180, c:1.00 }, { beta:170, c:0.98 }, { beta:160, c:0.95 },
  { beta:150, c:0.92 }, { beta:140, c:0.89 }, { beta:130, c:0.86 },
  { beta:120, c:0.82 }, { beta:110, c:0.78 }, { beta:100, c:0.73 },
  { beta:90,  c:0.68 }, { beta:60,  c:0.56 }
];

/* Fattore correttivo di lunghezza, in funzione del rapporto Lp / Lp_rif
   (Lp_rif = valore intermedio della serie standard del profilo). Approssimazione
   generica valida per pre-dimensionamento su tutte le sezioni. */
const LUNGH_CORR = [
  { r:0.6, c:0.85 }, { r:0.8, c:0.92 }, { r:1.0, c:1.00 }, { r:1.2, c:1.05 },
  { r:1.4, c:1.08 }, { r:1.6, c:1.11 }, { r:1.8, c:1.13 }, { r:2.2, c:1.15 }
];

/* Attrito di riferimento cinghia/puleggia (ghisa/acciaio) e semi-angolo di
   gola tipico delle pulegge trapezoidali, usati nell'attrito equivalente
   f' = f / sin(γ/2) del metodo capstan/Eytelwein. */
const ATTRITO_TRAPEZOIDALE = { f:0.30, gamma:36 };

/* ───────────────────────────────────────────────────────────────────────────
   FATTORI DI SERVIZIO Ks  (base, da sommare eventuali addendi)
   Fonte: prassi cataloghi cinghie trapezoidali. Ks_tot = K_motore + K_carico + K_ore
   ─────────────────────────────────────────────────────────────────────────── */
const MOTORE_V = {
  uniforme: { desc:'Motore uniforme (elettrico, turbina, ≤4 cil.)', k:0.0 },
  medio:    { desc:'Urti medi (motore c.c., 4-6 cilindri)',         k:0.2 },
  forte:    { desc:'Urti forti (monocilindrico, comb. interna)',    k:0.4 }
};
const CARICO_V = {
  uniforme: { desc:'Uniforme — ventilatori, pompe centrifughe',        k:1.0 },
  medio:    { desc:'Urti medi — trasportatori, macchine utensili',     k:1.3 },
  forte:    { desc:'Urti forti — frantoi, presse, compressori alt.',   k:1.6 }
};
const ORE_V = {
  breve:    { desc:'≤ 10 h/giorno',    k:0.0 },
  medio:    { desc:'10 – 16 h/giorno', k:0.1 },
  continuo: { desc:'> 16 h/giorno',    k:0.2 }
};
