
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";
import FormArticuloOrdenCompra from "./FormArticuloOrdenCompra";
import GridArticuloOrdenCompra from "./GridArticuloOrdenCompra";
import VistaPreviaPDFOrdenCompra from "./vistapreviapdfordencompra";
import ReOC from "../RE_oc/re_oc";
import {
  Box, Typography, Divider, Button, Dialog
} from "@mui/material";

export default function OrdenCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);

  const reloadData = () => {
    axios.get("/v1/orden_compra")
      .then((res) => {
        setOrdenes(res.data);
        if (res.data.length > 0 && !selectedRow) {
          setSelectedRow(res.data[0]);
        }
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar órdenes de compra" });
      });
  };

  const loadArticulos = (ordenId) => {
    axios.get(`/v1/orden_compra/${ordenId}/articulos`)
      .then(res => setArticuloItems(res.data))
      .catch(() => setArticuloItems([]));
  };

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (selectedRow) loadArticulos(selectedRow.id);
    else setArticuloItems([]);
  }, [selectedRow, reloadArticulos]);

  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Órdenes de Compra</Typography>
        <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>Buscar reporte</Button>
      </Box>
      <FormOrdenCompra
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Lista de Órdenes de Compra</Typography>
        <GridOrdenCompra
          ordenes={ordenes}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </Box>

      {selectedRow && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Artículos de la Orden de Compra seleccionada</Typography>
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
              setSelectedRow={setSelectedArticulo}
            />
          </Box>
        </>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="lg">
        <ReOC setOpen={setSearchDialogOpen} />
        <Button onClick={buscarOrden}>Buscar</Button>

      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
