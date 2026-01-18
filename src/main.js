import { chargerDonneesNaissances } from "./paysData.js";
import {
  creerGlobe,
  chargerPolygonesPays,
  configurerPolygonesPays,
  configurerApparence,
} from "./globeConfig.js";

// Fonction principale
async function init() {
  const loadingScreen = document.getElementById("loading");

  try {
    // Étape 1 : Charger les données de naissances avec coordonnées
    const donneesCompletes = await chargerDonneesNaissances();

    // Étape 2 : Créer le globe
    const globe = creerGlobe("globe-container");

    if (!globe) {
      throw new Error("Impossible de créer le globe");
    }

    // Étape 3 : Charger les polygones des pays
    const geoJsonData = await chargerPolygonesPays();

    // Étape 4 : Configurer les polygones sur le globe
    configurerPolygonesPays(globe, geoJsonData, donneesCompletes);

    // Étape 5 : Configurer l'apparence
    configurerApparence(globe);

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
