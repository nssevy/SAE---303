/**
 * Module de géocodage - Récupération des coordonnées géographiques des pays
 * Utilise l'API REST Countries avec les codes ISO pour une meilleure fiabilité
 */

/**
 * Récupère les coordonnées (latitude, longitude) d'un pays via son code ISO
 * @param {string} codeISO - Code ISO 3166-1 alpha-2 du pays (ex: "FR", "CY", "DE")
 * @returns {Promise<Array|null>} - Tableau [latitude, longitude] ou null en cas d'erreur
 */
export async function getCoordonneesPaysParISO(codeISO) {
  const url = `https://restcountries.com/v3.1/alpha/${codeISO}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    // L'API retourne un tableau avec un seul pays pour les recherches par code ISO
    const pays = data[0];
    const coordonnees = pays.latlng;

    return coordonnees; // Retourne [latitude, longitude]
  } catch (error) {
    console.error(`Erreur géocodage pour "${codeISO}":`, error.message);
    return null;
  }
}

/**
 * Récupère les coordonnées de plusieurs pays en une seule fois
 * @param {Array<string>} codesISO - Tableau de codes ISO (ex: ["FR", "DE", "ES"])
 * @returns {Promise<Object>} - Objet avec les codes ISO comme clés et les coordonnées comme valeurs
 */
export async function getCoordonneesPlusieurs(codesISO) {
  const resultats = {};

  for (const code of codesISO) {
    const coords = await getCoordonneesPaysParISO(code);
    resultats[code] = coords;

    // Petite pause pour ne pas surcharger l'API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return resultats;
}
