import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPedido from "./FormPedido";
import GridPedido from "./GridPedido";
import GridArticuloPedido from "./GridArticuloPedido";
import FormArticuloPedido from "./FormArticuloPedido";
import RePV from "../RE_pedido/re_pv";
import { Box, Typography, Button, Dialog, useTheme } from "@mui/material";

export default function Pedido() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);
  const [presentaciones, setPresentaciones] = useState([]);

  const theme = useTheme();

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

  // Contenedor para todo lo relacionado a Pedidos
  const containerPedidos = {
    backgroundColor: theme.palette.mode === "dark" ? "#1e2a2c" : "#c9e6fe",
    padding: 3,
    borderRadius: 2,
  };

  // Contenedor para los Artículos del pedido
  const containerArticulos = {
    backgroundColor: theme.palette.mode === "dark" ? "#2c383b" : "#caddf3",
    padding: 2,
    borderRadius: 2,
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Contenedor principal de Pedidos */}
      <Box sx={{ ...containerPedidos, mb: 4 }}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Gestión de Pedido</Typography>
          <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>
            Generar reporte de pedido
          </Button>
        </Box>

        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => { setFormMode("create"); setFormOpen(true); }}>
            + Crear
          </Button>
          <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>
            Actualizar
          </Button>
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
          }} disabled={!selectedRow}>
            Eliminar
          </Button>
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

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Lista de Pedidos</Typography>
          <GridPedido
            pedidos={pedidos}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        </Box>
      </Box>

      {/* Contenedor de Artículos */}
      {selectedRow && (
        <Box sx={{ ...containerArticulos, mt: 4 }}>
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

          <GridArticuloPedido
            items={articuloItems}
            setSelectedRow={setSelectedArticulo}
            presentaciones={presentaciones}
          />
        </Box>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="lg">
        <RePV setOpen={setSearchDialogOpen} />
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
