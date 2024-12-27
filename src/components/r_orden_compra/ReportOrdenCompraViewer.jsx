import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import { SiteProps } from "../dashboard/SiteProps.jsx";

export default function ReportOrdenCompraViewer() {
  const [data, setData] = useState([]);
  const [ordencompraId, setOrdenCompraId] = useState("");
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setError("");
      if (!ordencompraId) {
        setError("Por favor ingresa un ID de ordencompra.");
        return;
      }
      const response = await axios.get(`${SiteProps.urlbasev2}/report/ordencompra`, {
        params: { ordencompraId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(response.data || []);
    } catch (error) {
      setError("Error al cargar el reporte. Intenta nuevamente.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de OrdenCompra", 105, 20, null, null, "center");
    data.forEach((item, index) => {
      const y = 30 + index * 10;
      doc.text(`Producto: ${item.producto}, Cantidad: ${item.cantidad}`, 20, y);
    });
    doc.save("reporte_ordencompra.pdf");
  };

  const columns = [
    { field: "producto", headerName: "Producto", width: 200 },
    { field: "cantidad", headerName: "Cantidad", width: 150 },
    { field: "unidad", headerName: "Unidad", width: 150 },
  ];

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="ID OrdenCompra"
          value={ordencompraId}
          onChange={(e) => setOrdenCompraId(e.target.value)}
        />
        <Button variant="contained" onClick={fetchReport}>
          Buscar
        </Button>
      </Box>
      <DataGrid rows={data} columns={columns} pageSize={5} autoHeight />
      <Button variant="contained" color="secondary" onClick={generatePDF}>
        Generar PDF
      </Button>
    </Box>
  );
}
