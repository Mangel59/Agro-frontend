import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";
import FormArticuloOrdenCompra from "./FormArticuloOrdenCompra";
import GridArticuloOrdenCompra from "./GridArticuloOrdenCompra";
import {
  Box, Button, Typography, Grid, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem
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
  const [reloadArticulos, setReloadArticulos] = useState(false);

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

  const loadArticulos = (ordenCompraId) => {
    axios.get(`/v1/orden_compra/${ordenCompraId}/articulos`)
      .then(res => setArticuloItems(res.data))
      .catch(() => setArticuloItems([]));
  };

  useEffect(() => { reloadData(); }, [paginationModel, sortModel]);

  useEffect(() => {
    if (selectedRow?.id) loadArticulos(selectedRow.id);
  }, [selectedRow, reloadArticulos]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Órdenes de Compra</Typography>
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

      <Box sx={{ height: 350, mb: 10 }}>
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
      </Box>

      <Divider sx={{ my: 6 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <Typography variant="h6">Artículos de la Orden Seleccionada</Typography>
        <Box display="flex" gap={2}>
          <FormArticuloOrdenCompra
            selectedRow={selectedArticulo}
            ordenCompraId={selectedRow?.id || ""}
            setSelectedRow={setSelectedArticulo}
            setMessage={setMessage}
            reloadData={() => setReloadArticulos(prev => !prev)}
          />
        </Box>
      </Box>

      <Box>
        <GridArticuloOrdenCompra
          items={articuloItems}
          selectedRow={selectedArticulo}
          setSelectedRow={setSelectedArticulo}
        />
      </Box>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
