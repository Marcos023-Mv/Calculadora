let numA      = null;
let op        = null;
let digitando = false;

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

  if (d === "." && atual.includes(".")) return;
  mostrar(atual === "0" && d !== "." ? d : atual + d);
}

function definirOp(novaOp) {
  if (op && digitando) {
    calcular(false);
    numA = parseFloat(visor.textContent);
  } else {
    numA = parseFloat(visor.textContent);
  }

  op        = novaOp;
  digitando = false;
  hist.textContent = numA + " " + SIMBOLOS[op];
}

function calcular(mostrarHistorico = true) {
  if (op === null || numA === null) return;

  const numB = parseFloat(visor.textContent);
  let resultado;

  if (op === "+") resultado = numA + numB;
  else if (op === "-") resultado = numA - numB;
  else if (op === "*") resultado = numA * numB;
  else if (op === "/") {
    if (numB === 0) {
      visor.textContent = "Divisão por zero";
      visor.classList.add("erro");
      limpar();
      return;
    }
    resultado = numA / numB;
  }

  // Remove casas decimais desnecessárias
  resultado = parseFloat(resultado.toFixed(10));

  if (mostrarHistorico) {
    hist.textContent = `${numA} ${SIMBOLOS[op]} ${numB} =`;
  }

  mostrar(resultado);
  numA      = resultado;
  op        = null;
  digitando = false;
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
  if (e.key >= "0" && e.key <= "9")       digito(e.key);
  if (e.key === ".")                       digito(".");
  if (e.key === "+")                       definirOp("+");
  if (e.key === "-")                       definirOp("-");
  if (e.key === "*")                       definirOp("*");
  if (e.key === "/") { e.preventDefault(); definirOp("/"); }
  if (e.key === "Enter" || e.key === "=")  calcular();
  if (e.key === "Backspace")               apagar();
  if (e.key === "Escape")                  limpar();
});