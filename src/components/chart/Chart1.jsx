/**
 * @file Chart1.jsx
 * @module Chart1
 * @description Componente que organiza visualmente el gráfico y los depósitos recientes en un diseño de cuadrícula.
 * @component
 */

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Deposits from './Deposits';

/**
 * Componente Chart1.
 *
 * Renderiza una cuadrícula con dos secciones:
 * - Un gráfico principal.
 * - Un resumen de depósitos recientes.
 *
 * @returns {JSX.Element} Componente visual con el gráfico y los depósitos.
 */
export default function Chart1() {
  return (
    <Grid container spacing={3}>
      {/* Gráfico principal */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Chart />
        </Paper>
      </Grid>

      {/* Depósitos recientes */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Deposits />
        </Paper>
      </Grid>

      {/* Pedidos recientes (comentado) */}
      {/* 
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Orders />
        </Paper>
      </Grid> 
      */}
    </Grid>
  );
}
