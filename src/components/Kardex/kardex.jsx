import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormKardex from "./FromKardex";
import GridKardex from "./GridKardex";
import GridArticuloKardex from "./GridArticuloKardex";
import FormArticuloKardex from "./FormArticuloKardex";
import ReKardex from "../RKardex/Rkardex";
import { Box, Typography, Button, Dialog, Divider, useTheme } from "@mui/material";

export default function Kardex() {
  const [kardexes, setKardexes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // ✅ Artículos
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);

  const theme = useTheme();

  // ----------------- PAGINACIÓN KARDEX -----------------
  const [kardexPage, setKardexPage] = useState({ page: 0, size: 10 });
  const [totalKardex, setTotalKardex] = useState(0);
  const [loadingKardex, setLoadingKardex] = useState(false);

  // ----------------- PAGINACIÓN ARTICULOS -----------------
  const [articuloPage, setArticuloPage] = useState({ page: 0, size: 10 });
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [loadingArticulos, setLoadingArticulos] = useState(false);

  // ----------------- FUNCIONES -----------------
  const reloadData = () => {
    setLoadingKardex(true);
    axios.get("/v1/kardex", { params: { page: kardexPage.page, size: kardexPage.size } })
      .then((res) => {
        const data = res.data.content || res.data;
        setKardexes(data);
        setTotalKardex(res.data.page?.totalElements || data.length);

        if (data.length > 0 && !selectedRow) {
          setSelectedRow(data[0]);
        }
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar kardexes" });
      })
      .finally(() => setLoadingKardex(false));
  };

  const loadArticulos = (kardexId) => {
    if (!kardexId) { setArticuloItems([]); return; }
    setLoadingArticulos(true);
    axios.get(`/v1/articulo-kardex`, {
      params: { kardexId, page: articuloPage.page, size: articuloPage.size }
    })
      .then(res => {
        const data = res.data.content || res.data;
        setArticuloItems(data);
        setTotalArticulos(res.data.page?.totalElements || data.length);
      })
      .catch(() => setArticuloItems([]))
      .finally(() => setLoadingArticulos(false));
  };

  // ----------------- EFFECTS -----------------
  useEffect(() => {
    reloadData();
  }, [kardexPage.page, kardexPage.size]);

  useEffect(() => {
    if (selectedRow) loadArticulos(selectedRow.id);
    else setArticuloItems([]);
  }, [selectedRow, reloadArticulos, articuloPage.page, articuloPage.size]);

  // ----------------- ESTILOS -----------------
  const containerKardex = {
    backgroundColor: theme.palette.mode === "dark" ? "#1e2a2c" : "#c9e6fe",
    padding: 3,
    borderRadius: 2,
  };

  const containerArticulos = {
    backgroundColor: theme.palette.mode === "dark" ? "#2c383b" : "#caddf3",
    padding: 2,
    borderRadius: 2,
  };

  // ----------------- RENDER -----------------
  return (
    <Box sx={{ p: 2 }}>
      {/* Contenedor principal de Kardex */}
      <Box sx={{ ...containerKardex, mb: 4 }}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Gestión de Kardex</Typography>
          <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>Buscar reporte</Button>
        </Box>

        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setFormMode("create"); setFormOpen(true); }}
          >
            Crear
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setFormMode("edit"); setFormOpen(true); }}
            disabled={!selectedRow}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={async () => {
              if (!selectedRow) return;
              if (window.confirm("¿Eliminar el Kardex seleccionado?")) {
                try {
                  await axios.delete(`/v1/kardex/${selectedRow.id}`);
                  setMessage({ open: true, severity: "success", text: "Kardex eliminado correctamente." });
                  setSelectedRow(null);
                  reloadData();
                } catch {
                  setMessage({ open: true, severity: "error", text: "Error al eliminar el Kardex." });
                }
              }
            }}
            disabled={!selectedRow}
          >
            Eliminar
          </Button>
        </Box>

        <FormKardex
          open={formOpen}
          setOpen={setFormOpen}
          formMode={formMode}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          reloadData={reloadData}
          setMessage={setMessage}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Lista de Kardex</Typography>
          <GridKardex
            kardexes={kardexes}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            loading={loadingKardex}
            paginationModel={kardexPage}
            setPaginationModel={setKardexPage}
            rowCount={totalKardex}
          />
        </Box>
      </Box>

      {/* Contenedor de Artículos */}
      {selectedRow && (
        <Box sx={{ ...containerArticulos, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Artículos del Kardex seleccionado</Typography>
            <Box display="flex" gap={2}>
              <FormArticuloKardex
                selectedRow={selectedArticulo}
                kardexId={selectedRow?.id || ""}
                setSelectedRow={setSelectedArticulo}
                setMessage={setMessage}
                reloadData={() => setReloadArticulos(prev => !prev)}
              />
            </Box>
          </Box>

          <GridArticuloKardex
            items={articuloItems}
            setSelectedRow={setSelectedArticulo}
            loading={loadingArticulos}
            paginationModel={articuloPage}
            setPaginationModel={setArticuloPage}
            rowCount={totalArticulos}
          />
        </Box>
      )}

      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth maxWidth="lg">
        <ReKardex setOpen={setSearchDialogOpen} />
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
