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

  // Estados para paginación en servidor (Pedidos)
  const [pedidoPaginationModel, setPedidoPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [pedidoRowCount, setPedidoRowCount] = useState(0);
  const [pedidoLoading, setPedidoLoading] = useState(false);

  // Estados para paginación en servidor (Artículos)
  const [articuloPaginationModel, setArticuloPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [articuloRowCount, setArticuloRowCount] = useState(0);
  const [articuloLoading, setArticuloLoading] = useState(false);

  const theme = useTheme();

  // Utilidad para normalizar respuesta pageable o array
  const normalizePageResponse = (res) => {
    const isPage = res?.data && typeof res.data === "object" && Array.isArray(res.data.content);
    if (isPage) {
      return {
        rows: res.data.content,
        total: Number(res.data.totalElements ?? res.data.total ?? 0),
      };
    }
    // Si es array plano, intenta leer total de header o usa length
    const headerTotal = Number(res.headers?.["x-total-count"]);
    return {
      rows: Array.isArray(res.data) ? res.data : [],
      total: Number.isFinite(headerTotal) ? headerTotal : (Array.isArray(res.data) ? res.data.length : 0),
    };
  };
  const [producciones, setProducciones] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);

  useEffect(() => {
    axios.get("/v1/items/almacen/0")
      .then(r => setAlmacenes(Array.isArray(r.data) ? r.data : []))
      .catch(() => setAlmacenes([]));

    axios.get("/v1/items/produccion/0")
      .then(r => setProducciones(Array.isArray(r.data) ? r.data : []))
      .catch(() => setProducciones([]));
  }, []);

  const reloadData = async () => {
    try {
      setPedidoLoading(true);
      const params = {
        page: pedidoPaginationModel.page,
        size: pedidoPaginationModel.pageSize,
        sort: "id,desc", // opcional: ajusta según tu backend
      };
      const res = await axios.get("/v1/pedido", { params });
      const { rows, total } = normalizePageResponse(res);
      setPedidos(rows);
      setPedidoRowCount(total);

      // Seleccionar la primera fila si no hay selección
      if (rows.length > 0 && !selectedRow) {
        setSelectedRow(rows[0]);
      }
    } catch (e) {
      setMessage({ open: true, severity: "error", text: "Error al cargar pedidos" });
      setPedidos([]);
      setPedidoRowCount(0);
    } finally {
      setPedidoLoading(false);
    }
  };

  const loadArticulos = async (pedidoId) => {
    if (!pedidoId) {
      setArticuloItems([]);
      setArticuloRowCount(0);
      return;
    }
    try {
      setArticuloLoading(true);
      const params = {
        page: articuloPaginationModel.page,
        size: articuloPaginationModel.pageSize,
        sort: "id,desc", // opcional
      };
      const res = await axios.get(`/v1/pedido/${pedidoId}/articulos`, { params });
      const { rows, total } = normalizePageResponse(res);
      setArticuloItems(rows);
      setArticuloRowCount(total);
    } catch (e) {
      setArticuloItems([]);
      setArticuloRowCount(0);
    } finally {
      setArticuloLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    reloadData();
    axios.get("/v1/presentacion")
      .then(res => setPresentaciones(res.data))
      .catch(() => setPresentaciones([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar pedidos cuando cambia la paginación de pedidos
  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoPaginationModel]);

  // Cargar artículos cuando cambia pedido seleccionado o la paginación/flag de recarga
  useEffect(() => {
    if (selectedRow?.id) loadArticulos(selectedRow.id);
    else {
      setArticuloItems([]);
      setArticuloRowCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow, articuloPaginationModel, reloadArticulos]);

  // Estilos contenedores
  const containerPedidos = {
    backgroundColor: theme.palette.mode === "dark" ? "#1e2a2c" : "#c9e6fe",
    padding: 3,
    borderRadius: 2,
  };
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setFormMode("create"); setFormOpen(true); }}
          >
            + Crear
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setFormMode("edit"); setFormOpen(true); }}
            disabled={!selectedRow}
          >
            Actualizar
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={async () => {
              if (!selectedRow) return;
              if (window.confirm("¿Eliminar el pedido seleccionado?")) {
                try {
                  await axios.delete(`/v1/pedido/${selectedRow.id}`);
                  setMessage({ open: true, severity: "success", text: "Pedido eliminado correctamente." });
                  setSelectedRow(null);
                  // Si estabas en una página > 0 y borraste el último, podrías querer retroceder una página
                  // Aquí lo simple es recargar:
                  reloadData();
                } catch {
                  setMessage({ open: true, severity: "error", text: "Error al eliminar el pedido." });
                }
              }
            }}
            disabled={!selectedRow}
          >
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

            // props de paginación en servidor
            loading={pedidoLoading}
            rowCount={pedidoRowCount}
            paginationModel={pedidoPaginationModel}
            onPaginationModelChange={setPedidoPaginationModel}
            producciones={producciones}   // <- NUEVO
            almacenes={almacenes}   
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

            // props de paginación en servidor
            loading={articuloLoading}
            rowCount={articuloRowCount}
            paginationModel={articuloPaginationModel}
            onPaginationModelChange={setArticuloPaginationModel}
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
