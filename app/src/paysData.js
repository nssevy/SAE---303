// Charge les données de naissances et récupère les coordonnées géographiques

import { getCoordonneesPlusieurs } from "./geocodage.js";

/**
 * Charge les données de naissances et récupère les coordonnées de tous les pays
 * @returns {Promise<Object>} - Objet contenant les données et coordonnées des pays
 */
export async function chargerDonneesNaissances() {
  try {
    // Étape 1 : Charger le fichier JSON des naissances
    const response = await fetch("/naissances-par-pays-2000-2010.json");
    if (!response.ok) {
      throw new Error(`Erreur de chargement: ${response.status}`);
    }

    const donneesNaissances = await response.json();

    // Étape 2 : Extraire les codes ISO uniques
    const codesISOUniques = [
      ...new Set(donneesNaissances.map((record) => record.ISO_ETAT)),
    ];

    // Étape 3 : Récupérer les coordonnées de tous les pays
    const coordonneesPays = await getCoordonneesPlusieurs(codesISOUniques);

    // Étape 4 : Créer une structure de données combinée
    const donneesCompletes = {
      donneesNaissances: donneesNaissances,
      coordonnees: coordonneesPays,
      nombrePays: codesISOUniques.length,
      codesISO: codesISOUniques,
    };

    console.log(`Données chargées : ${donneesCompletes.nombrePays} pays`);

    return donneesCompletes;
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    throw error;
  }
}

/**
 * Récupère les données d'un pays spécifique avec ses coordonnées
 * @param {string} codeISO - Code ISO du pays
 * @param {Object} donneesCompletes - Objet retourné par chargerDonneesNaissances()
 * @returns {Object} - Informations du pays avec coordonnées
 */
export function getPaysInfo(codeISO, donneesCompletes) {
  const donneesNaissancePays = donneesCompletes.donneesNaissances.filter(
    (record) => record.ISO_ETAT === codeISO
  );

  return {
    codeISO: codeISO,
    nom: donneesNaissancePays[0]?.NOM_COURT || "Nom inconnu",
    coordonnees: donneesCompletes.coordonnees[codeISO],
    donneesNaissances: donneesNaissancePays,
  };
}
