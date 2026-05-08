let numA      = null;   // primeiro número
let op        = null;   // operação pendente
let digitando = false;  // true = digitando o segundo número

const visor = document.getElementById("visor");
const hist  = document.getElementById("historico");

const SIMBOLOS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function mostrar(valor) {
  visor.textContent = valor;
  visor.classList.remove("erro");
}

function digito(d) {
  const atual = visor.textContent;

  if (!digitando) {
    mostrar(d === "." ? "0." : d);
    digitando = true;
    return;
  }

  if (d === "." && atual.includes(".")) return; // só uma vírgula
  mostrar(atual === "0" && d !== "." ? d : atual + d);
}

function definirOp(novaOp) {
  const valorAtual = parseFloat(visor.textContent);

  // Se já há operação pendente, calcula antes de continuar
  if (op && digitando) {
    calcular(false);
    numA = parseFloat(visor.textContent);
  } else {
    numA = valorAtual;
  }

  op        = novaOp;
  digitando = false;
  hist.textContent = numA + " " + SIMBOLOS[op];
}

async function calcular(mostrarHistorico = true) {
  if (op === null || numA === null) return;

  const numB = parseFloat(visor.textContent);

  try {
    const resp = await fetch("/calcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: numA, b: numB, op }),
    });

    const dados = await resp.json();

    if (dados.erro) {
      visor.textContent = dados.erro;
      visor.classList.add("erro");
      limpar();
      return;
    }

    if (mostrarHistorico) {
      hist.textContent = `${numA} ${SIMBOLOS[op]} ${numB} =`;
    }

    mostrar(dados.resultado);
    numA      = dados.resultado;
    op        = null;
    digitando = false;

  } catch {
    visor.textContent = "Erro de conexão";
    visor.classList.add("erro");
  }
}

function apagar() {
  if (!digitando) return;
  const atual = visor.textContent;
  const novo  = atual.length > 1 ? atual.slice(0, -1) : "0";
  mostrar(novo);
  if (novo === "0") digitando = false;
}

function limpar() {
  numA      = null;
  op        = null;
  digitando = false;
  hist.textContent = "";
  mostrar("0");
}

// Teclado físico
document.addEventListener("keydown", e => {
  if (e.key >= "0" && e.key <= "9")      digito(e.key);
  if (e.key === ".")                      digito(".");
  if (e.key === "+")                      definirOp("+");
  if (e.key === "-")                      definirOp("-");
  if (e.key === "*")                      definirOp("*");
  if (e.key === "/") { e.preventDefault(); definirOp("/"); }
  if (e.key === "Enter" || e.key === "=") calcular();
  if (e.key === "Backspace")              apagar();
  if (e.key === "Escape")                 limpar();
});