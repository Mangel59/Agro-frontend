import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from './axiosConfig';

const columns = [
  { field: 'id', headerName: 'Id', width: 70 },
  { field: 'nombre', headerName: 'Nombre', width: 130 },
  { field: 'descripcion', headerName: 'Descripcion', width: 130 },
  { field: 'estado', headerName: 'Estado', width: 130 }
];

export default function TipoIdentificacion() {
  const [rows, setRows] = React.useState(null);

  React.useEffect(() => {
    axios.get('http://172.16.79.156:8080/api/v1/tipo_identificacion/all')
    .then(response => {
      console.log("response.data: " +  response.data);
      setRows(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the tipo identificacion data!', error);
    });
  
  }, []);

  if (!rows) return "No rows persona!";

  return (
    <Paper elevation={3} sx={{ p: 2, height: 500 }}>
      <Typography variant="h5" gutterBottom>
        Persona
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
