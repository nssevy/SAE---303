import Globe from "globe.gl";
import { getContinent, getColor } from "./continentMapping.js";

export async function createGlobe(containerId, countryData, onCountryClick) {
  // Charger les données géographiques des pays
  const countries = await fetch(
    "https://unpkg.com/world-atlas@2/countries-110m.json"
  )
    .then((res) => res.json())
    .then((data) => {
      // Convertir TopoJSON en GeoJSON
      return topojson.feature(data, data.objects.countries).features;
    });

  // Créer le globe
  const globe = Globe()
    .globeImageUrl(null) // Pas de texture réaliste
    .backgroundColor("#0f172a") // Bleu foncé élégant
    .showAtmosphere(true)
    .atmosphereColor("#60a5fa")
    .atmosphereAltitude(0.2)

    // Configuration des polygones des pays
    .polygonsData(countries)
    .polygonAltitude((d) => {
      const countryISO = getCountryISO(d.properties.name, countryData);
      return countryISO && countryData[countryISO] ? 0.06 : 0.002;
    })
    .polygonCapColor((d) => {
      const countryISO = getCountryISO(d.properties.name, countryData);
      if (countryISO && countryData[countryISO]) {
        return getColor(countryISO);
      }
      return "rgba(100, 116, 139, 0.2)"; // Gris semi-transparent pour pays sans données
    })
    .polygonSideColor(() => "rgba(0, 0, 0, 0.3)")
    .polygonStrokeColor(() => "rgba(255, 255, 255, 0.1)") // Contours blancs subtils
    .polygonLabel((d) => {
      const countryISO = getCountryISO(d.properties.name, countryData);
      if (countryISO && countryData[countryISO]) {
        const country = countryData[countryISO];
        return `
          <div style="background: rgba(15, 23, 42, 0.95); padding: 12px; border-radius: 8px; color: white; max-width: 250px; border: 1px solid rgba(96, 165, 250, 0.3);">
            <strong style="font-size: 16px;">${country.name}</strong><br/>
            <span style="color: ${getColor(countryISO)}">● ${getContinent(
          countryISO
        )}</span><br/>
            <strong style="color: #60a5fa;">Naissances totales (2000-2010):</strong><br/>
            <span style="font-size: 18px; font-weight: bold;">${country.totalBirths.toLocaleString(
              "fr-FR"
            )}</span>
          </div>
        `;
      }
      return `<div style="background: rgba(15, 23, 42, 0.9); padding: 8px; border-radius: 5px; color: #94a3b8;">${d.properties.name}</div>`;
    })
    .onPolygonClick((d) => {
      const countryISO = getCountryISO(d.properties.name, countryData);
      if (countryISO && countryData[countryISO] && onCountryClick) {
        onCountryClick(countryISO);
      }
    });

  // Monter le globe dans le conteneur
  globe(document.getElementById(containerId));

  // Auto-rotation
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;

  return globe;
}

// Fonction helper pour matcher le nom du pays avec l'ISO
function getCountryISO(countryName, countryData) {
  // Mapping des noms de pays (GeoJSON) vers codes ISO
  const nameMapping = {
    France: "FR",
    Germany: "DE",
    Italy: "IT",
    Spain: "ES",
    "United Kingdom": "GB",
    "United States of America": "US",
    Canada: "CA",
    China: "CN",
    Japan: "JP",
    Russia: "RU",
    Brazil: "BR",
    India: "IN",
    Australia: "AU",
    Mexico: "MX",
    "South Korea": "KR",
    Turkey: "TR",
    Poland: "PL",
    Netherlands: "NL",
    Belgium: "BE",
    Sweden: "SE",
    Switzerland: "CH",
    Norway: "NO",
    Denmark: "DK",
    Finland: "FI",
    Portugal: "PT",
    Greece: "GR",
    Czechia: "CZ",
    "Czech Republic": "CZ",
    Hungary: "HU",
    Romania: "RO",
    Bulgaria: "BG",
    Ukraine: "UA",
    Belarus: "BY",
    Egypt: "EG",
    "South Africa": "ZA",
    Chile: "CL",
    Argentina: "AR",
    Colombia: "CO",
    Peru: "PE",
    Philippines: "PH",
    Thailand: "TH",
    Vietnam: "VN",
    Malaysia: "MY",
    Singapore: "SG",
    Indonesia: "ID",
    Pakistan: "PK",
    Iran: "IR",
    Iraq: "IQ",
    "Saudi Arabia": "SA",
    Israel: "IL",
    "New Zealand": "NZ",
    Ireland: "IE",
    Austria: "AT",
    Slovakia: "SK",
    Slovenia: "SI",
    Croatia: "HR",
    Serbia: "RS",
    Lithuania: "LT",
    Latvia: "LV",
    Estonia: "EE",
    Cuba: "CU",
    Cyprus: "CY",
    Iceland: "IS",
    Luxembourg: "LU",
    Malta: "MT",
    Liechtenstein: "LI",
    Montenegro: "ME",
    "North Macedonia": "MK",
    Macedonia: "MK",
    Moldova: "MD",
    "San Marino": "SM",
    "Costa Rica": "CR",
    Panama: "PA",
    Guatemala: "GT",
    "El Salvador": "SV",
    Jamaica: "JM",
    "Trinidad and Tobago": "TT",
    Suriname: "SR",
    Uruguay: "UY",
    Venezuela: "VE",
    Bolivia: "BO",
    Kazakhstan: "KZ",
    Uzbekistan: "UZ",
    Kyrgyzstan: "KG",
    Mongolia: "MN",
    Georgia: "GE",
    Lebanon: "LB",
    Tunisia: "TN",
    Libya: "LY",
    Ghana: "GH",
    Mauritius: "MU",
    Seychelles: "SC",
    Maldives: "MV",
    Fiji: "FJ",
    Tonga: "TO",
    Palau: "PW",
    Kuwait: "KW",
    Qatar: "QA",
    "Sri Lanka": "LK",
    "Puerto Rico": "PR",
    "Hong Kong": "CN",
    Macao: "CN",
    "New Caledonia": "FR",
    "French Guiana": "FR",
    Guadeloupe: "FR",
    Martinique: "FR",
    Réunion: "FR",
    Aruba: "NL",
    Curaçao: "NL",
    Greenland: "DK",
    "Faroe Islands": "DK",
    Åland: "FI",
    Anguilla: "GB",
    "Cayman Islands": "GB",
    Gibraltar: "GB",
    Montserrat: "GB",
    "Turks and Caicos Islands": "GB",
    "British Virgin Islands": "GB",
    Guernsey: "GB",
    "Cook Islands": "CK",
    Niue: "NU",
    Guam: "GU",
    "United States Virgin Islands": "PR",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
  };

  return nameMapping[countryName] || null;
}

// Fonction pour zoomer sur un pays
export function zoomToCountry(globe, lat, lng) {
  globe.pointOfView(
    {
      lat: lat,
      lng: lng,
      altitude: 1.5,
    },
    1000
  );
}
