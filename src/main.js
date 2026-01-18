import { chargerDonneesNaissances } from "./paysData.js";
import {
  creerGlobe,
  chargerPolygonesPays,
  configurerPolygonesPays,
  configurerApparence,
  zoomVersPays,
} from "./globeConfig.js";
import { initialiserSidebar, ouvrirSidebar } from "./sideBar.js";
import { initialiserSearchBar } from "./searchBar.js";

// Fonction principale
async function init() {
  const loadingScreen = document.getElementById("loading");

  try {
    // Étape 1 : Charger les données de naissances avec coordonnées
    const donneesCompletes = await chargerDonneesNaissances();

    // Étape 2 : Initialiser la sidebar
    initialiserSidebar();

    // Étape 3 : Créer le globe
    const globe = creerGlobe("globe-container");

    if (!globe) {
      throw new Error("Impossible de créer le globe");
    }

    // Étape 4 : Charger les polygones des pays
    const geoJsonData = await chargerPolygonesPays();

    // Étape 5 : Configurer les polygones sur le globe
    configurerPolygonesPays(globe, geoJsonData, donneesCompletes, (polygon) => {
      // Récupérer le code ISO (avec fallback sur ISO_A2_EH pour France, Norvège, etc.)
      let codeISO = polygon.properties.iso_a2 || polygon.properties.ISO_A2;
      if (!codeISO || codeISO === "-99" || codeISO === -99) {
        codeISO = polygon.properties.ISO_A2_EH;
      }
      ouvrirSidebar(codeISO, donneesCompletes);
    });

    // Étape 6 : Configurer l'apparence
    configurerApparence(globe);

    // Étape 7 : Initialiser la barre de recherche
    const listePays = [...new Set(donneesCompletes.donneesNaissances.map((r) => r.ISO_ETAT))].map(
      (iso) => ({
        codeISO: iso,
        nom: donneesCompletes.donneesNaissances.find((r) => r.ISO_ETAT === iso)?.NOM_COURT || iso,
      })
    );

    initialiserSearchBar(listePays, (codeISO) => {
      const coords = donneesCompletes.coordonnees[codeISO];
      zoomVersPays(globe, coords);
      ouvrirSidebar(codeISO, donneesCompletes);
    });

    // Masquer l'écran de chargement
    loadingScreen.classList.add("hidden");

    console.log("Application initialisée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    loadingScreen.innerHTML = `
      <div class="spinner"></div>
      <p style="color: #ff4444;">Erreur de chargement</p>
      <p style="font-size: 14px; margin-top: 10px;">${error.message}</p>
    `;
  }
}

// Lancer l'application au chargement de la page
init();
