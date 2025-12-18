import { getCountryStats } from "./dataProcessor.js";
import { getContinent, continentColors } from "./continentMapping.js";

export function createSidebar(countryData, iso) {
  const country = countryData[iso];
  if (!country) return;

  const stats = getCountryStats(country);
  const continent = getContinent(iso);
  const color = continentColors[continent];

  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("hidden");

  sidebar.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">${country.name}</h2>
          <p class="text-sm text-gray-600">Code ISO: ${iso}</p>
          <p class="text-sm font-medium" style="color: ${color}">Continent: ${continent}</p>
        </div>
        <button onclick="document.getElementById('sidebar').classList.add('hidden')" 
                class="text-gray-400 hover:text-gray-600 text-2xl">
          ×
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Statistiques 2000-2010</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-gray-600">Total</p>
              <p class="font-bold text-lg">${stats.total.toLocaleString(
                "fr-FR"
              )}</p>
            </div>
            <div>
              <p class="text-gray-600">Moyenne/an</p>
              <p class="font-bold text-lg">${stats.average.toLocaleString(
                "fr-FR"
              )}</p>
            </div>
            <div>
              <p class="text-gray-600">Maximum</p>
              <p class="font-bold">${stats.max.toLocaleString("fr-FR")}</p>
              <p class="text-xs text-gray-500">(${stats.maxYear})</p>
            </div>
            <div>
              <p class="text-gray-600">Minimum</p>
              <p class="font-bold">${stats.min.toLocaleString("fr-FR")}</p>
              <p class="text-xs text-gray-500">(${stats.minYear})</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Évolution annuelle</h3>
          <div class="space-y-2">
            ${country.yearlyData
              .map(
                (d) => `
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">${d.year}</span>
                <span class="font-medium">${d.births.toLocaleString(
                  "fr-FR"
                )}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function closeSidebar() {
  document.getElementById("sidebar").classList.add("hidden");
}
