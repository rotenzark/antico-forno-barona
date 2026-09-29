/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'antico-forno-barona',
    /* nessun WhatsApp pubblicato: solo il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* Google (29/9/2026): lunedì–venerdì 7–19:30, sabato 6–14, domenica chiuso */
    hours: {
      0: [],
      1: [['07:00', '19:30']],
      2: [['07:00', '19:30']],
      3: [['07:00', '19:30']],
      4: [['07:00', '19:30']],
      5: [['07:00', '19:30']],
      6: [['06:00', '14:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "L'Antico Forno: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.mensola": "Under the ladder",
      "n.lavagne": "The boards",
      "n.negozio": "The shop",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Bakery · café · Via Ettore Ponti 33, Milan",
      "h.testo": "The bakery in Via Ettore Ponti, in the Barona: many kinds of bread, focaccia, pizza and brioches, and coffee at the counter. Opens at 7, on Saturdays at 6.",
      "h.chi": "from a review on Google (in Italian: «Il pane migliore della zona», the best bread in the area)",
      "h.google": "on Google, 104 reviews",
      "a.vetrina": "The shop window in Via Ettore Ponti: the band of brick and the raised letters «L'Antico Forno Caffè» on the glass.",
      "c.vetrina": "The shop window, at Via Ettore Ponti 33.",
      "s.etichetta": "Under the ladder",
      "s.titolo": "A coffee under the light bulbs",
      "s.testo1": "Against the brick wall an old wooden ladder hangs at a slant, with light bulbs on jute ropes; underneath, a wooden ledge and a few stools.",
      "s.testo2": "Coffee and a brioche in the morning, pizza by the slice and focaccia at lunch, and bread to take home. Choose what goes on the ledge.",
      "p.titolo": "The ladder with the light bulbs",
      "p.desc": "Their brick wall with the old wooden ladder hanging at a slant: the globe bulbs come down on their jute ropes, swing and light up one by one, and the shop lights up. On the wooden ledge: breakfast, lunch or bread.",
      "p.d0": "Breakfast: a cappuccino with a milk heart and a brioche with seeds.",
      "p.d1": "Lunch: pizza by the slice and focaccia.",
      "p.d2": "Bread: a sourdough loaf and two «tartarughe» rolls.",
      "p.modi": "What goes on the ledge",
      "p.b0": "Breakfast",
      "p.b1": "Lunch",
      "p.b2": "Bread",
      "l.etichetta": "The boards",
      "l.titolo": "Bread, focaccia, coffee, breadsticks",
      "l.sotto": "The four black boards above the counter, in their own words (without the prices), as a customer photographed them a year ago: ask at the counter what there is today.",
      "l.pane": "Bread",
      "l.p1": "Sourdough",
      "l.p2": "Francesini rolls",
      "l.p3": "Bocconcini rolls",
      "l.p4": "Pasta dura",
      "l.p5": "Olive oil bread",
      "l.p6": "Wholemeal",
      "l.p7": "Five-grain",
      "l.p8": "Pan focaccia",
      "l.p9": "Turmeric bread",
      "l.p10": "Sicilian bread",
      "l.focaccia": "Focaccia",
      "l.f1": "Filled focaccia",
      "l.f2": "Filled pizza",
      "l.f3": "Round pizza",
      "l.f4": "Filled round pizza",
      "l.f5": "Margherita «lingua»",
      "l.f6": "Filled «lingua»",
      "l.f7": "Focaccina",
      "l.caffe": "Coffee",
      "l.c1": "Espresso",
      "l.c2": "Cappuccino",
      "l.c3": "Decaf",
      "l.c4": "Ginseng coffee",
      "l.c5": "Brioche",
      "l.c6": "Special brioche",
      "l.c7": "Cake",
      "l.c8": "Arancini",
      "l.grissini": "Breadsticks",
      "l.g1": "Olive breadsticks",
      "l.g2": "Plain breadsticks",
      "l.g3": "Sesame breadsticks",
      "l.g4": "Plain schiacciatina",
      "l.g5": "Olive schiacciatina",
      "l.g6": "Sesame schiacciatina",
      "l.feste": "For a party: trays of focaccia and brioches to order, a customer tells us. Call +39 334 325 7418.",
      "a.pane": "The iron shelves on the white tiles with the big loaves and the rolls, and the marble counter with the brioches.",
      "c.pane": "Bread on the iron shelves.",
      "a.lievito": "Big loaves with the «Lievito madre» (sourdough) label and rolls with the «Tartaruga» label.",
      "c.lievito": "Sourdough and «tartarughe».",
      "a.cornetto": "A golden croissant on a paper tray, on the wooden ledge.",
      "c.cornetto": "A croissant.",
      "a.banco": "The marble counter with the grey cement tiles and the biscuits: jam rings, cannoli, chocolate and pistachio shortbread.",
      "c.banco": "Biscuits on the counter.",
      "a.colazione": "A cappuccino with a milk heart and a brioche with seeds on the wooden ledge.",
      "c.colazione": "The real breakfast, on their ledge.",
      "g.etichetta": "The shop",
      "g.titolo": "Brick, iron and white tiles",
      "g.sotto": "The grey wall with the black logo, the brick with the ladder, the iron shelves on white tiles, the marble counter with the cement tiles. In the evening the window stays lit.",
      "a.scala": "The brick wall with the wooden ladder at a slant, the bulbs on jute ropes, a small arch in the brick and the ledge with the stools.",
      "c.scala": "The ladder and the ledge.",
      "a.logo": "The black logo on the grey wall: «L'Antico Forno, Caffè», the cup, «Pane & Dolci»; the bulbs and the white tiles.",
      "c.logo": "The logo on the grey wall.",
      "a.sera": "The shop window in the evening, lit: «L'Antico Forno, Pane & Dolci», the boards, the ledge with the stools.",
      "c.sera": "The window, in the evening.",
      "a.lampade": "The ladder on the brick with three bulbs on jute ropes, the iron grid on the ceiling, the ledge and the stools.",
      "c.lampade": "The bulbs on the ladder.",
      "d.etichetta": "Reviews",
      "d.titolo": "The bread, and then everything else",
      "d.google": "on Google, 104 reviews",
      "d.g7m": "Google, 7 months ago",
      "d.g2a": "Google, 2 years ago",
      "d.g1a": "Google, a year ago",
      "d.g10m": "Google, 10 months ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian). The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "From 7, on Saturdays from 6",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.chiuso": "closed",
      "o.nota": "Hours from their Google listing (September 2026). For August and bank holidays it is best to call.",
      "o.mappa": "Map: L'Antico Forno, Via Ettore Ponti 33, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Ettore Ponti 33, 20143 Milan, in the Barona",
      "o.bus": "By bus",
      "o.busv": "The 74 in Via Binda, corner of Via Ettore Ponti, about 50 metres away; the 47 in Piazza Bilbao, about 90",
      "o.tram": "By tram",
      "o.tramv": "The 2 in Via Lodovico il Moro, on the Naviglio Grande, about 600 metres away",
      "o.metro": "By metro",
      "o.metrov": "M2 Romolo, about a kilometre away",
      "o.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you drop by",
      "q.1": "When do you open?",
      "q.1r": "Monday to Friday from 7 am to 7:30 pm, Saturday from 6 am to 2 pm. Closed on Sundays.",
      "q.2": "Can I have breakfast there?",
      "q.2r": "Yes: coffee, cappuccino and brioches at the counter, or on the stools at the ledge under the ladder.",
      "q.3": "What bread do you make?",
      "q.3r": "On their board: sourdough, francesini, bocconcini, pasta dura, olive oil bread, wholemeal, five-grain, pan focaccia, turmeric bread, Sicilian bread. Ask at the counter what there is today.",
      "q.4": "Can I order trays for a party?",
      "q.4r": "A customer tells of ordering trays of focaccia and brioches for their birthday: call +39 334 325 7418 to arrange it.",
      "q.5": "How do I get there?",
      "q.5r": "Via Ettore Ponti 33, in the Barona: bus 74 stops in Via Binda, corner of Via Ettore Ponti, about 50 metres away; the 47 in Piazza Bilbao, about 90. Tram 2 runs along Via Lodovico il Moro, about 600 metres away; M2 Romolo is about a kilometre away.",
      "f2.orario": "Monday to Friday 7 am–7:30 pm · Saturday 6 am–2 pm · Sunday closed",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are by customers, from their Google listing; hours, boards and reviews from Google (September 2026). We drew the ladder with the light bulbs ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ L'ANTICO FORNO — Caffè · Pane & Dolci ══════════
     La pagina cammina lungo le pareti del loro negozio: il muro grigio col logo, il mattone con la scala, le piastrelle bianche con le
     lavagne e le mensole di ferro, le cementine del banco.
     la FIRMA — «la scala delle lampadine»: sul loro muro di mattoni la vecchia scala appesa di sbieco; le lampadine scendono sulle
     corde una dopo l'altra, oscillano e si fermano (D, le corde 0…1), poi il filamento si scalda e si accendono con un tremolio (L, la
     luce 0…1) e il buio del locale se ne va. Sulla mensola: Colazione, Pranzo, Pane (M). V è quello che c'è sulla mensola: 0 al suo
     posto, fino a 1 portato via (a destra), da −1 a 0 arriva il nuovo (da sinistra). Senza JS e alla fine: Colazione, D = L = 1, V = 0
     (l'HTML). L'attesa (classe nell'head): lampadine su al soffitto, spente, il locale al buio, nello stesso posto. Scegliere: la luce
     cala, quello che c'è si porta via, arriva l'altro e la luce torna. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al
     60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,470],"soffitto":34,"buio":0.5,"tempi":{"inizio":300,"scendi":1700,"pausa":120,"accendi":1200,"servi":380,"arriva":420,"scendiV":900,"accendiV":800,"basso":0.3,"via":320,"entra":320,"corda":0.6,"giri":1.25,"lampo":{"picco":0.85,"a":0.3,"b":0.45,"fondo":0.25},"durS":0.5,"durL":0.4},"lampade":[{"x":128,"L":150,"A":6,"sd":{"t":0,"d":0.5},"sl":{"t":0,"d":0.4}},{"x":222,"L":188,"A":-5,"sd":{"t":0.125,"d":0.5},"sl":{"t":0.15,"d":0.4}},{"x":316,"L":164,"A":7,"sd":{"t":0.25,"d":0.5},"sl":{"t":0.3,"d":0.4}},{"x":430,"L":104,"A":-6,"sd":{"t":0.375,"d":0.5},"sl":{"t":0.45,"d":0.4}},{"x":494,"L":150,"A":5,"sd":{"t":0.5,"d":0.5},"sl":{"t":0.6,"d":0.4}}],"piatti":["Colazione","Pranzo","Pane"]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('lampade'), svgF = prendi('lampadeSvg'), piattiF = prendi('lampadePiatti'), leggiF = prendi('lampadeLeggi');
  var buioF = svgF ? svgF.querySelector('.buio') : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.lampade__modi button[data-modo]'));
  var TF = DATI.tempi, LMP = DATI.lampade;
  var PEZZI = LMP.map(function (L, i) {
    var g = svgF ? svgF.querySelector('.lampada[data-i="' + i + '"]') : null;
    if (!g) return null;
    var p = { osc: g.querySelector('.lampada__oscilla'), filo: g.querySelector('.lampada__filo'), bulbo: g.querySelector('.lampada__bulbo'), luce: g.querySelector('.lampada__luce') };
    return p.osc && p.filo && p.bulbo && p.luce ? p : null;
  });
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, DF = 1, LF = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* la corda che si srotola: veloce all'inizio, si ferma al 60 % della finestra; poi l'oscillazione smorzata, zero alla fine */
  function discesa(p) { if (p <= 0) return 0; if (p >= 1) return 1; var q = Math.min(1, p / TF.corda); return 1 - Math.pow(1 - q, 3); }
  function oscilla(p, A) { if (p <= TF.corda || p >= 1) return 0; var u = (p - TF.corda) / (1 - TF.corda); return A * Math.sin(2 * Math.PI * TF.giri * u) * Math.pow(1 - u, 1.5); }
  /* il filamento che si scalda: su fino al picco, un calo (il tremolio), poi pieno */
  function lampo(p) {
    var K = TF.lampo;
    if (p <= 0) return 0; if (p >= 1) return 1;
    if (p < K.a) return K.picco * p / K.a;
    if (p < K.b) return K.picco - (K.picco - K.fondo) * (p - K.a) / (K.b - K.a);
    var w = (p - K.b) / (1 - K.b);
    return K.fondo + (1 - K.fondo) * (1 - (1 - w) * (1 - w));
  }
  function annunciaF(m) {
    var el = document.querySelector('.lampade__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale gli stessi attributi dell'HTML */
  function disegnaF(m, d, l, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    DF = d; LF = l; VF = v;
    LMP.forEach(function (L, i) {
      var P = PEZZI[i], pd = c01((d - L.sd.t) / L.sd.d), f = discesa(pd), pl = c01((l - L.sl.t) / L.sl.d);
      P.filo.setAttribute('transform', 'scale(1 ' + r3(f) + ')');
      P.bulbo.setAttribute('transform', 'translate(0 ' + r3(L.L * f) + ')');
      P.osc.setAttribute('transform', 'rotate(' + (r3(oscilla(pd, L.A)) || 0) + ')');
      P.luce.setAttribute('opacity', String(r3(lampo(pl))));
    });
    buioF.setAttribute('opacity', String(r3(DATI.buio * (1 - l)) || 0));
    if (v === 0) { piattiF.removeAttribute('transform'); piattiF.removeAttribute('opacity'); }
    else if (v > 0) { piattiF.setAttribute('transform', 'translate(' + r3(TF.via * v) + ' 0)'); piattiF.setAttribute('opacity', String(r3(1 - v))); }
    else { piattiF.setAttribute('transform', 'translate(' + r3(TF.entra * v) + ' 0)'); piattiF.setAttribute('opacity', String(r3(1 + v))); }
  }
  /* un piano: tratti { da, a, m, x0: {d, l, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.d + (B.d - A.d) * e, A.l + (B.l - A.l) * e, A.v + (B.v - A.v) * e);
  }
  var st3 = function (d, l, v) { return { d: d, l: l, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): le lampadine si fermano dove sono (#244); dall'attesa sono su, spente, al buio */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, DF, LF, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: su, spente, al buio */
    disegnaF(0, 0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [], t = 0, a = st3(0, 0, 0);
    var passo = function (dura, b) { P.push({ da: t, a: t + dura, m: 0, x0: a, x1: b, curva: 'lineare' }); t += dura; a = b; };
    passo(TF.inizio, st3(0, 0, 0));
    passo(TF.scendi, st3(1, 0, 0));
    passo(TF.pausa, st3(1, 0, 0));
    passo(TF.accendi, st3(1, 1, 0));
    avviaF('intro', { piano: P, fine: t });
  }
  /* il gesto: scegliere che cosa mettere sulla mensola. Se è quello che sta già arrivando, niente; altrimenti tutto si ferma dov'è, la
     luce cala, quello che c'è si porta via, arriva l'altro; se le lampadine non erano giù scendono, poi si riaccendono. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st3(DF, LF, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st3(a.d, Math.min(a.l, TF.basso), 1), 'dolce');
      a = st3(a.d, a.l, -1);
    }
    passo(TF.arriva, m, st3(a.d, a.l, 0), 'dolce');
    if (a.d < 1) passo(TF.scendiV, m, st3(1, a.l, 0), 'lineare');
    if (a.l < 1) passo(TF.accendiV, m, st3(1, 1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra le cementine */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la scala è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && piattiF && buioF && BOTTONI.length === DATI.piatti.length && PEZZI.every(Boolean)) {
    try { clearTimeout(window.__attesaLampade); } catch (e) {}
    window.__lampade = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, d: DF, l: LF, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__lampade.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la scala sotto la piega: parte quando se ne vede abbastanza; fino ad allora le lampadine restano su, spente */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__lampade.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
