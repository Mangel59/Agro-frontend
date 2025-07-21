import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Stack
} from "@mui/material";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFOrdenCompra from "../OrdenCompra/vistapreviapdfordencompra";
import GridArticuloOrdenCompra from "../OrdenCompra/GridArticuloOrdenCompra";

export default function RE_ordenCompra() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");

  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [categoriaEstadoId, setCategoriaEstadoId] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [ordenData, setOrdenData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  const buscarOrden = async () => {
    if (!pedidoId) {
      setMessage({ open: true, severity: "warning", text: "Debes ingresar un ID de pedido." });
      return;
    }

    try {
      const ordenesRes = await axios.get("/v1/orden_compra", {
        params: { page: 0, size: 100 },
        ...headers,
      });
      const ordenes = ordenesRes.data.data || ordenesRes.data;

      const orden = ordenes.find((o) => String(o.pedidoId) === String(pedidoId));

      if (!orden) {
        setMessage({ open: true, severity: "error", text: "No se encontró la orden para ese pedido." });
        return;
      }

      const [articulosRes, presentacionesRes] = await Promise.all([
        axios.get(`/v1/orden_compra/${orden.id}/articulos`, headers),
        axios.get("/v1/producto_presentacion", headers),
      ]);

      setOrdenData(orden);
      setArticulos(articulosRes.data);
      setPresentaciones(presentacionesRes.data);
      setSelectedRows([]);
      setPreviewUrl("");
      setMessage({ open: true, severity: "success", text: "Datos cargados correctamente." });
    } catch (error) {
      console.error("Error al buscar orden de compra:", error?.response || error);
      setOrdenData(null);
      setArticulos([]);
      setPresentaciones([]);
      setSelectedRows([]);
      setPreviewUrl("");
      setMessage({
        open: true,
        severity: "error",
        text: `Error ${error?.response?.status || ""}: ${error?.response?.statusText || "al cargar datos de la orden"}`
      });
    }
  };

  const verPDF = () => {
    axios({
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        empresa_id: parseInt(empresaId),
        pedido_id: parseInt(pedidoId),
        categoria_estado_id: parseInt(categoriaEstadoId),
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
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        empresa_id: parseInt(empresaId),
        pedido_id: parseInt(pedidoId),
        categoria_estado_id: parseInt(categoriaEstadoId),
        logo_empresa: logoPath
      },
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orden_compra_${pedidoId}.pdf`);
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
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        articulo_ids: ids,
        emp_id: parseInt(empresaId),
        ped_id: parseInt(pedidoId),
        categoria_estado_id: parseInt(categoriaEstadoId),
        logo_empresa: logoPath
      },
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orden_articulos_seleccionados.pdf`);
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
      <Typography variant="h4" gutterBottom>Reporte de Gestión de Orden de Compra</Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Categoría Estado"
          type="number"
          value={categoriaEstadoId}
          onChange={(e) => setCategoriaEstadoId(e.target.value)}
        />
        <TextField
          label="ID Pedido"
          type="number"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
        />
        <Button variant="contained" onClick={buscarOrden}>Buscar</Button>
        <Button variant="outlined" onClick={verPDF} disabled={!ordenData}>Ver PDF</Button>
      </Stack>

      {ordenData && (
        <>
          <VistaPreviaPDFOrdenCompra orden={ordenData} />

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
            <Typography variant="h6" gutterBottom>Artículos de la Orden</Typography>
            <GridArticuloOrdenCompra
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
