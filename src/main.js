import "./index.css";
import { loadBirthData, aggregateByCountry } from "./dataProcessor.js";
import { createGlobe } from "./globe.js";
import { createSidebar } from "./sidebar.js";

// Structure HTML
document.querySelector("#app").innerHTML = `
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <header class="bg-slate-800 shadow-lg border-b border-slate-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-4xl font-bold text-white">
          🌍 Naissances Mondiales 2000-2010
        </h1>
        <p class="text-slate-300 mt-2">
          Visualisation interactive des données de naissances par pays
        </p>
      </div>
    </header>

    <!-- Main Content -->
   <!-- Main Content -->
<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Globe Container -->
    <div class="lg:col-span-2">
      <div class="bg-slate-800 rounded-lg shadow-2xl p-4 border border-slate-700" style="position: relative; z-index: 1;">
        <div id="globe-container" style="height: 600px;"></div>
        <div class="mt-4 text-sm text-slate-400 text-center">
          <p>🖱️ Cliquez sur un pays pour voir les détails • Faites glisser pour pivoter</p>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div style="position: relative; z-index: 10;">
      <div id="sidebar" class="hidden">
        <!-- Le contenu sera injecté dynamiquement -->
      </div>
      
      <!-- Instructions -->
      <div id="instructions" class="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 class="text-lg font-semibold text-blue-400 mb-3">
          Comment utiliser
        </h3>
        <ul class="space-y-2 text-sm text-slate-300">
          <li>Le globe tourne automatiquement</li>
          <li>Cliquez sur un pays pour voir ses statistiques</li>
          <li>Les couleurs représentent les continents</li>
          <li>L'élévation = volume de naissances</li>
        </ul>
        
        <div class="mt-4 pt-4 border-t border-slate-700">
          <h4 class="font-semibold text-blue-400 mb-2">Légende des couleurs</h4>
          <div class="space-y-1 text-sm text-slate-300">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background: #4169E1;"></div>
              <span>Europe</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background: #32CD32;"></div>
              <span>Amériques</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background: #FF6347;"></div>
              <span>Asie</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background: #FFD700;"></div>
              <span>Afrique</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background: #9370DB;"></div>
              <span>Océanie</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
`;

// Initialisation
async function init() {
  try {
    // Charger les données
    const rawData = await loadBirthData();
    const countryData = aggregateByCountry(rawData);

    // Créer le globe
    const globe = await createGlobe("globe-container", countryData, (iso) => {
      // Callback lors du clic sur un pays
      document.getElementById("instructions").classList.add("hidden");
      createSidebar(countryData, iso);
    });

    console.log("Globe initialisé avec succès!");
    console.log(`Nombre de pays: ${Object.keys(countryData).length}`);
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    document.getElementById("globe-container").innerHTML = `
      <div class="text-center text-red-600 p-8">
        <p class="text-xl font-bold">Erreur de chargement</p>
        <p class="mt-2">${error.message}</p>
      </div>
    `;
  }
}

init();
