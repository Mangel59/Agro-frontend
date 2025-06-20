import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormKardex from "./FromKardex";
import GridKardex from "./GridKardex";
import GridArticuloKardex from "./GridArticuloKardex";
import FormArticuloKardex from "./FormArticuloKardex";
import Rkardex from "../RKardex/Rkardex";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider
} from "@mui/material";

export default function Kardex() {
  const [kardexes, setKardexes] = useState([]);
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

  const [reporteOpen, setReporteOpen] = useState(false); 

  const reloadData = () => {
    axios.get("/v1/kardex")
      .then((res) => {
        setKardexes(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar kardexes:", err);
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
    if (selectedRow) {
      loadArticulos(selectedRow.id);
    }
  }, [selectedRow, reloadArticulos]);

  const handleSearch = () => {
    if (!searchId) return;
    axios.get(`/v1/kardex/${searchId}`)
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch(() => {
        setSearchResult(null);
        setMessage({ open: true, severity: "error", text: "No se encontró el Kardex" });
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Kardex</Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={() => setSearchDialogOpen(true)}>Buscar por ID</Button>
          <Button variant="outlined" color="secondary" onClick={() => setReporteOpen(true)}>
            Ver Reporte Kardex
          </Button>
        </Box>
      </Box>

      <FormKardex
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        setFormMode={setFormMode}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
      />

      <Box sx={{ height: 350, mb: 12 }}>
        <GridKardex
          kardexes={kardexes}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          pageSizeOptions={[5, 10, 15]}
        />
      </Box>

      <Divider sx={{ my: 10 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
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

      <Box>
        <GridArticuloKardex
          items={articuloItems}
          selectedRow={selectedArticulo}
          setSelectedRow={setSelectedArticulo}
        />
      </Box>

      {/* Dialog para buscar por ID */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} fullWidth>
        <DialogTitle>Buscar Kardex por ID</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="ID de Kardex"
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
        </DialogActions>
      </Dialog>

      {/* Dialog del reporte */}
      <Dialog open={reporteOpen} onClose={() => setReporteOpen(false)} fullWidth maxWidth="xl">
        <DialogTitle>Reporte Kardex</DialogTitle>
        <DialogContent>
          <Rkardex />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReporteOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
