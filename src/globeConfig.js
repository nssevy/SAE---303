/**
 * Configuration et initialisation du globe 3D
 * Utilise Globe.gl pour afficher les pays avec leurs données de naissances
 */

import Globe from "globe.gl";

/**
 * Crée et configure le globe 3D
 * @param {string} containerId - ID du conteneur HTML pour le globe
 * @returns {Object} - Instance du globe
 */
export function creerGlobe(containerId = "globe-container") {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Conteneur "${containerId}" introuvable`);
    return null;
  }

  // Créer l'instance du globe
  const globe = Globe()(container)
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
    .backgroundColor("#000000") // Fond noir uni, sans étoiles
    .width(container.offsetWidth)
    .height(container.offsetHeight);

  return globe;
}

/**
 * Charge les polygones des pays depuis un fichier GeoJSON
 * @returns {Promise<Object>} - Données GeoJSON des pays
 */
export async function chargerPolygonesPays() {
  try {
    const response = await fetch(
      "https://unpkg.com/world-atlas@2/countries-110m.json"
    );

    if (!response.ok) {
      throw new Error(`Erreur de chargement GeoJSON: ${response.status}`);
    }

    const topoData = await response.json();

    // Convertir TopoJSON en GeoJSON
    const countries = topojson.feature(topoData, topoData.objects.countries);

    return countries;
  } catch (error) {
    console.error("Erreur chargement polygones:", error);
    throw error;
  }
}

/**
 * Configure les polygones des pays sur le globe
 * @param {Object} globe - Instance du globe
 * @param {Object} geoJsonData - Données GeoJSON des pays
 * @param {Object} donneesCompletes - Données de naissances avec coordonnées
 */
export function configurerPolygonesPays(globe, geoJsonData, donneesCompletes) {
  // Créer un Set des codes ISO présents dans le dataset pour une recherche rapide
  const codesISODataset = new Set(donneesCompletes.codesISO);

  // État pour suivre le pays survolé
  let paysSurvole = null;

  globe
    .polygonsData(geoJsonData.features)
    .polygonAltitude(0.01)
    .polygonCapColor((polygon) => {
      // Récupérer le code ISO du pays
      const codeISO = polygon.properties.iso_a2 || polygon.properties.ISO_A2;

      // Vérifier si c'est le pays survolé
      const estSurvole = paysSurvole === polygon.properties.name;

      // Si le pays est dans notre dataset
      if (codesISODataset.has(codeISO)) {
        return estSurvole
          ? "rgba(100, 150, 220, 0.9)"
          : "rgba(70, 130, 200, 0.7)";
      }

      // Sinon, pays gris
      return estSurvole ? "rgba(100, 100, 100, 0.7)" : "rgba(70, 70, 70, 0.5)";
    })
    .polygonSideColor(() => "rgba(50, 50, 50, 100")")
    .polygonStrokeColor(() => "#000000")
    .polygonLabel(
      ({ properties: d }) => `
      <div style="background: rgba(0,0,0,0.85); padding: 8px 12px; border-radius: 4px; font-family: sans-serif; font-size: 14px;">
        ${d.name}
      </div>
    `
    )
    .onPolygonHover((polygon) => {
      paysSurvole = polygon ? polygon.properties.name : null;
      document.body.style.cursor = polygon ? "pointer" : "default";
    })
    .onPolygonClick((polygon) => {
      const codeISO = polygon.properties.iso_a2 || polygon.properties.ISO_A2;
      console.log("Pays cliqué:", polygon.properties.name, "ISO:", codeISO);
      // Ici tu pourras ajouter l'affichage du sidebar
    });
}

/**
 * Configure l'apparence et les contrôles du globe
 * @param {Object} globe - Instance du globe
 */
export function configurerApparence(globe) {
  // Point de vue initial
  globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);

  // Contrôles
  globe.controls().autoRotate = false;
  globe.controls().enableZoom = true;
}
