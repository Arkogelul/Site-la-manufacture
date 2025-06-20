/* ID du classeur et gid des deux onglets */
const SHEET_ID   = '1GE27eBd1fHndh4eRhf-kYtbF28HmfvH1908HUgnfQms';
const GID_ACTU   = '0';          // onglet « Actualité »
const GID_CONTEN = '197731547';  // onglet « Contenu »

/* URL CSV (pas besoin d’API) */
const csvUrl = gid =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&t=${Date.now()}`;

/* ================= Bloc A : actualité ================= */
fetch(csvUrl(GID_ACTU))
  .then(res => res.text())
  .then(text => {
    const rows = Papa.parse(text, {header:true}).data
                   .filter(r => Object.values(r).some(v => v));        // ignore lignes vides
    const ul = document.getElementById('bloc-actu');
    ul.innerHTML = '';                                                // efface « Chargement… »

    rows.forEach(r => {
      const li = document.createElement('li');
      /* Concatène toutes les cellules de la ligne, séparées par « — » */
      li.textContent = Object.values(r).join(' — ');
      ul.appendChild(li);
    });
  })
  .catch(console.error);

/* ================= Bloc B : contenu ================= */
fetch(csvUrl(GID_CONTEN))
  .then(res => res.text())
  .then(text => {
    const rows = Papa.parse(text, {header:true}).data
                   .filter(r => Object.values(r).some(v => v));
    const div = document.getElementById('bloc-contenu');
    div.innerHTML = '';

    rows.forEach(r => {
      const p = document.createElement('p');
      /* Concatène les cellules ; tu peux cibler une colonne précise si besoin */
      p.textContent = Object.values(r).join(' ');
      div.appendChild(p);
    });
  })
  .catch(console.error);
