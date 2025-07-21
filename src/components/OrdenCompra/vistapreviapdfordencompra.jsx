import React from "react";
import {
  Box, Typography, Card, CardContent, Grid
} from "@mui/material";

export default function VistaPreviaPDFOrdenCompra({ orden }) {
  return (
    <Box mt={4}>
      <Card elevation={3} sx={{ maxWidth: 500, backgroundColor: "#1e1e1e", borderRadius: 3, alignSelf: "flex-start" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
            Resumen de la Orden de Compra
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>ID:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{orden.id}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Descripción:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{orden.descripcion}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Fecha:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{orden.fechaHora}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Pedido ID:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{orden.pedidoId}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Proveedor ID:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{orden.proveedorId}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Estado:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{orden.estadoId === 1 ? "Activo" : "Inactivo"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}