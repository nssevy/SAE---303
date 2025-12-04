import Plotly from "plotly.js-dist-min";

export async function createBubbleChart(containerId) {
  const response = await fetch("/naissances-par-pays-2000-2010.json");
  const data = await response.json();

  // Mapping des continents
  const continentMapping = {
    FI: "Europe",
    BY: "Europe",
    BG: "Europe",
    HR: "Europe",
    CY: "Europe",
    CZ: "Europe",
    DK: "Europe",
    EE: "Europe",
    GE: "Europe",
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
    MK: "Europe",
    MT: "Europe",
    MD: "Europe",
    ME: "Europe",
    NL: "Europe",
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
    UA: "Europe",
    GB: "Europe",
    FR: "Europe",
    CA: "Amérique du Nord",
    US: "Amérique du Nord",
    CR: "Amérique Centrale",
    CU: "Amérique Centrale",
    SV: "Amérique Centrale",
    GT: "Amérique Centrale",
    JM: "Amérique Centrale",
    PA: "Amérique Centrale",
    TT: "Amérique Centrale",
    LC: "Amérique Centrale",
    VC: "Amérique Centrale",
    CL: "Amérique du Sud",
    SR: "Amérique du Sud",
    UY: "Amérique du Sud",
    VE: "Amérique du Sud",
    CN: "Asie",
    CK: "Asie",
    FJ: "Asie",
    IR: "Asie",
    IL: "Asie",
    JP: "Asie",
    KZ: "Asie",
    KW: "Asie",
    KG: "Asie",
    LB: "Asie",
    MY: "Asie",
    MV: "Asie",
    MN: "Asie",
    PK: "Asie",
    PW: "Asie",
    PH: "Asie",
    QA: "Asie",
    KR: "Asie",
    SG: "Asie",
    LK: "Asie",
    TO: "Asie",
    TR: "Asie",
    UZ: "Asie",
    EG: "Afrique",
    GH: "Afrique",
    LY: "Afrique",
    MU: "Afrique",
    SC: "Afrique",
    TN: "Afrique",
    NZ: "Océanie",
    NU: "Océanie",
  };

  // Ajouter le continent à chaque entrée
  data.forEach((item) => {
    item.Continent = continentMapping[item.ISO_ETAT] || "Autre";
  });

  // Calculer hover_text et bubble_size pour chaque point (comme dans l'exemple Python)
  const processedData = data.map((row) => ({
    ...row,
    hover_text:
      `Pays: ${row.NOM_COURT}<br>` +
      `Année: ${row.Year}<br>` +
      `Naissances: ${row.Value.toLocaleString()}<br>` +
      `Continent: ${row.Continent}`,
    bubble_size: Math.sqrt(row.Value),
  }));

  // Calculer sizeref (comme dans l'exemple Python)
  const maxSize = Math.max(...processedData.map((d) => d.bubble_size));
  const sizeref = (2.0 * maxSize) / 100 ** 2;

  // Grouper par continent (comme le dictionnaire Python)
  const continents = [...new Set(processedData.map((d) => d.Continent))];
  const continentData = {};
  continents.forEach((continent) => {
    continentData[continent] = processedData.filter(
      (d) => d.Continent === continent
    );
  });

  // Créer les traces (équivalent de fig.add_trace en Python)
  const traces = Object.entries(continentData).map(
    ([continentName, continentRows]) => ({
      x: continentRows.map((d) => d.Year),
      y: continentRows.map((d) => d.Value),
      mode: "markers",
      name: continentName,
      text: continentRows.map((d) => d.hover_text),
      hovertemplate: "%{text}<extra></extra>",
      marker: {
        size: continentRows.map((d) => d.bubble_size),
        sizemode: "area",
        sizeref: sizeref,
        line: {
          width: 2,
        },
      },
    })
  );

  // Configuration du layout (comme fig.update_layout en Python)
  const layout = {
    title: {
      text: "Naissances par pays (2000-2010)",
    },
    xaxis: {
      title: {
        text: "Année",
      },
      gridcolor: "white",
      gridwidth: 2,
      tickmode: "linear",
      tick0: 2000,
      dtick: 1,
    },
    yaxis: {
      title: {
        text: "Nombre de naissances",
      },
      gridcolor: "white",
      gridwidth: 2,
      type: "log",
    },
    paper_bgcolor: "rgb(243, 243, 243)",
    plot_bgcolor: "rgb(243, 243, 243)",
    hovermode: "closest",
    height: 700,
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  // Créer le graphique (équivalent de fig.show() en Python)
  Plotly.newPlot(containerId, traces, layout, config);
}
