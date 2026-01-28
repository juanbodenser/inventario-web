let data = {};
let currentPartida = null;
let currentReceta = null;

const app = document.getElementById("app");
const title = document.getElementById("title");
const backBtn = document.getElementById("backBtn");

fetch("recetas.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    showPartidas();
  });

backBtn.onclick = () => {
  if (currentReceta) {
    currentReceta = null;
    showRecetas(currentPartida);
  } else {
    currentPartida = null;
    showPartidas();
  }
};

function showPartidas() {
  title.textContent = "Partidas";
  backBtn.hidden = true;
  app.innerHTML = "";

  Object.keys(data).forEach(partida => {
    const card = createCard(partida, () => {
      currentPartida = partida;
      showRecetas(partida);
    });
    app.appendChild(card);
  });
}

function showRecetas(partida) {
  title.textContent = partida;
  backBtn.hidden = false;
  app.innerHTML = "";

  data[partida].forEach(receta => {
    const card = createCard(receta.nombre, () => {
      currentReceta = receta;
      showCalculo(receta);
    });
    app.appendChild(card);
  });
}

function showCalculo(receta) {
  title.textContent = receta.nombre;
  backBtn.hidden = false;
  app.innerHTML = "";

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Peso en gramos";

  const button = document.createElement("button");
  button.textContent = "Calcular";

  const resultDiv = document.createElement("div");

  button.onclick = () => {
    const peso = Number(input.value);
    resultDiv.innerHTML = "";
    if (!peso) return;

    const resultado = calcularDesglose(peso, receta.ingredientes);
    resultDiv.appendChild(renderTabla(resultado));
  };

  app.append(input, button, resultDiv);
}

function calcularDesglose(peso, ingredientes) {
  const rendimiento = ingredientes.rendimiento || 1;
  const ratio = peso / rendimiento;
  const result = {};

  for (const key in ingredientes) {
    if (key !== "rendimiento") {
      result[key] = ingredientes[key] * ratio;
    }
  }
  return result;
}

function renderTabla(data) {
  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Ingrediente</th>
      <th>Gramos</th>
    </tr>
  `;

  Object.entries(data).forEach(([k, v]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${k}</td>
      <td>${v.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });

  return table;
}

function createCard(text, onClick) {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = text;
  div.onclick = onClick;
  return div;
}
