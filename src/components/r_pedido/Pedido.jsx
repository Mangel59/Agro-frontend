import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPedido from "./FormPedido";
import GridPedido from "./GridPedido";
import GridArticuloPedido from "./GridArticuloPedido";
import FormArticuloPedido from "./FormArticuloPedido";
import {
  Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from "@mui/material";

export default function Pedido() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [categoriaEstadoId, setCategoriaEstadoId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [selectedArticulosToPrint, setSelectedArticulosToPrint] = useState([]);
  const [reloadArticulos, setReloadArticulos] = useState(false);
  const [presentaciones, setPresentaciones] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const empresaId = localStorage.getItem("empresaId");

  const reloadData = () => {
    axios.get("/v1/pedido")
      .then((res) => {
        setPedidos(res.data);
        if (res.data.length > 0 && !selectedRow) {
          setSelectedRow(res.data[0]);
        }
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar pedidos" });
      });
  };

  const loadArticulos = (pedidoId) => {
    axios.get(`/v1/pedido/${pedidoId}/articulos`)
      .then(res => setArticuloItems(res.data))
      .catch(() => setArticuloItems([]));
  };

  useEffect(() => {
    reloadData();
    axios.get("/v1/presentacion")
      .then(res => setPresentaciones(res.data))
      .catch(() => setPresentaciones([]));
  }, []);

  useEffect(() => {
    if (selectedRow) loadArticulos(selectedRow.id);
    else setArticuloItems([]);
  }, [selectedRow, reloadArticulos]);

  const handleSearch = () => {
    if (!searchId) return;
    axios.get(`/v1/pedido/${searchId}`)
      .then((res) => {
        setSearchResult(res.data);
        loadArticulos(res.data.id);
        setPreviewUrl(""); 
      })
      .catch(() => {
        setSearchResult(null);
        setArticuloItems([]);
        setMessage({ open: true, severity: "error", text: "No se encontró el pedido" });
      });
  };

  const imprimirArticulosSeleccionados = () => {
    const ids = selectedArticulosToPrint.map(a => a.id);
    if (ids.length === 0) {
      setMessage({ open: true, severity: "warning", text: "Selecciona al menos un artículo." });
      return;
    }

    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: {
        articulo_ids: ids,
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
        ped_id: searchResult?.id
      },
      responseType: "blob"
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `articulos_seleccionados.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Error al descargar reporte de artículos:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al descargar el reporte.",
        });
      });
  };

  const imprimirPedidoCompletoPorBusqueda = () => {
    if (!searchResult?.id) {
      setMessage({ open: true, severity: "warning", text: "No hay pedido cargado." });
      return;
    }

    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: {
        ped_id: searchResult.id,
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
      },
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `pedido_${searchResult.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Error al generar PDF completo:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al generar el reporte del pedido completo.",
        });
      });
  };

  const generarVistaPreviaPDF = () => {
    if (!searchResult?.id) {
      setMessage({ open: true, severity: "warning", text: "No hay pedido cargado." });
      return;
    }

    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: {
        ped_id: searchResult.id,
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
      },
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        setPreviewUrl(url);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al generar vista previa PDF." });
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Pedido</Typography>
        <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>Buscar reporte</Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => { setFormMode("create"); setFormOpen(true); }}>Nuevo</Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>Editar</Button>
        <Button variant="outlined" color="error" onClick={async () => {
          if (!selectedRow) return;
          if (window.confirm("¿Eliminar el pedido seleccionado?")) {
            try {
              await axios.delete(`/v1/pedido/${selectedRow.id}`);
              setMessage({ open: true, severity: "success", text: "Pedido eliminado correctamente." });
              setSelectedRow(null);
              reloadData();
            } catch {
              setMessage({ open: true, severity: "error", text: "Error al eliminar el pedido." });
            }
          }
        }} disabled={!selectedRow}>Eliminar</Button>
      </Box>

      <FormPedido
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        almacenId={selectedRow?.almacenId || ""}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Lista de Pedidos</Typography>
        <GridPedido
          pedidos={pedidos}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </Box>

      {selectedRow && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Artículos del Pedido seleccionado</Typography>
            <Box display="flex" gap={2}>
              <FormArticuloPedido
                selectedRow={selectedArticulo}
                pedidoId={selectedRow?.id || ""}
                setSelectedRow={setSelectedArticulo}
                setMessage={setMessage}
                reloadData={() => setReloadArticulos(prev => !prev)}
              />
            </Box>
          </Box>

          <Box>
            <GridArticuloPedido
              items={articuloItems}
              setSelectedRow={setSelectedArticulo}
              presentaciones={presentaciones}
            />
          </Box>
        </>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Buscar Pedido </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="ID de Pedido"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            label="Categoría Estado"
            value={categoriaEstadoId}
            onChange={(e) => setCategoriaEstadoId(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
          />
          {searchResult && (
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>Artículos del Pedido</Typography>
              <GridArticuloPedido
                items={articuloItems}
                setSelectedRows={setSelectedArticulosToPrint}
                presentaciones={presentaciones}
              />

              <Button
                onClick={generarVistaPreviaPDF}
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Ver Vista Previa PDF
              </Button>

              {previewUrl && (
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="600px"
                  style={{ marginTop: '20px', border: '1px solid #ccc' }}
                  title="Vista Previa del Pedido"
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Cerrar</Button>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button
            onClick={imprimirArticulosSeleccionados}
            disabled={!searchResult}
            variant="contained"
            color="info"
          >
            Imprimir Seleccionados
          </Button>
          <Button
            onClick={imprimirPedidoCompletoPorBusqueda}
            disabled={!searchResult}
            variant="contained"
            color="secondary"
          >
            Imprimir Pedido
          </Button>
        </DialogActions>
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
