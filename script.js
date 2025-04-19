const form = document.getElementById("humorForm");
const humorSelect = document.getElementById("humor");
const descricaoInput = document.getElementById("descricao");
const historicoUl = document.getElementById("historico");
const graficoCanvas = document.getElementById("graficoHumor");

let registros = JSON.parse(localStorage.getItem("registrosHumor")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const humor = parseInt(humorSelect.value);
  const descricao = descricaoInput.value;
  const data = new Date().toISOString().split("T")[0];

  const registro = { data, humor, descricao };
  registros.push(registro);
  localStorage.setItem("registrosHumor", JSON.stringify(registros));

  form.reset();
  atualizarHistorico();
  atualizarGrafico();
});

function atualizarHistorico() {
  historicoUl.innerHTML = "";
  registros
    .slice()
    .reverse()
    .forEach((reg) => {
      const item = document.createElement("li");
      item.textContent = `${reg.data} - ${emojiHumor(reg.humor)} ${
        reg.descricao ? "– " + reg.descricao : ""
      }`;
      historicoUl.appendChild(item);
    });
}

function atualizarGrafico() {
  const ultimos7 = registros.slice(-7);
  const labels = ultimos7.map((r) => r.data);
  const dados = ultimos7.map((r) => r.humor);

  if (window.grafico) window.grafico.destroy();

  window.grafico = new Chart(graficoCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Nível de Humor",
          data: dados,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: {
            callback: (value) => emojiHumor(value),
          },
        },
      },
    },
  });
}

function emojiHumor(valor) {
  const mapa = {
    1: "😢",
    2: "😟",
    3: "😐",
    4: "🙂",
    5: "😄",
  };
  return mapa[valor] || "";
}

// Inicialização
atualizarHistorico();
atualizarGrafico();

const botaoTema = document.getElementById("botaoTema");

function aplicarTema() {
  const tema = localStorage.getItem("tema") || "claro";
  if (tema === "escuro") {
    document.body.classList.add("dark-mode");
    botaoTema.textContent = "☀️ Tema Claro";
  } else {
    document.body.classList.remove("dark-mode");
    botaoTema.textContent = "🌙 Tema Escuro";
  }
}

botaoTema.addEventListener("click", () => {
  const temaAtual = localStorage.getItem("tema") || "claro";
  const novoTema = temaAtual === "claro" ? "escuro" : "claro";
  localStorage.setItem("tema", novoTema);
  aplicarTema();
});

// Aplica ao carregar
aplicarTema();
