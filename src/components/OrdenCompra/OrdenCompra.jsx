import React, { useEffect, useState, useMemo } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";
import FormArticuloOrdenCompra from "./FormArticuloOrdenCompra";
import GridArticuloOrdenCompra from "./GridArticuloOrdenCompra";
import ReOC from "../RE_oc/re_oc";
import { Box, Typography, Button, Dialog, useTheme } from "@mui/material";

export default function OrdenCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);


  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // 🔹 NUEVO: proveedores para mapear id -> name
  const [proveedores, setProveedores] = useState([]);

  const theme = useTheme();

  const containerOrdenes = {
    backgroundColor: theme.palette.mode === "dark" ? "#1e2a2c" : "#c9e6fe",
    padding: 3,
    borderRadius: 2,
  };

  const containerArticulos = {
    backgroundColor: theme.palette.mode === "dark" ? "#2c383b" : "#caddf3",
    padding: 2,
    borderRadius: 2,
  };

  // 🔹 params para backend
  const queryParams = useMemo(() => {
    const params = {
      page: paginationModel.page ?? 0,
      size: paginationModel.pageSize ?? 10,
    };
    if (Array.isArray(sortModel) && sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      if (field && sort) params.sort = `${field},${sort}`;
    }
    const quickItem = filterModel?.items?.find(it => it.value && !it.operator);
    if (quickItem?.value) params.q = String(quickItem.value);
    return params;
  }, [paginationModel, sortModel, filterModel]);

  // 🔹 NUEVO: cargar proveedores una vez
  useEffect(() => {
    axios.get("/v1/items/proveedor/0")
      .then(res => setProveedores(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProveedores([]));
  }, []);

  // 🔹 NUEVO: mapa id -> name (asegurando número)
  const proveedoresMap = useMemo(
    () => Object.fromEntries((proveedores || []).map(p => [Number(p.id), p.name])),
    [proveedores]
  );
const [presentaciones, setPresentaciones] = useState([]);

useEffect(() => {
  axios.get("/v1/items/producto_presentacion/0")
    .then(res => setPresentaciones(Array.isArray(res.data) ? res.data : []))
    .catch(() => setPresentaciones([]));
}, []);

const presentacionesMap = useMemo(
  () => Object.fromEntries((presentaciones || []).map(pp => [Number(pp.id), pp.name])),
  [presentaciones]
);

  // 🔹 Cargar órdenes
  const reloadData = () => {
    setLoading(true);
    axios
      .get("/v1/orden-compra", { params: queryParams })
      .then((res) => {
        let data = [];
        let total = 0;
        if (Array.isArray(res.data)) {
          data = res.data;
          const headerTotal = res.headers?.["x-total-count"];
          total = headerTotal ? Number(headerTotal) : data.length;
        } else if (res.data && typeof res.data === "object") {
          data = Array.isArray(res.data.content) ? res.data.content : [];
          total = typeof res.data.totalElements === "number" ? res.data.totalElements : data.length;
        }
        setOrdenes(data);
        setRowCount(total);
        if (data.length > 0) {
          const stillSelected = data.find((r) => r.id === selectedRow?.id);
          setSelectedRow(stillSelected || data[0]);
        } else {
          setSelectedRow({});
        }
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar órdenes de compra" });
        setOrdenes([]);
        setRowCount(0);
        setSelectedRow({});
      })
      .finally(() => setLoading(false));
  };

  // 🔹 Artículos por orden
  const loadArticulos = (ordenId) => {
    if (!ordenId) { setArticuloItems([]); return; }
    axios
      .get(`/v1/orden-compra/${ordenId}/articulos`)
      .then((res) => setArticuloItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setArticuloItems([]));
  };

  useEffect(() => { reloadData(); /* eslint-disable-next-line */ }, [queryParams]);

  useEffect(() => {
    if (selectedRow?.id) loadArticulos(selectedRow.id);
    else setArticuloItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow, reloadArticulos]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ ...containerOrdenes, mb: 4 }}>
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
          <Typography variant="h6" gutterBottom>Lista de Ordenes de Compra</Typography>
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
            proveedoresMap={proveedoresMap}
          />
        </Box>
      </Box>

      {selectedRow?.id && (
        <Box sx={{ ...containerArticulos, mt: 4 }}>
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

          <GridArticuloOrdenCompra 
          items={articuloItems} 
          setSelectedRow={setSelectedArticulo} 
          presentacionesMap={presentacionesMap} />
        </Box>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="lg">
        <ReOC setOpen={setSearchDialogOpen} />
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
