// Barre de recherche avec autocomplétion

let listePays = [];
let onSelectCallback = null;

/**
 * Initialise la barre de recherche
 * @param {Array} pays - Liste des pays avec {codeISO, nom}
 * @param {Function} onSelect - Callback appelé avec (codeISO) quand un pays est sélectionné
 */
export function initialiserSearchBar(pays, onSelect) {
  listePays = pays;
  onSelectCallback = onSelect;

  // Version desktop (fixe en bas, centrée dans la zone du globe)
  const htmlDesktop = `
    <div id="searchbar-desktop" class="hidden md:block fixed bottom-6 left-6 right-[25.5rem] z-50">
      <div class="mx-auto max-w-2xl">
        <div id="suggestions-desktop" class="hidden mb-2 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto"></div>
        <div class="relative">
          <input
            type="text"
            id="search-input-desktop"
            placeholder="Rechercher un pays..."
            class="w-full px-4 py-3 pl-11 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>
  `;

  // Version mobile (dans le conteneur de la sidebar)
  const htmlMobile = `
    <div id="searchbar-mobile" class="w-full">
      <div id="suggestions-mobile" class="hidden mb-2 bg-zinc-800 border border-white/10 rounded-lg overflow-hidden shadow-xl max-h-40 overflow-y-auto"></div>
      <div class="relative">
        <input
          type="text"
          id="search-input-mobile"
          placeholder="Rechercher un pays..."
          class="w-full px-3 py-2.5 pl-10 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>
  `;

  // Insérer la version desktop dans le body
  document.body.insertAdjacentHTML("beforeend", htmlDesktop);

  // Insérer la version mobile dans le conteneur de la sidebar
  const mobileContainer = document.getElementById("searchbar-mobile-container");
  if (mobileContainer) {
    mobileContainer.innerHTML = htmlMobile;
  }

  // Configurer les événements pour les deux versions
  setupSearchEvents("search-input-desktop", "suggestions-desktop");
  setupSearchEvents("search-input-mobile", "suggestions-mobile");
}

function setupSearchEvents(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);

  if (!input || !suggestions) return;

  input.addEventListener("input", () =>
    filtrerPays(input.value, suggestions, inputId)
  );
  input.addEventListener("focus", () => {
    if (input.value) filtrerPays(input.value, suggestions, inputId);
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(`#${inputId}`) &&
      !e.target.closest(`#${suggestionsId}`)
    ) {
      suggestions.classList.add("hidden");
    }
  });
}

function filtrerPays(recherche, container, inputId) {
  if (!recherche.trim()) {
    container.classList.add("hidden");
    return;
  }

  const terme = recherche
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const resultats = listePays
    .filter((p) => {
      const nom = p.nom
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return nom.includes(terme) || p.codeISO.toLowerCase().includes(terme);
    })
    .slice(0, 8);

  if (resultats.length === 0) {
    container.innerHTML = `<div class="px-3 py-2.5 text-white/50 text-sm">Aucun résultat</div>`;
  } else {
    container.innerHTML = resultats
      .map(
        (p) => `
        <button class="w-full px-3 py-2.5 text-left hover:bg-blue-500/20 transition-colors flex items-center justify-between" data-iso="${p.codeISO}">
          <span class="text-white text-sm">${p.nom}</span>
          <span class="text-xs text-white/40">${p.codeISO}</span>
        </button>
      `
      )
      .join("");

    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const iso = btn.dataset.iso;
        document.getElementById(inputId).value = "";
        container.classList.add("hidden");
        if (onSelectCallback) onSelectCallback(iso);
      });
    });
  }

  container.classList.remove("hidden");
}
