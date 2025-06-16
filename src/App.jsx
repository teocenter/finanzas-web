import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  TextField, Button, Grid, Paper, Typography,
  Card, CardContent, Divider, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material'

const colores = ['#2ecc71', '#e74c3c']

function App() {
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('')
  const [tasa, setTasa] = useState('')
  const [resultado, setResultado] = useState(null)
  const [tabla, setTabla] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (monto <= 0 || plazo <= 0 || tasa <= 0) {
      alert("Todos los valores deben ser mayores que cero.")
      return
    }

    const payload = {
      monto: parseFloat(monto),
      plazo: parseInt(plazo),
      tasa_anual: parseFloat(tasa)
    }

    const res = await fetch('http://localhost:8000/simulador/credito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    setResultado(data)

    const res2 = await fetch('http://localhost:8000/simulador/amortizacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const detalle = await res2.json()
    setTabla(detalle)
  }

  return (
    <div className="app-container">
      <Typography variant="h4" align="center" gutterBottom>
        Simulador de Crédito
      </Typography>

      <Card className="card-form">
        <CardContent>
          <Typography variant="h6" gutterBottom>Ingrese los datos:</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Monto del préstamo (S/)"
                  fullWidth
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Plazo (meses)"
                  fullWidth
                  type="number"
                  value={plazo}
                  onChange={(e) => setPlazo(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Tasa Efectiva Anual (%)"
                  fullWidth
                  type="number"
                  inputProps={{ step: '0.01' }}
                  value={tasa}
                  onChange={(e) => setTasa(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Simular
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {resultado && (
        <Card className="card-result">
          <CardContent>
            <Typography variant="subtitle1"><strong>Cuota mensual:</strong> S/ {resultado.cuota_mensual}</Typography>
            <Typography variant="subtitle1"><strong>Total pagado:</strong> S/ {resultado.total_pagado}</Typography>
            <Typography variant="subtitle1"><strong>Total intereses:</strong> S/ {resultado.total_intereses}</Typography>
          </CardContent>
        </Card>
      )}

      {tabla.length > 0 && (
        <>
          <Card className="card-table">
            <CardContent>
              <Typography variant="h6" gutterBottom>Tabla de Amortización</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mes</TableCell>
                    <TableCell>Cuota</TableCell>
                    <TableCell>Interés</TableCell>
                    <TableCell>Amortización</TableCell>
                    <TableCell>Saldo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tabla.map((fila) => (
                    <TableRow key={fila.mes}>
                      <TableCell>{fila.mes}</TableCell>
                      <TableCell>S/ {fila.cuota.toFixed(2)}</TableCell>
                      <TableCell>S/ {fila.interes.toFixed(2)}</TableCell>
                      <TableCell>S/ {fila.amortizacion.toFixed(2)}</TableCell>
                      <TableCell>S/ {fila.saldo.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="card-chart">
            <CardContent>
              <Typography variant="h6" gutterBottom>Interés vs Amortización</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tabla}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="interes" fill="#e74c3c" name="Interés" />
                  <Bar dataKey="amortizacion" fill="#2ecc71" name="Amortización" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-chart">
            <CardContent>
              <Typography variant="h6" gutterBottom>Capital vs Intereses</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Capital', value: resultado.total_pagado - resultado.total_intereses },
                      { name: 'Intereses', value: resultado.total_intereses }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%" outerRadius={100}
                    label
                  >
                    {colores.map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default App
