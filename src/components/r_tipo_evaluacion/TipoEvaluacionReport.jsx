/**
 * @file TipoEvaluacionReport.jsx
 * @module TipoEvaluacionReport
 * @description Componente para generar y descargar un reporte PDF basado en el ID de tipo de evaluación ingresado por el usuario. Utiliza Axios para comunicarse con la API y generar un archivo PDF descargable.
 * @author Karla
 */

import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente principal para la descarga de reportes de tipo de evaluación.
 *
 * Este componente permite al usuario ingresar un ID de tipo de evaluación,
 * solicitar el reporte al backend y descargar un archivo PDF.
 *
 * @returns {JSX.Element} Componente de descarga de reporte PDF
 */
export default function TipoEvaluacionReport() {
  const [tipoEvaluacionId, setTipoEvaluacionId] = useState("");

  /**
   * Maneja la solicitud de descarga del reporte.
   * Verifica el ID ingresado, realiza una petición a la API y descarga el PDF.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
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
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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
