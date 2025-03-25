/**
 * @file TipoIdentificacion.jsx
 * @module TipoIdentificacion
 * @description Componente que muestra la lista de tipos de identificación en una tabla.
 */

import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from './axiosConfig';

const columns = [
  { field: 'id', headerName: 'Id', width: 70 },
  { field: 'nombre', headerName: 'Nombre', width: 130 },
  { field: 'descripcion', headerName: 'Descripción', width: 130 },
  { field: 'estado', headerName: 'Estado', width: 130 }
];

/**
 * Componente que obtiene y muestra una tabla con los datos de tipo de identificación.
 * Utiliza MUI DataGrid y obtiene los datos desde una API.
 *
 * @function
 * @memberof module:TipoIdentificacion
 * @returns {JSX.Element} Tabla con los tipos de identificación.
 */
function TipoIdentificacion() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    axios.get('http://172.16.79.156:8080/api/v1/tipo_identificacion/all')
      .then(response => {
        setRows(response.data);
      })
      .catch(error => {
        console.error('Error al obtener tipo de identificación:', error);
      });
  }, []);

  if (!rows) return "No hay datos disponibles.";

  return (
    <Paper elevation={3} sx={{ p: 2, height: 500 }}>
      <Typography variant="h5" gutterBottom>
        Tipo de Identificación
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </Paper>
  );
}

export default TipoIdentificacion;
