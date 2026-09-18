/* ═══════════════════════════════════════════════════════════════════════════
   DATABASE CATENE DI TRASMISSIONE A RULLI — Serie B (ISO 606)
   ───────────────────────────────────────────────────────────────────────────
   Riferimento normativo: ISO 606:2004 "Short-pitch transmission precision
   roller and bush chains" — serie B (passo, diametro rullo, larghezza
   interna, carico di rottura minimo).

   ATTENZIONE — I valori di passo (p), diametro rullo (d1) e larghezza
   interna (b1) sono geometrici e normati; il "carico di rottura minimo"
   (Fb) è il valore comunemente riportato dai principali costruttori
   (Renold, Tsubaki, iwis, Rexnord) con riferimento a ISO 606, ma andrebbe
   sempre confrontato con la tabella normativa completa prima di un uso
   progettuale reale. La pressione ammissibile sul perno-boccola (funzione
   della velocità catena) è una stima cautelativa semplificata: i cataloghi
   reali usano diagrammi di potenza tabellare più articolati (funzione anche
   del numero di denti pignone e della lubrificazione).

   Campi di ogni catena:
     p   : passo [mm]
     d1  : diametro rullo [mm]
     b1  : larghezza interna tra le piastre [mm]
     Fb  : carico di rottura minimo [N]
   ═══════════════════════════════════════════════════════════════════════════ */

const CATENE = {
  '05B': { p:8.00,   d1:5.00,  b1:3.00,  Fb:4400   },
  '06B': { p:9.525,  d1:6.35,  b1:5.72,  Fb:8900   },
  '08B': { p:12.70,  d1:8.51,  b1:7.75,  Fb:17800  },
  '10B': { p:15.875, d1:10.16, b1:9.65,  Fb:22200  },
  '12B': { p:19.05,  d1:12.07, b1:11.68, Fb:28900  },
  '16B': { p:25.40,  d1:15.88, b1:17.02, Fb:60000  },
  '20B': { p:31.75,  d1:19.05, b1:19.56, Fb:95000  },
  '24B': { p:38.10,  d1:25.40, b1:25.40, Fb:160000 },
  '28B': { p:44.45,  d1:27.94, b1:30.99, Fb:200000 },
  '32B': { p:50.80,  d1:29.21, b1:35.46, Fb:250000 },
  '40B': { p:63.50,  d1:39.37, b1:44.45, Fb:355000 },
  '48B': { p:76.20,  d1:48.26, b1:59.56, Fb:560000 }
};

/* Ordine crescente di passo, usato per la selezione AUTO (prima catena idonea) */
const ORDINE_CATENE = ['05B','06B','08B','10B','12B','16B','20B','24B','28B','32B','40B','48B'];

/* Pressione ammissibile sul perno-boccola in funzione della velocità catena,
   stima cautelativa da grafici di potenza semplificati (MPa). Interpolare
   linearmente tra i punti tabellati; oltre gli estremi si mantiene il
   valore limite (clampato). */
const P_AMM_CATENA = [
  { v:1,  p:35 }, { v:2, p:28 }, { v:4, p:22 },
  { v:6,  p:18 }, { v:10,p:14 }, { v:15,p:10 }
];

/* Velocità massima pratica consigliata per catene serie B (limite di
   fatica/rumorosità/lubrificazione, valore di riferimento generico). */
const CHAIN_VMAX = 15; // m/s

/* Numero minimo consigliato di denti pignone piccolo e rapporto massimo
   consigliato per singolo stadio. */
const Z1_MIN = 17;
const RAPPORTO_MAX = 7;

/* Fattore di sicurezza minimo consigliato sul carico di rottura (base). */
const SF_TRAZIONE_MIN = 7;

/* ───────────────────────────────────────────────────────────────────────────
   FATTORI DI SERVIZIO Ks  (base, da sommare eventuali addendi)
   Ks_tot = K_motore + K_carico + K_ore
   ─────────────────────────────────────────────────────────────────────────── */
const MOTORE_C = {
  uniforme: { desc:'Motore uniforme (elettrico, turbina, ≤4 cil.)', k:0.0 },
  medio:    { desc:'Urti medi (motore c.c., 4-6 cilindri)',         k:0.2 },
  forte:    { desc:'Urti forti (monocilindrico, comb. interna)',    k:0.4 }
};
const CARICO_C = {
  uniforme: { desc:'Uniforme — nastri, pompe volumetriche lente',   k:1.0 },
  medio:    { desc:'Urti medi — trasportatori, macch. utensili',    k:1.25 },
  forte:    { desc:'Urti forti — frantoi, presse, macch. agricole', k:1.5 }
};
const ORE_C = {
  breve:    { desc:'≤ 10 h/giorno',    k:0.0 },
  medio:    { desc:'10 – 16 h/giorno', k:0.1 },
  continuo: { desc:'> 16 h/giorno',    k:0.2 }
};
