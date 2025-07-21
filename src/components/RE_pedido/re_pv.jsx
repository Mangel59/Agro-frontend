import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Stack
} from "@mui/material";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFPedido from "../r_pedido/VistaPreviaPDFPedido";
import GridArticuloPedido from "../r_pedido/GridArticuloPedido";

export default function RE_pedido() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");

  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [categoriaEstadoId, setCategoriaEstadoId] = useState("");
  const [pedidoId, setPedidoId] = useState("");

  const [pedidoData, setPedidoData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  const buscarPedido = async () => {
    if (!pedidoId) {
      setMessage({ open: true, severity: "warning", text: "Debes ingresar un ID de pedido." });
      return;
    }

    try {
      const [pedidoRes, articulosRes, presentacionesRes] = await Promise.all([
        axios.get(`/v1/pedido/${pedidoId}`, headers),
        axios.get(`/v1/pedido/${pedidoId}/articulos`, headers),
        axios.get("/v1/presentacion", headers)
      ]);
      setPedidoData(pedidoRes.data);
      setArticulos(articulosRes.data);
      setPresentaciones(presentacionesRes.data);
      setSelectedRows([]);
      setPreviewUrl("");
      setMessage({ open: true, severity: "success", text: "Datos cargados correctamente." });
    } catch (error) {
      console.error("Error al buscar pedido:", error?.response || error);
      setPedidoData(null);
      setArticulos([]);
      setPresentaciones([]);
      setSelectedRows([]);
      setPreviewUrl("");
      setMessage({
        open: true,
        severity: "error",
        text: `Error ${error?.response?.status || ""}: ${error?.response?.statusText || "al cargar datos del pedido"}`
      });
    }
  };

  const verPDF = () => {
    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: {
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
        ped_id: parseInt(pedidoId),
        logo_empresa: logoPath
      },
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setMessage({ open: true, severity: "success", text: "PDF generado correctamente." });
    }).catch((err) => {
      console.error("Error al generar PDF:", err?.response || err);
      setPreviewUrl("");
      setMessage({ open: true, severity: "error", text: "Error al generar el PDF." });
    });
  };

  const imprimirCompleto = () => {
    if (!pedidoId) return;

    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: {
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
        ped_id: parseInt(pedidoId),
        logo_empresa: logoPath
      },
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pedido_${pedidoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch((err) => {
      console.error("Error al imprimir completo:", err?.response || err);
      setMessage({ open: true, severity: "error", text: "Error al descargar el PDF completo." });
    });
  };

  const imprimirSeleccionados = () => {
    if (selectedRows.length === 0) {
      setMessage({ open: true, severity: "warning", text: "Selecciona artículos primero." });
      return;
    }

    const ids = selectedRows.map(a => a.id);
    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: {
        articulo_ids: ids,
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
        ped_id: parseInt(pedidoId),
        logo_empresa: logoPath
      },
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `articulos_seleccionados.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch((err) => {
      console.error("Error al imprimir seleccionados:", err?.response || err);
      setMessage({ open: true, severity: "error", text: "Error al descargar PDF por seleccionados." });
    });
  };

  return (
    <Box sx={{ p: 4 }}>
     
      <Typography variant="h4" gutterBottom>Reporte de Gestión de Pedido</Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Categoría Estado"
          name="categoria_estado_id"
          type="number"
          value={categoriaEstadoId}
          onChange={(e) => setCategoriaEstadoId(e.target.value)}
        />
        <TextField
          label="Pedido"
          name="ped_id"
          type="number"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
        />
        <Button variant="contained" onClick={buscarPedido}>Buscar</Button>
        <Button variant="outlined" onClick={verPDF} disabled={!pedidoData}>Ver PDF</Button>
      </Stack>

      {pedidoData && (
        <>
          <VistaPreviaPDFPedido
            pedido={pedidoData}
            articulos={articulos}
            presentaciones={presentaciones}
          />

          {previewUrl && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Vista previa del PDF</Typography>
              <iframe
                src={previewUrl}
                width="100%"
                height="600px"
                title="Vista Previa PDF"
                style={{ border: "1px solid #ccc" }}
              />
            </Box>
          )}

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>Artículos del Pedido</Typography>
            <GridArticuloPedido
              items={articulos}
              presentaciones={presentaciones}
              setSelectedRows={setSelectedRows}
              setSelectedRow={() => {}}
            />
          </Box>

          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" color="primary" onClick={imprimirCompleto}>
              Imprimir PDF completo
            </Button>
            <Button variant="contained" color="secondary" onClick={imprimirSeleccionados}>
              Imprimir PDF por seleccionados
            </Button>
          </Stack>
        </>
      )}

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
