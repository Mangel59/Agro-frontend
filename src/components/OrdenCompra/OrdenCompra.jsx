// Vista Previa Orden Compra con selección de artículos y reporte completo
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";
import FormArticuloOrdenCompra from "./FormArticuloOrdenCompra";
import GridArticuloOrdenCompra from "./GridArticuloOrdenCompra";
import VistaPreviaPDFOrdenCompra from "./vistapreviapdfordencompra";
import {
  Box, Button, Typography, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack
} from "@mui/material";

export default function OrdenCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(0);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [selectedArticulosToPrint, setSelectedArticulosToPrint] = useState([]);
  const [reloadArticulos, setReloadArticulos] = useState(false);

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [pedidoId, setPedidoId] = useState("");
  const [categoriaEstadoId, setCategoriaEstadoId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const empresaId = localStorage.getItem("empresaId");

  const reloadData = () => {
    axios.get("/v1/orden_compra", {
      params: {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sort: sortModel[0]?.field,
        order: sortModel[0]?.sort,
      },
    })
      .then((res) => {
        const data = Array.isArray(res.data.data) ? res.data.data : res.data;
        const ordenesConNombre = data.map((orden) => ({
          ...orden,
          proveedorNombre: orden.proveedor?.nombre || ` ${orden.proveedorId}`,
        }));
        setOrdenes(ordenesConNombre);
        setRowCount(res.data.totalCount || ordenesConNombre.length);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar órdenes de compra" });
      });
  };

  const handleSearch = () => {
    if (!pedidoId || !categoriaEstadoId) {
      setMessage({ open: true, severity: "warning", text: "Debes ingresar el ID de pedido y categoría estado." });
      return;
    }

    const orden = ordenes.find((o) => String(o.pedidoId) === String(pedidoId));
    if (!orden) {
      setMessage({ open: true, severity: "error", text: "No se encontró la orden para ese pedido." });
      return;
    }

    setSelectedRow(orden);
    loadArticulos(orden.id);
    generarVistaPreviaPDF(orden.pedidoId);
  };

  const loadArticulos = (ordenCompraId) => {
    axios.get(`/v1/orden_compra/${ordenCompraId}/articulos`)
      .then(res => setArticuloItems(res.data))
      .catch(() => setArticuloItems([]));
  };

  const generarVistaPreviaPDF = (pedido) => {
    axios({
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        empresa_id: parseInt(empresaId),
        pedido_id: parseInt(pedido),
        categoria_estado_id: parseInt(categoriaEstadoId),
      },
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        setPreviewUrl(url);
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al generar vista previa." }));
  };

  const imprimirOrdenCompleta = () => {
    if (!selectedRow?.pedidoId || !categoriaEstadoId) return;
    axios({
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        empresa_id: parseInt(empresaId),
        pedido_id: parseInt(selectedRow.pedidoId),
        categoria_estado_id: parseInt(categoriaEstadoId),
      },
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `orden_compra_${selectedRow.pedidoId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al imprimir orden." }));
  };

  const imprimirSeleccionados = () => {
    const ids = selectedArticulosToPrint.map(a => a.id);
    if (!ids.length || !categoriaEstadoId) {
      setMessage({ open: true, severity: "warning", text: "Selecciona artículos y categoría estado." });
      return;
    }
    axios({
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        articulo_ids: ids,
        categoria_estado_id: parseInt(categoriaEstadoId),
        emp_id: parseInt(empresaId),
        ped_id: selectedRow?.pedidoId,
      },
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `orden_articulos_seleccionados.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al imprimir seleccionados." }));
  };

  const limpiarBusqueda = () => {
    setPedidoId("");
    setCategoriaEstadoId("");
    setPreviewUrl("");
    setSelectedArticulosToPrint([]);
    setSelectedRow(null);
    setArticuloItems([]);
  };

  useEffect(() => { reloadData(); }, [paginationModel, sortModel]);
  useEffect(() => { if (selectedRow?.id) loadArticulos(selectedRow.id); }, [selectedRow, reloadArticulos]);

  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Órdenes de Compra</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>BUSCAR POR ID</Button>
        </Stack>
      </Box>

      <FormOrdenCompra
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        setFormMode={setFormMode}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
      />

      <GridOrdenCompra
        ordenes={ordenes}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
      />

      <Divider sx={{ my: 4 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Artículos de la Orden Seleccionada</Typography>
        <FormArticuloOrdenCompra
          selectedRow={selectedArticulo}
          ordenCompraId={selectedRow?.id || ""}
          setSelectedRow={setSelectedArticulo}
          setMessage={setMessage}
          reloadData={() => setReloadArticulos(prev => !prev)}
        />
      </Box>

      <GridArticuloOrdenCompra
        items={articuloItems}
        setSelectedRow={setSelectedArticulo}
        setSelectedRows={setSelectedArticulosToPrint}
      />

      <Dialog open={searchDialogOpen} onClose={() => { setSearchDialogOpen(false); limpiarBusqueda(); }} fullWidth maxWidth="md">
        <DialogTitle>Buscar Orden de Compra</DialogTitle>
        <DialogContent>
          <TextField
            label="ID de Pedido"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Categoría Estado"
            value={categoriaEstadoId}
            onChange={(e) => setCategoriaEstadoId(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
          />

          {selectedRow && previewUrl && (
            <>
              <VistaPreviaPDFOrdenCompra orden={selectedRow} />
              <iframe
                src={previewUrl}
                width="100%"
                height="600px"
                style={{ marginTop: '20px', border: '1px solid #ccc' }}
                title="Vista Previa Orden Compra"
              />
              <Typography variant="subtitle1" sx={{ mt: 3 }}>Artículos de la Orden</Typography>
              <GridArticuloOrdenCompra
                items={articuloItems}
                setSelectedRow={() => {}}
                setSelectedRows={setSelectedArticulosToPrint}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSearchDialogOpen(false); limpiarBusqueda(); }}>Cerrar</Button>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button
            onClick={imprimirSeleccionados}
            disabled={!selectedRow || !categoriaEstadoId}
            variant="contained"
            color="info"
          >
            Imprimir Seleccionados
          </Button>
          <Button
            onClick={imprimirOrdenCompleta}
            disabled={!selectedRow || !categoriaEstadoId}
            variant="contained"
            color="secondary"
          >
            Imprimir Orden
          </Button>
        </DialogActions>
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
