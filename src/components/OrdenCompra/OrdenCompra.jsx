// OrdenCompra.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";
import FormArticuloOrdenCompra from "./FormArticuloOrdenCompra";
import GridArticuloOrdenCompra from "./GridArticuloOrdenCompra";
import ReOC from "../RE_oc/re_oc";
import { Box, Typography, Divider, Button, Dialog } from "@mui/material";

export default function OrdenCompra() {
  const [ordenes, setOrdenes] = useState([]);
  // ❗ antes: null → ponlo como objeto vacío para cumplir PropTypes de FormOrdenCompra
  const [selectedRow, setSelectedRow] = useState({});

  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);

  // 👇 estados para el DataGrid (server-mode) que tu GridOrdenCompra marca como required
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [/* filterModel no se usa directamente aquí */, setFilterModel] = useState({ items: [] });

  const reloadData = () => {
    setLoading(true);
    axios.get("/v1/orden_compra")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setOrdenes(data);
        setRowCount(data.length); // si luego haces paginado real en backend, actualiza con el total
        // si no hay selección aún, selecciona la primera
        if (data.length > 0 && !selectedRow?.id) {
          setSelectedRow(data[0]);
        }
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar órdenes de compra" });
      })
      .finally(() => setLoading(false));
  };

  const loadArticulos = (ordenId) => {
    if (!ordenId) { setArticuloItems([]); return; }
    axios.get(`/v1/orden_compra/${ordenId}/articulos`)
      .then(res => setArticuloItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setArticuloItems([]));
  };

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (selectedRow?.id) loadArticulos(selectedRow.id);
    else setArticuloItems([]);
  }, [selectedRow, reloadArticulos]);

  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Órdenes de Compra</Typography>
        <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>Buscar reporte</Button>
      </Box>

      <FormOrdenCompra
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Lista de Órdenes de Compra</Typography>
        <GridOrdenCompra
          ordenes={ordenes}
          rowCount={rowCount}
          loading={loading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
          setFilterModel={setFilterModel}
          setSelectedRow={setSelectedRow}
        />
      </Box>

      {selectedRow?.id && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Artículos de la Orden de Compra seleccionada</Typography>
            <Box display="flex" gap={2}>
              <FormArticuloOrdenCompra
                selectedRow={selectedArticulo}
                ordenCompraId={selectedRow.id}
                setSelectedRow={setSelectedArticulo}
                setMessage={setMessage}
                reloadData={() => setReloadArticulos(prev => !prev)}
              />
            </Box>
          </Box>

          <Box>
            <GridArticuloOrdenCompra
              items={articuloItems}
              setSelectedRow={setSelectedArticulo}
            />
          </Box>
        </>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="lg">
        <ReOC setOpen={setSearchDialogOpen} />
        {/* ❌ este botón lanzaba error porque buscarOrden no existe. Quítalo o define la función. */}
        {/* <Button onClick={buscarOrden}>Buscar</Button> */}
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
