/* Interactive Score Viewer
 * Browse each movement's pages with thumbnails, zoom, keyboard nav, lyrics pane.
 */
(() => {
  'use strict';

  const MOVEMENTS = [
    {
      id: 1,
      title: 'Requiem aeternam et Rest',
      poet: 'Requiem Mass · Margaret Cole',
      tempo: 'Lento doloroso ♩ = 56',
      pages: range(69, 82),       // score-069.png .. score-082.png
      lyrics:
`Requiem aeternam dona eis domine
et lux perpetua luceat eis.

REST, REST — They say you have earned your rest,
A long, long rest on the wide Flemish plain;
The sun on your hair, the rain on your breast
Shall never again.
        — Margaret Cole, "Rest"`,
      notes: 'Introit combining the Requiem Mass plainchant with Margaret Cole\'s elegy "Rest." A slow, doloroso opening that establishes the organ\'s chant-like motif and the choir\'s pianissimo entrance.'
    },
    {
      id: 2,
      title: 'Falling Leaves',
      poet: 'Margaret Postgate Cole',
      tempo: 'Lacrimoso ♩ = 80',
      pages: range(83, 89),
      lyrics:
`Today, as I rode by,
I saw the brown leaves dropping from their tree
In a still afternoon,
When no wind whirled them whistling to the sky,
But thickly, silently,
They fell, like snowflakes wiping out the noon.
        — Margaret Cole, "Falling Leaves" (1915)`,
      notes: 'A haunting depiction of mass casualties through the imagery of leaves falling in stillness. The plainchant Kyrie is layered beneath the SATB texture in whispered echoes.'
    },
    {
      id: 3,
      title: 'Roundel',
      poet: 'Vera Brittain',
      tempo: 'Con dolore ♩ = 60',
      pages: range(90, 95),
      lyrics:
`Because you died, I shall not rest again,
But wander ever through the lone worldwide,
Seeking the shadow of a dream grown vain
Because you died.

I shall spend brief and idle hours beside
The many lesser loves that still remain,
But find in none my triumph and my pride;
        — Vera Brittain, "Roundel (R.A.L., Died of Wounds)"`,
      notes: 'Brittain\'s lament for her fiancé Roland Leighton. The Pie Jesu plainchant colors the harmonic language; the "Because you died" refrain is cast in a rondeau-like return.'
    },
    {
      id: 4,
      title: 'Harvest Moon',
      poet: 'Josephine Preston Peabody · Requiem Mass',
      tempo: 'Agitato ♩ = 180–200',
      pages: range(96, 121),
      lyrics:
`Over the twilight field,
The overflowing moon
That reaps the hollow sky.

Two looked upon each other.
One was a woman, men had called
Their mother — of throbbing clay,
But dumb and quiet soon.
She looked, and went her way.
        — Josephine Preston Peabody, "Harvest Moon" (1916)`,
      notes: 'The central and longest movement: an agitato that fuses the Sanctus and Dies Irae plainchants with Peabody\'s apocalyptic harvest imagery. Contains the composition\'s most dense polyphonic writing.'
    },
    {
      id: 5,
      title: 'Your Name',
      poet: 'Winifred M. Letts',
      tempo: 'Tranquillo ♩ = 80',
      pages: range(122, 128),
      lyrics:
`No solemn panegyrist shall destroy
My image of you — gay, familiar,
As in old happy days, —
Lest I discover too late
I\'ve won a saint but lost a lover.
        — Winifred M. Letts, "Your Name"`,
      notes: 'A quiet, intimate setting that refuses public mourning in favor of private memory. The Sanctus and Requiem aeternam plainchants appear as fragments in the organ.'
    },
    {
      id: 6,
      title: 'Lux aeterna',
      poet: 'Requiem Mass',
      tempo: 'Tranquillo ♩ = 80',
      pages: range(129, 134),
      lyrics:
`Lux aeterna luceat eis, Domine,
cum sanctis tuis in aeternum,
quia pius es.

(May light eternal shine upon them, O Lord,
with your saints forever, for you are merciful.)`,
      notes: 'Both the Lux aeterna plainchant and the Requiem aeternam are interwoven here, culminating in a luminous SATB texture over sustained organ.'
    },
    {
      id: 7,
      title: 'Postlude: Requiem aeternam et Rest',
      poet: 'Requiem Mass · Margaret Cole',
      tempo: 'Lento doloroso ♩ = 56',
      pages: range(135, 142),
      lyrics:
`Requiescant in pace. Amen.
REST, REST — Through the long Flemish night,
Your bones are white, your grave is deep.
May flights of angels sing thee to thy sleep.
        — Requiem Mass · Margaret Cole, "Rest"`,
      notes: 'The closing movement mirrors the Introit, bringing back the opening material transformed — ending with the Requiescant in pace plainchant in the organ alone.'
    }
  ];

  function range(a, b) {
    const arr = [];
    for (let i = a; i <= b; i++) arr.push('score-' + String(i).padStart(3, '0') + '.png');
    return arr;
  }

  const root = document.querySelector('[data-score-viewer]');
  if (!root) return;

  const tabsEl = root.querySelector('.movement-tabs');
  const meta   = root.querySelector('.score-meta');
  const viewer = root.querySelector('.score-viewer');
  const pageImg = root.querySelector('.score-page');
  const thumbs = root.querySelector('.score-thumbs');
  const lyricsEl = root.querySelector('.score-lyrics');
  const notesEl = root.querySelector('.score-notes');
  const pageInfo = root.querySelector('.score-page-info');
  const prevBtn = root.querySelector('[data-score-prev]');
  const nextBtn = root.querySelector('[data-score-next]');
  const zoomBtn = root.querySelector('[data-score-zoom]');
  const dlBtn   = root.querySelector('[data-score-download]');

  let mvIdx = 0;
  let pgIdx = 0;

  // Build tabs
  tabsEl.innerHTML = '';
  MOVEMENTS.forEach((m, i) => {
    const b = document.createElement('button');
    b.className = 'mv-tab';
    b.textContent = `${romanize(m.id)} · ${m.title}`;
    b.addEventListener('click', () => selectMovement(i));
    tabsEl.appendChild(b);
  });

  function romanize(n) {
    return ['I','II','III','IV','V','VI','VII'][n - 1] || String(n);
  }

  function selectMovement(i) {
    mvIdx = i;
    pgIdx = 0;
    const m = MOVEMENTS[i];
    tabsEl.querySelectorAll('.mv-tab').forEach((t, j) => t.classList.toggle('active', j === i));
    meta.querySelector('.score-meta__title').textContent = `Movement ${romanize(m.id)} · ${m.title}`;
    meta.querySelector('.score-meta__poet').textContent = m.poet;
    meta.querySelector('.score-meta__tempo').textContent = m.tempo;
    lyricsEl.innerHTML = m.lyrics.replace(/— (.+)$/m, '<span class="attribution">— $1</span>');
    notesEl.innerHTML = '<strong>About this movement —</strong> ' + m.notes;
    // Thumbs
    thumbs.innerHTML = '';
    m.pages.forEach((src, j) => {
      const t = document.createElement('div');
      t.className = 'score-thumb';
      t.style.backgroundImage = `url('../assets/score/${src}')`;
      t.title = `Page ${j + 1}`;
      t.addEventListener('click', () => selectPage(j));
      thumbs.appendChild(t);
    });
    selectPage(0);
  }

  function selectPage(i) {
    const m = MOVEMENTS[mvIdx];
    pgIdx = Math.max(0, Math.min(i, m.pages.length - 1));
    pageImg.src = `../assets/score/${m.pages[pgIdx]}`;
    pageImg.alt = `${m.title} — page ${pgIdx + 1} of ${m.pages.length}`;
    pageImg.classList.remove('zoomed');
    thumbs.querySelectorAll('.score-thumb').forEach((t, j) => t.classList.toggle('active', j === pgIdx));
    pageInfo.textContent = `Page ${pgIdx + 1} of ${m.pages.length}`;
    prevBtn.disabled = pgIdx === 0;
    nextBtn.disabled = pgIdx === m.pages.length - 1;
    // Scroll active thumb into view
    const active = thumbs.querySelector('.score-thumb.active');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    // Scroll viewer to top
    viewer.scrollTop = 0;
  }

  prevBtn.addEventListener('click', () => selectPage(pgIdx - 1));
  nextBtn.addEventListener('click', () => selectPage(pgIdx + 1));
  zoomBtn.addEventListener('click', () => pageImg.classList.toggle('zoomed'));
  pageImg.addEventListener('click', () => pageImg.classList.toggle('zoomed'));
  dlBtn.addEventListener('click', () => window.open('../assets/A-Great-War-Requiem.pdf', '_blank'));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.target.matches && e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) selectPage(pgIdx - 1);
    else if (e.key === 'ArrowRight' && !nextBtn.disabled) selectPage(pgIdx + 1);
  });

  // Deep link: ?m=3&p=2
  const params = new URLSearchParams(location.search);
  const mParam = parseInt(params.get('m'), 10);
  const pParam = parseInt(params.get('p'), 10);
  selectMovement((mParam >= 1 && mParam <= MOVEMENTS.length) ? mParam - 1 : 0);
  if (pParam >= 1) selectPage(pParam - 1);
})();
