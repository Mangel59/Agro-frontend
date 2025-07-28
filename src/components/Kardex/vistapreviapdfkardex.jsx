import React from "react";
import {
  Box, Typography, Card, CardContent, Grid
} from "@mui/material";

/**
 * Muestra el resumen del Kardex o el visor PDF, dependiendo de la prop recibida
 * @param {{ kardex?: Array, url?: string }} props
 */
export default function VistaPreviaPDFKardex({ kardex, url }) {
  if (url) {
    return (
      <iframe
        src={url}
        title="Vista Previa PDF Kardex"
        width="100%"
        height="600px"
        style={{ border: "none" }}
      />
    );
  }

  if (!Array.isArray(kardex) || kardex.length === 0) return null;

  // Buscar el objeto más completo entre los artículos
  const item =
    kardex.find(k =>
      k.descripcion ||
      k.fechaHora ||
      k.almacenId ||
      k.empresaId ||
      k.tipoMovimientoId
    ) || kardex[0];

  return (
    <Box mt={4}>
      <Card
        elevation={3}
        sx={{
          maxWidth: 600,
          backgroundColor: "#1e1e1e",
          borderRadius: 3
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
            Resumen del Kardex
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>ID:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{item.kardexId || item.id || "-"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>Descripción:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{item.descripcion || "-"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>Fecha:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>
                {item.fechaHora ? item.fechaHora.substring(0, 19) : "-"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>Almacén:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{item.almacenId || "-"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>Empresa:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{item.empresaId || "-"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>Tipo Movimiento:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>{item.tipoMovimientoId || "-"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "#bbb" }}>
                <strong>Estado:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: "#fff" }}>
                {item.estadoId === 1 ? "Activo" : "Inactivo"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
