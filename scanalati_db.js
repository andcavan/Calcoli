/* ═══════════════════════════════════════════════════════════════════════════
   DATABASE ALBERI SCANALATI (collegamenti scanalati albero-mozzo)
   ───────────────────────────────────────────────────────────────────────────
   Riferimenti normativi:
     • DIN 5480   — Scanalature a evolvente, modulo metrico, angolo 30°
     • ISO 4156   — Scanalature a evolvente, standard internazionale armonizzato
                    (geometricamente molto vicino a DIN 5480: differenze reali
                    principalmente su tolleranze e classi di accoppiamento, non
                    modellate in questa scheda semplificata)
     • DIN 5482   — Vecchio standard tedesco a evolvente (superato da DIN 5480),
                    dente più basso: presente su disegni di macchinari datati
     • ANSI B92.1 — Scanalature a evolvente in pollici (passo diametrale DP)
     • ANSI B92.2M— Scanalature a evolvente USA, modulo metrico
     • UNI 8953   — Collegamenti scanalati a fianchi paralleli (profili di
       riferimento), tre serie leggera/media/pesante a parità di diametro
       nominale (famiglia storicamente affine a DIN 5463/5464, ISO/R 14).
       ATTENZIONE: numero di denti z e rapporto Di/De per serie riportati
       con buona confidenza tecnica (struttura generale della norma), MA i
       diametri di riga sotto NON sono la tabella normativa integrale: sono
       una discretizzazione sui diametri preferenziali generici ISO 3
       (serie R20), usata solo per offrire una selezione AUTO/manuale come
       per gli altri standard. Verificare sempre sulla norma primaria
       prima di un uso esecutivo/di disegno.

   METODO DI CALCOLO — Metodo di Niemann semplificato (generalizzazione della
   verifica di pressione laterale già usata per le linguette): dai diametri
   esterno De e interno Di di ciascuna combinazione si ricavano il diametro
   medio dm=(De+Di)/2 e l'altezza utile di fianco h'=(De-Di)/2, usati nella
   pressione di contatto p = 2T/(z_eff·dm·h'·l).

   ATTENZIONE — Le tabelle DIN 5480/ISO 4156/DIN 5482/ANSI sono un
   SOTTOINSIEME RAPPRESENTATIVO (poche combinazioni modulo×denti per fascia
   di diametro), non la norma completa: per un disegno esecutivo verificare
   sempre la designazione esatta sulla tabella normativa integrale.
   ═══════════════════════════════════════════════════════════════════════════ */

const FAMIGLIE_SCAN = {
  metrico: { label:'Involute metriche', standard:['DIN5480','ISO4156','DIN5482'] },
  ansi:    { label:'Involute ANSI (USA)', standard:['ANSI_B92_1','ANSI_B92_2M'] },
  dritte:  { label:'Fianco dritto', standard:['UNI8953'] }
};

const STANDARD_INFO = {
  DIN5480:     { nome:'DIN 5480' },
  ISO4156:     { nome:'ISO 4156' },
  DIN5482:     { nome:'DIN 5482 (obsoleta)' },
  ANSI_B92_1:  { nome:'ANSI B92.1' },
  ANSI_B92_2M: { nome:'ANSI B92.2M' },
  UNI8953:     { nome:'UNI 8953' }
};

/* Campi di ogni riga tabellata: dB (diametro di riferimento m·z) [mm],
   m (modulo) [mm] o null se non applicabile, z (n° denti),
   De (diametro esterno effettivo) [mm], Di (diametro interno effettivo) [mm]. */
const TABELLE_SCAN = {

  DIN5480: [
    { dB:15.2, m:0.8,  z:19, De:15.92, Di:14.48 },
    { dB:18,   m:1,    z:18, De:18.90, Di:17.10 },
    { dB:22,   m:1,    z:22, De:22.90, Di:21.10 },
    { dB:25,   m:1.25, z:20, De:26.13, Di:23.88 },
    { dB:30,   m:1.25, z:24, De:31.13, Di:28.88 },
    { dB:36,   m:1.5,  z:24, De:37.35, Di:34.65 },
    { dB:42,   m:1.5,  z:28, De:43.35, Di:40.65 },
    { dB:48,   m:2,    z:24, De:49.80, Di:46.20 },
    { dB:56,   m:2,    z:28, De:57.80, Di:54.20 },
    { dB:60,   m:2.5,  z:24, De:62.25, Di:57.75 },
    { dB:70,   m:2.5,  z:28, De:72.25, Di:67.75 },
    { dB:78,   m:3,    z:26, De:80.70, Di:75.30 },
    { dB:90,   m:3,    z:30, De:92.70, Di:87.30 }
  ],

  /* Geometricamente coincidente con DIN 5480 in questo modello semplificato:
     le differenze reali di ISO 4156 riguardano tolleranze/classi di
     accoppiamento, non modellate qui. */
  ISO4156: [
    { dB:15.2, m:0.8,  z:19, De:15.92, Di:14.48 },
    { dB:18,   m:1,    z:18, De:18.90, Di:17.10 },
    { dB:22,   m:1,    z:22, De:22.90, Di:21.10 },
    { dB:25,   m:1.25, z:20, De:26.13, Di:23.88 },
    { dB:30,   m:1.25, z:24, De:31.13, Di:28.88 },
    { dB:36,   m:1.5,  z:24, De:37.35, Di:34.65 },
    { dB:42,   m:1.5,  z:28, De:43.35, Di:40.65 },
    { dB:48,   m:2,    z:24, De:49.80, Di:46.20 },
    { dB:56,   m:2,    z:28, De:57.80, Di:54.20 },
    { dB:60,   m:2.5,  z:24, De:62.25, Di:57.75 },
    { dB:70,   m:2.5,  z:28, De:72.25, Di:67.75 },
    { dB:78,   m:3,    z:26, De:80.70, Di:75.30 },
    { dB:90,   m:3,    z:30, De:92.70, Di:87.30 }
  ],

  /* Dente più basso (fattore altezza ~0.7·m contro ~0.9·m di DIN 5480). */
  DIN5482: [
    { dB:15.2, m:0.8,  z:19, De:15.76, Di:14.64 },
    { dB:18,   m:1,    z:18, De:18.70, Di:17.30 },
    { dB:22,   m:1,    z:22, De:22.70, Di:21.30 },
    { dB:25,   m:1.25, z:20, De:25.88, Di:24.13 },
    { dB:30,   m:1.25, z:24, De:30.88, Di:29.13 },
    { dB:36,   m:1.5,  z:24, De:37.05, Di:34.95 },
    { dB:42,   m:1.5,  z:28, De:43.05, Di:40.95 },
    { dB:48,   m:2,    z:24, De:49.40, Di:46.60 },
    { dB:56,   m:2,    z:28, De:57.40, Di:54.60 },
    { dB:60,   m:2.5,  z:24, De:61.75, Di:58.25 },
    { dB:70,   m:2.5,  z:28, De:71.75, Di:68.25 },
    { dB:78,   m:3,    z:26, De:80.10, Di:75.90 },
    { dB:90,   m:3,    z:30, De:92.10, Di:87.90 }
  ],

  /* Passo diametrale DP [denti/pollice]; modulo equivalente m_eq = 25.4/DP [mm] */
  ANSI_B92_1: [
    { dB:20.32, m:1.27,   z:16, De:21.46, Di:19.18, DP:20 },
    { dB:31.75, m:1.5875, z:20, De:33.18, Di:30.32, DP:16 },
    { dB:46.57, m:2.1167, z:22, De:48.47, Di:44.66, DP:12 },
    { dB:60.96, m:2.54,   z:24, De:63.25, Di:58.67, DP:10 },
    { dB:88.90, m:3.175,  z:28, De:91.76, Di:86.04, DP:8  }
  ],

  ANSI_B92_2M: [
    { dB:20,   m:1,   z:20, De:20.90, Di:19.10 },
    { dB:27.5, m:1.25,z:22, De:28.63, Di:26.38 },
    { dB:39,   m:1.5, z:26, De:40.35, Di:37.65 },
    { dB:52,   m:2,   z:26, De:53.80, Di:50.20 },
    { dB:65,   m:2.5, z:26, De:67.25, Di:62.75 },
    { dB:84,   m:3,   z:28, De:86.70, Di:81.30 }
  ],

  /* UNI 8953 — fianchi paralleli, tre serie leggera/media/pesante.
     z e rapporto Di/De per serie noti con buona confidenza (struttura
     generale della norma); i diametri De sono una discretizzazione sui
     diametri preferenziali generici ISO 3 (serie R20), NON l'elenco
     esatto delle designazioni UNI 8953 — vedi avviso in testa al file. */
  UNI8953: [
    // Serie leggera (z=6, Di/De=0.85)
    { dB:14.0, m:null, z:6, De:14.00, Di:11.90 },
    { dB:16.0, m:null, z:6, De:16.00, Di:13.60 },
    { dB:18.0, m:null, z:6, De:18.00, Di:15.30 },
    { dB:20.0, m:null, z:6, De:20.00, Di:17.00 },
    { dB:22.0, m:null, z:6, De:22.00, Di:18.70 },
    { dB:25.0, m:null, z:6, De:25.00, Di:21.25 },
    { dB:28.0, m:null, z:6, De:28.00, Di:23.80 },
    { dB:32.0, m:null, z:6, De:32.00, Di:27.20 },
    { dB:36.0, m:null, z:6, De:36.00, Di:30.60 },
    { dB:40.0, m:null, z:6, De:40.00, Di:34.00 },
    { dB:45.0, m:null, z:6, De:45.00, Di:38.25 },
    { dB:50.0, m:null, z:6, De:50.00, Di:42.50 },
    { dB:56.0, m:null, z:6, De:56.00, Di:47.60 },
    { dB:63.0, m:null, z:6, De:63.00, Di:53.55 },
    { dB:71.0, m:null, z:6, De:71.00, Di:60.35 },
    { dB:80.0, m:null, z:6, De:80.00, Di:68.00 },
    // Serie media (z=8, Di/De=0.80)
    { dB:14.0, m:null, z:8, De:14.00, Di:11.20 },
    { dB:16.0, m:null, z:8, De:16.00, Di:12.80 },
    { dB:18.0, m:null, z:8, De:18.00, Di:14.40 },
    { dB:20.0, m:null, z:8, De:20.00, Di:16.00 },
    { dB:22.0, m:null, z:8, De:22.00, Di:17.60 },
    { dB:25.0, m:null, z:8, De:25.00, Di:20.00 },
    { dB:28.0, m:null, z:8, De:28.00, Di:22.40 },
    { dB:32.0, m:null, z:8, De:32.00, Di:25.60 },
    { dB:36.0, m:null, z:8, De:36.00, Di:28.80 },
    { dB:40.0, m:null, z:8, De:40.00, Di:32.00 },
    { dB:45.0, m:null, z:8, De:45.00, Di:36.00 },
    { dB:50.0, m:null, z:8, De:50.00, Di:40.00 },
    { dB:56.0, m:null, z:8, De:56.00, Di:44.80 },
    { dB:63.0, m:null, z:8, De:63.00, Di:50.40 },
    { dB:71.0, m:null, z:8, De:71.00, Di:56.80 },
    { dB:80.0, m:null, z:8, De:80.00, Di:64.00 },
    // Serie pesante (z=10, Di/De=0.75)
    { dB:14.0, m:null, z:10, De:14.00, Di:10.50 },
    { dB:16.0, m:null, z:10, De:16.00, Di:12.00 },
    { dB:18.0, m:null, z:10, De:18.00, Di:13.50 },
    { dB:20.0, m:null, z:10, De:20.00, Di:15.00 },
    { dB:22.0, m:null, z:10, De:22.00, Di:16.50 },
    { dB:25.0, m:null, z:10, De:25.00, Di:18.75 },
    { dB:28.0, m:null, z:10, De:28.00, Di:21.00 },
    { dB:32.0, m:null, z:10, De:32.00, Di:24.00 },
    { dB:36.0, m:null, z:10, De:36.00, Di:27.00 },
    { dB:40.0, m:null, z:10, De:40.00, Di:30.00 },
    { dB:45.0, m:null, z:10, De:45.00, Di:33.75 },
    { dB:50.0, m:null, z:10, De:50.00, Di:37.50 },
    { dB:56.0, m:null, z:10, De:56.00, Di:42.00 },
    { dB:63.0, m:null, z:10, De:63.00, Di:47.25 },
    { dB:71.0, m:null, z:10, De:71.00, Di:53.25 },
    { dB:80.0, m:null, z:10, De:80.00, Di:60.00 }
  ]
};

/* Pressione ammissibile di contatto sul fianco [MPa], per condizione di
   impiego (fisso o scorrevole sotto carico) e trattamento termico.
   Riferimento: metodo Niemann / prassi DIN 6892 estesa alle scanalature. */
const P_AMM_SCANALATI = {
  fisso:      { non_temprato:10, temprato:20 },
  scorrevole: { non_temprato:4,  temprato:8  }
};

/* Fattore di ripartizione del carico tra i denti (ψ): non tutti i denti
   si ripartiscono uniformemente il carico per via degli errori di passo
   e di forma. */
const PSI_RIPARTIZIONE = {
  alta:     { desc:'Alta precisione (rettifica)', k:0.75 },
  standard: { desc:'Precisione standard',         k:0.6  },
  bassa:    { desc:'Bassa precisione',             k:0.5  }
};

/* Fattore di applicazione K_A (analogo a linguette_chiavette.html) */
const KA_SCANALATI = {
  '1.0': 'Uniforme — motore elettrico, carico costante',
  '1.3': 'Urti leggeri — ventilatori, pompe centrifughe',
  '1.7': 'Urti medi — trasportatori, macchine utensili',
  '2.5': 'Urti forti — frantoi, presse, laminatoi'
};
