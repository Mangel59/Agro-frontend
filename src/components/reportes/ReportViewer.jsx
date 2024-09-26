import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';

export default function ReportViewer() {
  const [category, setCategory] = useState(0); // Estado para la categoría seleccionada
  const [reportUrl, setReportUrl] = useState(''); // Estado para el URL del reporte generado

  // Función para manejar el cambio de categoría
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  // Función para obtener el reporte según la categoría seleccionada
  const fetchReport = async () => {
    const baseUrl = "http://localhost:8080/api/report?category=" + category;
    const response = await axios.get(baseUrl, {
      responseType: 'blob', // Importante para datos binarios (PDF)
    });

    // Crear una URL de Blob para mostrar el PDF en un iframe
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    setReportUrl(url); // Establecer el URL del reporte
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
      {/* Selector de Categoría */}
      <FormControl fullWidth sx={{ maxWidth: 400, mb: 2 }}>
        <InputLabel id="category-select-label">Categoría</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={category}
          label="Categoría"
          onChange={handleChangeCategory}
        >
          <MenuItem value={0}>Todas</MenuItem>
          <MenuItem value={1}>Granos</MenuItem>
          <MenuItem value={2}>Frutas</MenuItem>
          <MenuItem value={3}>Vegetales</MenuItem>
        </Select>
      </FormControl>

      {/* Botón para generar el reporte */}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchReport}
        sx={{ maxWidth: 200, alignSelf: 'center', marginBottom: 2 }}
      >
        Generar Reporte
      </Button>

      {/* Mostrar el reporte si se ha generado */}
      {reportUrl && (
        <iframe
          src={reportUrl}
          width="100%"
          height="600px"
          style={{ marginTop: '20px' }}
          title="Visor de Reporte"
        />
      )}
    </Container>
  );
}