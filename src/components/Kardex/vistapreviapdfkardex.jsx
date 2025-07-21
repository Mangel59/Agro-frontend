import React from "react";
import { Box, Typography } from "@mui/material";

export default function VistaPreviaPDFKardex({ url }) {
  if (!url) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">
          No hay vista previa disponible.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "85vh" }}>
      <iframe
        src={url}
        title="Vista Previa Reporte Kardex"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </Box>
  );
}