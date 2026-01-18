import { getPaysInfo } from "./paysData.js";
import Chart from "chart.js/auto";

export function initialiserSidebar() {
  const html = `
    <div id="sidebar" class="fixed bottom-0 left-0 right-0 h-[50vh] md:top-0 md:left-auto md:right-0 md:bottom-0 md:w-96 md:h-full bg-zinc-900 shadow-2xl flex flex-col z-40">

      <!-- Si aucun pays n'est séléctioné -->
      <div id="sidebar-defaut" class="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center">
        <div class="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
          <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 class="text-lg md:text-xl font-semibold text-white mb-2">Sélectionnez un pays</h2>
        <p class="text-white/50 text-xs md:text-sm">Cliquez sur un pays pour voir ses statistiques</p>

        <!-- Conteneur pour la searchbar sur mobile -->
        <div id="searchbar-mobile-container" class="md:hidden mt-4 w-full"></div>
      </div>

      <!-- Conteneur pays -->
      <div id="sidebar-pays" class="hidden flex-col h-full overflow-hidden">
        <div class="p-3 md:p-6 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2 md:block">
            <h2 id="sidebar-nom" class="text-lg md:text-2xl font-semibold text-white md:mb-2"></h2>
            <span id="sidebar-code" class="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded tracking-wider"></span>
          </div>
          <!-- Bouton fermer (mobile uniquement) -->
          <button id="sidebar-close" class="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6">
          <!-- Layout flex horizontal sur mobile, vertical sur desktop -->
          <div class="flex flex-col md:flex-col gap-4">
            <div class="flex-1">
              <h3 class="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 md:mb-3">Évolution 2000-2010</h3>
              <div class="h-32 md:h-48 relative">
                <canvas id="chart"></canvas>
              </div>
            </div>

            <div class="flex-1">
              <h3 class="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 md:mb-3">Données par année</h3>
              <div class="max-h-32 md:max-h-72 overflow-y-auto border border-white/10 rounded">
                <table class="w-full">
                  <thead class="sticky top-0 bg-zinc-800">
                    <tr>
                      <th class="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Année</th>
                      <th class="px-2 md:px-3 py-1.5 md:py-2 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Naissances</th>
                    </tr>
                  </thead>
                  <tbody id="tbody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 md:p-6 border-t border-white/10 bg-black/30 flex justify-between items-center">
          <span class="text-xs md:text-sm font-semibold text-white/70 uppercase tracking-wider">Total 2000-2010</span>
          <span id="total" class="text-lg md:text-2xl font-bold text-blue-400"></span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  document
    .getElementById("sidebar-close")
    .addEventListener("click", fermerSidebar);
}

// Ferme la sidebar et revient à l'état par défaut

export function fermerSidebar() {
  document.getElementById("sidebar-pays").classList.add("hidden");
  document.getElementById("sidebar-pays").classList.remove("flex");
  document.getElementById("sidebar-defaut").classList.remove("hidden");

  // Détruire le graphique si présent
  if (window.sidebarChart) {
    window.sidebarChart.destroy();
    window.sidebarChart = null;
  }
}

// Affiche les données du pays dans la sidebar

export function ouvrirSidebar(codeISO, donneesCompletes) {
  const info = getPaysInfo(codeISO, donneesCompletes);

  if (!info?.donneesNaissances?.length) return;

  // Masquer l'état par défaut, afficher le contenu pays
  document.getElementById("sidebar-defaut").classList.add("hidden");
  document.getElementById("sidebar-pays").classList.remove("hidden");
  document.getElementById("sidebar-pays").classList.add("flex");

  // Grouper par année
  const parAnnee = {};
  info.donneesNaissances.forEach((r) => {
    parAnnee[r.Year] = (parAnnee[r.Year] || 0) + r.Value;
  });

  const donnees = Object.keys(parAnnee)
    .sort()
    .map((a) => ({
      annee: parseInt(a),
      nb: parAnnee[a],
    }));

  // Mettre à jour le DOM
  document.getElementById("sidebar-nom").textContent = info.nom;
  document.getElementById("sidebar-code").textContent = codeISO;

  // Tableau
  document.getElementById("tbody").innerHTML = donnees
    .map(
      (d) =>
        `<tr class="border-b border-white/5 hover:bg-blue-500/10">
      <td class="px-3 py-2 text-white">${d.annee}</td>
      <td class="px-3 py-2 text-white">${d.nb.toLocaleString("fr-FR")}</td>
    </tr>`
    )
    .join("");

  // Total
  const total = donnees.reduce((s, d) => s + d.nb, 0);
  document.getElementById("total").textContent = total.toLocaleString("fr-FR");

  // Graphique
  const ctx = document.getElementById("chart").getContext("2d");
  if (window.sidebarChart) window.sidebarChart.destroy();

  window.sidebarChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: donnees.map((d) => d.annee),
      datasets: [
        {
          data: donnees.map((d) => d.nb),
          borderColor: "rgb(70, 130, 200)",
          backgroundColor: "rgba(70, 130, 200, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { color: "#fff", callback: (v) => v.toLocaleString("fr-FR") },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        x: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    },
  });
}
