/* ============ CONFIG ============ */
const SHEET_ID     = '1GE27eBd1fHndh4eRhf-kYtbF28HmfvH1908HUgnfQms'; // ← remplace si besoin
const ACTUS_GID    = '0';            // onglet « actus »
const SECTIONS_GID = '197731547';    // onglet « sections »

/* -------- Helpers -------- */
const csvUrl = gid =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&t=${Date.now()}`;

const toParagraphs = txt =>
  txt.trim()
     .split(/\n\s*\n/)                 // paragraphe = ligne vide
     .map(p => `<p>${p.trim()}</p>`)
     .join('');

/* -------- ACTUALITÉS -------- */
async function loadNews(){
  const res  = await fetch(csvUrl(ACTUS_GID));
  const rows = Papa.parse(await res.text(), {header:true}).data
                 .filter(r => r.Titre || r.Title);

  const ul = document.getElementById('news-list');
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
  const text = await res.text();                             // ✅ lecture unique

  const rows = Papa.parse(text, {header:true}).data
                 .filter(r => r.id);

  if (!rows.length){
    console.warn('Aucune ligne trouvée dans l’onglet « sections ».');
    return;
  }

  rows.forEach((r, i) => {
    const sec = document.getElementById(r.id);
    if (!sec){
      console.warn(`⚠️ Section #${r.id} absente du HTML`);
      return;
    }

    /* structure + classes (remplace le placeholder) */
    sec.classList.remove('section-placeholder');
    sec.classList.add('md:grid', 'md:grid-cols-2', 'gap-10', 'py-16', 'section-loaded');
    if (i % 2) sec.classList.add('md:[&>*:first-child]:order-2');

    /* contenu texte */
    const article = document.createElement('article');
    article.className = 'prose max-w-none';
    article.innerHTML = `
      <h2 class="!mt-0">${r.titre}</h2>
      ${r.sousTitre ? `<h3 class="italic -mt-2 mb-4">${r.sousTitre}</h3>` : ''}
      ${r.content ? toParagraphs(r.content) : ''}
    `;

    /* média */
    const media = document.createElement('div');
    media.className = 'media max-md:mt-6';
    if (r.image){
      media.innerHTML = `<img src="${r.image}" alt="${r.titre}" class="rounded-lg shadow">`;
    }else if (r.video){
      media.innerHTML = `<video autoplay muted loop playsinline class="rounded-lg shadow">
                           <source src="${r.video}" type="video/mp4">
                         </video>`;
    }

    sec.replaceChildren(article, media);   // injecte le contenu
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
