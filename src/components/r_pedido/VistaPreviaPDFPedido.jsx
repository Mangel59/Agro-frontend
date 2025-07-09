import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function VistaPreviaPDFPedido({ pedido, articulos = [], presentaciones = [] }) {
  const getPresentacion = (id) => {
    const match = presentaciones.find(p => p.id === id);
    return match ? match.nombre : id;
  };

  return (
    <Box component={Paper} sx={{ padding: 4, marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>Resumen del Pedido</Typography>
      {pedido ? (
        <>
          <Typography><strong>ID:</strong> {pedido.id}</Typography>
          <Typography><strong>Descripción:</strong> {pedido.descripcion}</Typography>
          <Typography><strong>Fecha:</strong> {pedido.fechaHora}</Typography>
          <Typography><strong>Producción ID:</strong> {pedido.produccionId}</Typography>
          <Typography><strong>Almacén ID:</strong> {pedido.almacenId}</Typography>
          <Typography><strong>Estado:</strong> {pedido.estadoId === 1 ? "Activo" : "Inactivo"}</Typography>

          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>Artículos Asociados</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Presentación</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {articulos.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>{a.cantidad}</TableCell>
                      <TableCell>{getPresentacion(a.productoPresentacionId)}</TableCell>
                      <TableCell>{a.estadoId === 1 ? "Activo" : "Inactivo"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Typography color="error">No hay datos del pedido para mostrar.</Typography>
      )}
    </Box>
  );
}
