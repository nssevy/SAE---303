import "./index.css";
import { createBubbleChart } from "./bubbleChart.js";

document.querySelector("#app").innerHTML = `
  <div class="container mx-auto p-8">
    <h1 class="text-4xl font-bold text-center mb-8">
      Visualisation des Naissances Mondiales
    </h1>
    <div id="bubble-chart"></div>
  </div>
`;

createBubbleChart("bubble-chart");
