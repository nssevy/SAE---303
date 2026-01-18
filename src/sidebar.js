/**
 * Module de gestion de la sidebar avec Tailwind CSS
 */

import { getPaysInfo } from "./paysData.js";
import Chart from "chart.js/auto";

/**
 * Initialise la sidebar dans le DOM
 */
export function initialiserSidebar() {
  const html = `
    <div id="sidebar" class="fixed inset-0 z-50 pointer-events-none">
      <div id="sidebar-overlay" class="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300"></div>
      <div id="sidebar-content" class="absolute top-0 right-0 w-96 h-full bg-zinc-900 shadow-2xl translate-x-full transition-transform duration-300 flex flex-col">
        <button id="sidebar-close" class="absolute top-5 right-5 text-white text-3xl hover:text-blue-400 transition-colors">&times;</button>
        
        <div class="p-6 border-b border-white/10">
          <h2 id="sidebar-nom" class="text-2xl font-semibold text-white mb-2"></h2>
          <span id="sidebar-code" class="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded tracking-wider"></span>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 class="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Évolution 2000-2010</h3>
            <canvas id="chart" class="w-full h-48"></canvas>
          </div>
          
          <div>
            <h3 class="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Données par année</h3>
            <div class="max-h-72 overflow-y-auto border border-white/10 rounded">
              <table class="w-full">
                <thead class="sticky top-0 bg-zinc-800">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Année</th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Naissances</th>
                  </tr>
                </thead>
                <tbody id="tbody"></tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-white/10 bg-black/30 flex justify-between items-center">
          <span class="text-sm font-semibold text-white/70 uppercase tracking-wider">Total 2000-2010</span>
          <span id="total" class="text-2xl font-bold text-blue-400"></span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  document.getElementById("sidebar-close").onclick = fermerSidebar;
  document.getElementById("sidebar-overlay").onclick = fermerSidebar;
}

/**
 * Ouvre la sidebar avec les données du pays
 */
export function ouvrirSidebar(codeISO, donneesCompletes) {
  const info = getPaysInfo(codeISO, donneesCompletes);

  if (!info?.donneesNaissances?.length) return;

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

  // Afficher
  document.getElementById("sidebar").classList.add("pointer-events-auto");
  document.getElementById("sidebar-overlay").classList.remove("opacity-0");
  document
    .getElementById("sidebar-content")
    .classList.remove("translate-x-full");
}

/**
 * Ferme la sidebar
 */
function fermerSidebar() {
  document.getElementById("sidebar").classList.remove("pointer-events-auto");
  document.getElementById("sidebar-overlay").classList.add("opacity-0");
  document.getElementById("sidebar-content").classList.add("translate-x-full");
}
