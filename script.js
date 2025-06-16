document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const monto = parseFloat(document.getElementById("monto").value);
  const tasa = parseFloat(document.getElementById("tasa").value);
  const plazo = parseInt(document.getElementById("plazo").value);

  const response = await fetch("http://localhost:8000/simulador/credito", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ monto, tasa, plazo })
  });

  const data = await response.json();
  document.getElementById("resultado").innerText =
    `Cuota mensual: S/ ${data.cuota_mensual.toFixed(2)}`;
});
