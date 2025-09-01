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
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalKardex, setTotalKardex] = useState(0);

  const theme = useTheme();

  const reloadData = () => {
    axios.get("/v1/kardex", { params: { page, size: pageSize } })
      .then((res) => {
        setKardexes(res.data.content || res.data);
        setTotalKardex(res.data.totalElements || res.data.length);
        if (res.data.length > 0 && !selectedRow) {
          setSelectedRow(res.data[0]);
        }
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al cargar kardexes" });
      });
  };

  const loadArticulos = (kardexId) => {
    axios.get(`/v1/kardex/${kardexId}/articulos`)
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

  // Contenedor principal de Kardex
  const containerKardex = {
    backgroundColor: theme.palette.mode === "dark" ? "#1e2a2c" : "#c9e6fe",
    padding: 3,
    borderRadius: 2,
  };

  // Contenedor de Artículos del Kardex
  const containerArticulos = {
    backgroundColor: theme.palette.mode === "dark" ? "#2c383b" : "#caddf3",
    padding: 2,
    borderRadius: 2,
  };

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
