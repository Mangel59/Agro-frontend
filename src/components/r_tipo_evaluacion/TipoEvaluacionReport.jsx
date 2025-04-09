/**
 * @module TipoEvaluacionReport
 */
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * TipoEvaluacionReport componente principal.
 * @component
 * @returns {JSX.Element}
 */
export default function TipoEvaluacionReport() {
  const [tipoEvaluacionId, setTipoEvaluacionId] = useState("");

  const handleDownloadReport = async () => {
    if (!tipoEvaluacionId) {
      alert("Debes ingresar un tipo de evaluación.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SiteProps.urlbasev2}/report/tipo-evaluacion`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { tipoEvaluacionId },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tipo_Evaluacion_${tipoEvaluacionId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
      alert("Error al generar el reporte.");
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 400, mx: "auto" }}>
      <h2>Generar Reporte de Tipo de Evaluación</h2>
      <TextField
        label="Tipo Evaluación ID"
        type="number"
        fullWidth
        value={tipoEvaluacionId}
        onChange={(e) => setTipoEvaluacionId(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleDownloadReport}
      >
        Descargar Reporte PDF
      </Button>
    </Box>
  );
}
