// Mapping des codes ISO pays vers les continents
export const continentMapping = {
  // Europe
  FI: "Europe",
  BY: "Europe",
  BG: "Europe",
  HR: "Europe",
  CY: "Europe",
  CZ: "Europe",
  DK: "Europe",
  EE: "Europe",
  FR: "Europe",
  DE: "Europe",
  GR: "Europe",
  HU: "Europe",
  IS: "Europe",
  IE: "Europe",
  IT: "Europe",
  LV: "Europe",
  LI: "Europe",
  LT: "Europe",
  LU: "Europe",
  MT: "Europe",
  MD: "Europe",
  ME: "Europe",
  NL: "Europe",
  MK: "Europe",
  NO: "Europe",
  PL: "Europe",
  PT: "Europe",
  RO: "Europe",
  RU: "Europe",
  SM: "Europe",
  RS: "Europe",
  SK: "Europe",
  SI: "Europe",
  ES: "Europe",
  SE: "Europe",
  CH: "Europe",
  GB: "Europe",
  UA: "Europe",
  GE: "Europe",

  // Amériques
  CA: "Americas",
  CL: "Americas",
  CR: "Americas",
  CU: "Americas",
  SV: "Americas",
  GT: "Americas",
  JM: "Americas",
  PA: "Americas",
  PR: "Americas",
  SR: "Americas",
  TT: "Americas",
  US: "Americas",
  UY: "Americas",
  VE: "Americas",
  LC: "Americas",
  VC: "Americas",

  // Asie
  CN: "Asia",
  CK: "Asia",
  FJ: "Asia",
  HK: "Asia",
  IR: "Asia",
  IL: "Asia",
  JP: "Asia",
  KZ: "Asia",
  KW: "Asia",
  KG: "Asia",
  LB: "Asia",
  MY: "Asia",
  MV: "Asia",
  MN: "Asia",
  NU: "Asia",
  PK: "Asia",
  PW: "Asia",
  PH: "Asia",
  QA: "Asia",
  KR: "Asia",
  SG: "Asia",
  LK: "Asia",
  TO: "Asia",
  TR: "Asia",
  UZ: "Asia",

  // Afrique
  EG: "Africa",
  GH: "Africa",
  LY: "Africa",
  MU: "Africa",
  SC: "Africa",
  TN: "Africa",

  // Océanie
  NC: "Oceania",
  NZ: "Oceania",
  GU: "Oceania",
};

// Couleurs par continent
export const continentColors = {
  Europe: "#4169E1", // Bleu royal
  Americas: "#32CD32", // Vert citron
  Asia: "#FF6347", // Rouge tomate
  Africa: "#FFD700", // Or
  Oceania: "#9370DB", // Violet moyen
};

// Fonction helper pour obtenir le continent d'un pays
export function getContinent(isoCode) {
  return continentMapping[isoCode] || "Unknown";
}

// Fonction helper pour obtenir la couleur d'un pays
export function getColor(isoCode) {
  const continent = getContinent(isoCode);
  return continentColors[continent] || "#CCCCCC";
}
