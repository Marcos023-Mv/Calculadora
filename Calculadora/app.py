from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

PASTA = os.path.dirname(os.path.abspath(__file__))

@app.route("/")
def index():
    return send_from_directory(PASTA, "calculadora.html")

@app.route("/<path:arquivo>")
def estaticos(arquivo):
    return send_from_directory(PASTA, arquivo)

@app.route("/calcular", methods=["POST"])
def calcular():
    dados = request.get_json()
    a  = dados.get("a")
    b  = dados.get("b")
    op = dados.get("op")

    try:
        a, b = float(a), float(b)
    except (TypeError, ValueError):
        return jsonify({"erro": "Números inválidos"}), 400

    if op == "+":
        resultado = a + b
    elif op == "-":
        resultado = a - b
    elif op == "*":
        resultado = a * b
    elif op == "/":
        if b == 0:
            return jsonify({"erro": "Divisão por zero"}), 400
        resultado = a / b
    else:
        return jsonify({"erro": "Operação inválida"}), 400

    if resultado == int(resultado):
        resultado = int(resultado)

    return jsonify({"resultado": resultado})

if __name__ == "__main__":
    print("Rodando em http://localhost:5000")
    app.run(debug=True)