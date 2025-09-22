import React from "react";
import {
  Box, Typography, Card, CardContent, Grid
} from "@mui/material";

export default function VistaPreviaPDFPedido({ pedido }) {
   if (!pedido) return null; 
  return (
    <Box mt={4}>
      <Card elevation={3} sx={{ maxWidth: 500, backgroundColor: "#1e1e1e", borderRadius: 3, alignSelf: "flex-start" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
            Resumen del Pedido
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>ID:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{pedido.id}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Descripción:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{pedido.descripcion}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Fecha:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{pedido.fechaHora}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Producción:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{pedido.produccionId}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Almacén:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{pedido.almacenId}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}><strong>Estado:</strong></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{pedido.estadoId === 1 ? "Activo" : "Inactivo"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
