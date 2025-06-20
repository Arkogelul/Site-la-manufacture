/* ============ CONFIG ============ */
const SHEET_ID     = '1GE27eBd1fHndh4eRhf-kYtbF28HmfvH1908HUgnfQms'; // ID de votre classeur
const ACTUS_GID    = '0';            // onglet « actus » (premier onglet)
const SECTIONS_GID = '197731574';    // gid réel de l’onglet « sections »

/* -------- helpers -------- */
const csvUrl = gid =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&t=${Date.now()}`;

const toParagraphs = txt =>
  txt.trim().split(/\n\s*\n/).map(p => `<p>${p.trim()}</p>`).join('');

/* -------- ACTUALITÉS -------- */
async function loadNews(){
  const res  = await fetch(csvUrl(ACTUS_GID));
  const rows = Papa.parse(await res.text(), {header:true}).data
                 .filter(r => r.Titre || r.Title);
  const ul   = document.getElementById('news-list');
  ul.innerHTML = '';
  rows.slice(0,3).forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.Date} – ${r.Titre || r.Title}`;
    ul.appendChild(li);
  });
  document.getElementById('news-date').textContent =
    'MÀJ : ' + new Date().toLocaleDateString('fr-FR');
}

/* -------- SECTIONS -------- */
async function loadSections(){
  const res  = await fetch(csvUrl(SECTIONS_GID));
  const rows = Papa.parse(await res.text(), {header:true}).data
                 .filter(r => r.id);
  const tpl  = document.getElementById('tpl-section').content;
  const box  = document.getElementById('sections');

  rows.forEach((r, i) => {
    const view  = tpl.cloneNode(true);
    const sec   = view.querySelector('section');
    const txt   = view.querySelector('article');
    const media = view.querySelector('.media');

    txt.innerHTML = `
      <h2 class="!mt-0">${r.titre}</h2>
      ${r.sousTitre ? `<h3 class="italic -mt-2 mb-4">${r.sousTitre}</h3>` : ''}
      ${toParagraphs(r.content || '')}
    `;

    if (r.image) {
      media.innerHTML = `<img src="${r.image}" alt="${r.titre}">`;
    } else if (r.video) {
      media.innerHTML = `<video autoplay muted loop playsinline>
                           <source src="${r.video}" type="video/mp4">
                         </video>`;
    }

    /* alternance vidéo gauche / droite */
    if (i % 2 === 1) sec.classList.add('md:[&>*:first-child]:order-2');

    sec.id = r.id;
    box.appendChild(view);
  });
}

/* -------- MENU MOBILE -------- */
document.getElementById('hamburger')
        .addEventListener('click', () =>
          document.getElementById('mobile-menu')
            .classList.toggle('-translate-x-full'));

document.querySelectorAll('#mobile-menu a')
        .forEach(a => a.addEventListener('click', () =>
          document.getElementById('mobile-menu')
            .classList.add('-translate-x-full')));

/* -------- GO -------- */
loadNews();
loadSections();
