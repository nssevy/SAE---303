// Config du glob 3d, avec globe.gl

import Globe from "globe.gl";

/**
 * Config du globe 3D
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
    .backgroundColor("#000000")
    .width(container.offsetWidth)
    .height(container.offsetHeight);

  // Redimensionnement
  const handleResize = () => {
    globe.width(container.offsetWidth);
    globe.height(container.offsetHeight);
  };

  window.addEventListener("resize", handleResize);

  // Empêcher le scroll avec les flèches du clavier
  window.addEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    ) {
      if (document.activeElement === document.body) {
        e.preventDefault();
      }
    }
  });

  return globe;
}

/**
 * Charge les polygones des pays depuis un fichier GeoJSON
 * @returns {Promise<Object>} - Données GeoJSON des pays
 */
export async function chargerPolygonesPays() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
    );

    if (!response.ok) {
      throw new Error(`Erreur de chargement GeoJSON: ${response.status}`);
    }

    const geoData = await response.json();
    return geoData;
  } catch (error) {
    console.error("Erreur chargement polygones:", error);
    throw error;
  }
}

/**
 * Extrait le code ISO d'un pays depuis les propriétés GeoJSON
 * Utilise ISO_A2_EH comme fallback pour les pays comme la France et la Norvège
 */
function getCodeISO(properties) {
  const iso = properties.iso_a2 || properties.ISO_A2;
  // Si le code est invalide (-99, null, etc.), utiliser ISO_A2_EH
  if (!iso || iso === "-99" || iso === -99) {
    return properties.ISO_A2_EH;
  }
  return iso;
}

/**
 * Configure les polygones des pays sur le globe
 * @param {Object} globe - Instance du globe
 * @param {Object} geoJsonData - Données GeoJSON des pays
 * @param {Object} donneesCompletes - Données de naissances avec coordonnées
 */
export function configurerPolygonesPays(
  globe,
  geoJsonData,
  donneesCompletes,
  onClickCallback
) {
  // Créer un Set des codes ISO présents dans le dataset pour une recherche rapide
  const codesISODataset = new Set(donneesCompletes.codesISO);

  // État pour suivre le pays survolé
  let paysSurvole = null;

  globe
    .polygonsData(geoJsonData.features)
    .polygonAltitude(0.01)
    .polygonCapColor((polygon) => {
      // Récupérer le code ISO du pays (avec fallback)
      const codeISO = getCodeISO(polygon.properties);

      // Vérifier si c'est le pays survolé
      const estSurvole = paysSurvole === polygon.properties.NAME;

      // Si le pays est dans notre dataset
      if (codesISODataset.has(codeISO)) {
        return estSurvole
          ? "rgba(100, 150, 220, 0.9)"
          : "rgba(70, 130, 200, 0.7)";
      }

      // Sinon, pays gris
      return estSurvole ? "rgba(100, 100, 100, 0.7)" : "rgba(70, 70, 70, 0.5)";
    })
    .polygonSideColor(() => "rgba(50, 50, 50, 0.5)")
    .polygonStrokeColor(() => "#000000")
    .polygonLabel(
      ({ properties: d }) => `
      <div style="background: rgba(0,0,0,0.85); padding: 8px 12px; border-radius: 4px; font-family: sans-serif; font-size: 14px;">
        ${d.NAME}
      </div>
    `
    )
    .onPolygonHover((polygon) => {
      paysSurvole = polygon ? polygon.properties.NAME : null;
      document.body.style.cursor = polygon ? "pointer" : "default";
    })
    .onPolygonClick(onClickCallback);
}

/**
 * Zoom vers un pays avec animation
 * @param {Object} globe - Instance du globe
 * @param {Array} coords - Coordonnées [lat, lng]
 */
export function zoomVersPays(globe, coords) {
  if (!coords) return;
  globe.pointOfView({ lat: coords[0], lng: coords[1], altitude: 1.5 }, 1000);
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
