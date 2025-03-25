/**
 * @file Chart.jsx
 * @module Chart
 * @description Componente que muestra un gráfico de línea con las ventas del día.
 * @component
 */

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import Title from '../../codes/Title';

/**
 * Genera un objeto de datos para el gráfico.
 * 
 * @param {string} time - Hora del día.
 * @param {number} [amount] - Cantidad de ventas.
 * @returns {{ time: string, amount: number|null }} Objeto de datos.
 */
function createData(time, amount) {
  return { time, amount: amount ?? null };
}

/** 
 * Datos de ventas por hora para el gráfico.
 * @type {Array<{ time: string, amount: number|null }>}
 */
const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00'),
];

/**
 * Componente Chart.
 * Muestra un gráfico de línea representando las ventas del día.
 *
 * @returns {JSX.Element} El componente del gráfico.
 */
export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Sales ($)',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              max: 2500,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: {
              stroke: theme.palette.text.secondary,
            },
            [`.${axisClasses.root} text`]: {
              fill: theme.palette.text.secondary,
            },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
