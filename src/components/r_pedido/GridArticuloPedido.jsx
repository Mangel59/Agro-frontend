import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from "@mui/material";

export default function GridArticuloPedido({
  items,
  setSelectedRow = () => {},      // para seleccionar uno (editar)
  setSelectedRows = () => {},     // para seleccionar varios (imprimir)
  presentaciones = []
}) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'cantidad', headerName: 'Cantidad', width: 120 },
    { field: 'pedidoId', headerName: 'Pedido', width: 150 },
    {
      field: 'productoPresentacionId',
      headerName: 'Presentación',
      width: 200,
      valueGetter: (params) => {
        const match = presentaciones.find(p => p.id === params.row.productoPresentacionId);
        return match ? match.nombre : params.row.productoPresentacionId;
      }
    },
    {
      field: 'estadoId',
      headerName: 'Estado',
      width: 120,
      valueGetter: (params) => params.row.estadoId === 1 ? "Activo" : "Inactivo"
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={items}
        columns={columns}
        checkboxSelection
        pageSizeOptions={[5, 10, 15]}
        getRowId={(row) => row.id}
        onRowSelectionModelChange={(ids) => {
          const selectedMultiple = items.filter(row => ids.includes(row.id));
          const selectedOne = selectedMultiple[0] || null;

          setSelectedRows(selectedMultiple); // para impresión múltiple
          setSelectedRow(selectedOne);       // para edición única
        }}
      />
    </Box>
  );
}
