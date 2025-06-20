import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import axiosV2 from "../axiosConfig2";
import MessageSnackBar from "../MessageSnackBar";
import FormPedido from "./FormPedido";
import GridPedido from "./GridPedido";
import GridArticuloPedido from "./GridArticuloPedido";
import FormArticuloPedido from "./FormArticuloPedido";
import {
  Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

export default function Pedido() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);

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
  }, []);

  useEffect(() => {
    if (selectedRow) {
      loadArticulos(selectedRow.id);
    } else {
      setArticuloItems([]);
    }
  }, [selectedRow, reloadArticulos]);

  const handleSearch = () => {
    if (!searchId) return;
    axios.get(`/v1/pedido/${searchId}`)
      .then((res) => setSearchResult(res.data))
      .catch(() => {
        setSearchResult(null);
        setMessage({ open: true, severity: "error", text: "No se encontró el pedido" });
      });
  };

const imprimirReportePedido = (id) => {
  const token = localStorage.getItem("token");

  axios({
    url: "/v2/report/pedido",
    method: "POST",
    data: { ped_id: Number(id) }, 
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_pedido_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch(() => {
      setMessage({
        open: true,
        severity: "error",
        text: "Error al descargar el reporte del pedido",
      });
    });
};


  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Pedido</Typography>
        <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>Buscar por ID</Button>
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
              selectedRow={selectedArticulo}
              setSelectedRow={setSelectedArticulo}
            />
          </Box>
        </>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth>
        <DialogTitle>Buscar Pedido por ID</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="ID de Pedido"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
          />
          {searchResult && (
            <>
              <TextField label="Descripción" fullWidth value={searchResult.descripcion || ""} margin="dense" />
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select value={searchResult.estadoId || ""} disabled>
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Cerrar</Button>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button
            onClick={() => imprimirReportePedido(searchId)}
            disabled={!searchResult}
            variant="contained"
          >
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
