// Traitement et agrégation des données de naissances

export async function loadBirthData() {
  const response = await fetch("/naissances-par-pays-2000-2010.json");
  const data = await response.json();
  return data;
}

// Agréger les données par pays (total 2000-2010)
export function aggregateByCountry(data) {
  const countryData = {};

  data.forEach((entry) => {
    const country = entry.NOM_COURT;
    const iso = entry.ISO_ETAT;
    const value = entry.Value;

    if (!countryData[iso]) {
      countryData[iso] = {
        name: country,
        iso: iso,
        totalBirths: 0,
        yearlyData: [],
        years: [],
      };
    }

    countryData[iso].totalBirths += value;
    countryData[iso].yearlyData.push({
      year: entry.Year,
      births: value,
    });
    countryData[iso].years.push(entry.Year);
  });

  // Trier les données annuelles par année
  Object.values(countryData).forEach((country) => {
    country.yearlyData.sort((a, b) => a.year - b.year);
    country.years.sort((a, b) => a - b);
  });

  return countryData;
}

// Obtenir les données d'un pays spécifique
export function getCountryData(countryData, isoCode) {
  return countryData[isoCode] || null;
}

// Obtenir le top N des pays par naissances
export function getTopCountries(countryData, n = 10) {
  return Object.values(countryData)
    .sort((a, b) => b.totalBirths - a.totalBirths)
    .slice(0, n);
}

// Calculer les statistiques d'un pays
export function getCountryStats(country) {
  const births = country.yearlyData.map((d) => d.births);

  return {
    total: country.totalBirths,
    average: Math.round(country.totalBirths / country.yearlyData.length),
    min: Math.min(...births),
    max: Math.max(...births),
    minYear: country.yearlyData.find((d) => d.births === Math.min(...births))
      .year,
    maxYear: country.yearlyData.find((d) => d.births === Math.max(...births))
      .year,
  };
}
