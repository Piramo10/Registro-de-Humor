// Esperar o DOM estar carregado
document.addEventListener("DOMContentLoaded", () => {
  // Selecionar o formulário de login
  const loginForm = document.getElementById("loginForm");

  // Adicionar evento no submit
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que a página recarregue

    // Capturar os valores do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Enviar o login
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: senha }), // Ajuste se necessário
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Login bem-sucedido!");
          // Você pode esconder o formulário ou redirecionar aqui
        } else {
          alert(data.message || "Erro ao fazer login.");
        }
      })
      .catch((err) => {
        console.error("Erro:", err);
        alert("Erro na requisição.");
      });
  });
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const resposta = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem("token", dados.token);
      alert("Login realizado com sucesso!");
    } else {
      alert(dados.mensagem || "Erro ao fazer login.");
    }
  } catch (erro) {
    alert("Erro ao conectar ao servidor.");
  }
});

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
// Função para registrar a emoção
const registrarEmocao = async (emocao) => {
  const token = localStorage.getItem("token"); // Pega o token armazenado no localStorage

  if (!token) {
    alert("Você precisa estar logado para registrar sua emoção.");
    return;
  }

  try {
    const resposta = await fetch(
      "http://localhost:5000/api/emocoes/registrar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Envia o token no cabeçalho
        },
        body: JSON.stringify({ emocao }),
      }
    );

    const dados = await resposta.json();

    if (resposta.ok) {
      alert(dados.mensagem || "Emoção registrada com sucesso!");
    } else {
      alert(dados.mensagem || "Erro ao registrar emoção.");
    }
  } catch (erro) {
    alert("Erro ao conectar ao servidor.");
  }
};

// Exemplo de uso (substitua a parte do localStorage.setItem)
registrarEmocao("Feliz");
// Função para buscar as emoções do usuário
const buscarHistoricoEmocoes = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para ver seu histórico.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:5000/api/emocoes", {
      method: "GET",
      headers: {
        Authorization: token, // Envia o token no cabeçalho
      },
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      console.log("Histórico de Emoções:", dados);
      // Aqui você pode atualizar o frontend para mostrar as emoções registradas
      // Exemplo: criar uma lista com as emoções
      const historicoDiv = document.getElementById("historicoEmocoes");
      historicoDiv.innerHTML = dados
        .map((emocao) => `<p>${emocao}</p>`)
        .join("");
    } else {
      alert(dados.mensagem || "Erro ao buscar histórico.");
    }
  } catch (erro) {
    alert("Erro ao conectar ao servidor.");
  }
};

// Exemplo de uso
buscarHistoricoEmocoes();
