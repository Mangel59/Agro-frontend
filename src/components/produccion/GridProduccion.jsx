import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";

export default function GridProduccion({ espacioId }) {
  const [producciones, setProducciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFinal: "",
    estado: 1,
  });
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [selectedTipoProduccion, setSelectedTipoProduccion] = useState("");
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);

  useEffect(() => {
    if (!espacioId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de autenticación.");
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`${SiteProps.urlbasev1}/producciones/${espacioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducciones(response.data.content);
      })
      .catch((error) => {
        console.error("Error al cargar producciones:", error);
        setError("Error al cargar las producciones. Por favor, verifica tu conexión o permisos.");
      })
      .finally(() => {
        setLoading(false);
      });

    axios
      .get(`${SiteProps.urlbasev1}/sede/minimal`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setSedes(response.data));

    axios
      .get(`${SiteProps.urlbasev1}/tipo_produccion`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setTiposProduccion(response.data));
  }, [espacioId]);

  const handleDelete = () => {
    if (!selectedRow) return;

    const token = localStorage.getItem("token");
    axios
      .delete(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProducciones((prev) => prev.filter((prod) => prod.id !== selectedRow.id));
        setSelectedRow(null);
        setSnackbar({ open: true, message: "Producción eliminada correctamente.", severity: "success" });
      })
      .catch((error) => {
        console.error("Error al eliminar producción:", error);
        setSnackbar({ open: true, message: "Error al eliminar la producción.", severity: "error" });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    axios
      .put(
        `${SiteProps.urlbasev1}/producciones/${selectedRow.id}`,
        {
          ...formData,
          sede: selectedSede,
          bloque: selectedBloque,
          espacio: selectedEspacio,
          tipoProduccion: selectedTipoProduccion,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProducciones((prev) =>
          prev.map((prod) =>
            prod.id === selectedRow.id ? { ...prod, ...formData } : prod
          )
        );
        setOpen(false);
        setSnackbar({ open: true, message: "Producción actualizada correctamente.", severity: "success" });
      })
      .catch((error) => {
        console.error("Error al actualizar la producción:", error);
        setSnackbar({ open: true, message: "Error al actualizar la producción.", severity: "error" });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const handleEdit = () => {
    if (!selectedRow) return;
    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      fechaInicio: selectedRow.fechaInicio || "",
      fechaFinal: selectedRow.fechaFinal || "",
      estado: selectedRow.estado || 1,
    });
    setSelectedSede(selectedRow.sede || "");
    setSelectedBloque(selectedRow.bloque || "");
    setSelectedEspacio(selectedRow.espacio || "");
    setSelectedTipoProduccion(selectedRow.tipoProduccion || "");
    setOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "tipoProduccion", headerName: "Tipo Producción", width: 150 },
    { field: "espacio", headerName: "Espacio", width: 100 },
    { field: "estado", headerName: "Estado", width: 120 },
  ];

  if (!espacioId) {
    return <Typography>Selecciona un espacio para ver las producciones.</Typography>;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (producciones.length === 0) {
    return <Typography>No hay producciones disponibles para este espacio.</Typography>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
        <Button
          startIcon={<UpdateIcon />}
          variant="outlined"
          onClick={handleEdit}
          color="primary"
          disabled={!selectedRow}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          color="primary"
          disabled={!selectedRow}
        >
          Eliminar
        </Button>
      </Box>
      <DataGrid
        rows={producciones}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        disableSelectionOnClick
        onRowClick={(params) => setSelectedRow(params.row)}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Editar Producción</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="sede-label">Sede</InputLabel>
                <Select
                  labelId="sede-label"
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                >
                  {sedes.map((sede) => (
                    <MenuItem key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!selectedSede}>
                <InputLabel id="bloque-label">Bloque</InputLabel>
                <Select
                  labelId="bloque-label"
                  value={selectedBloque}
                  onChange={(e) => setSelectedBloque(e.target.value)}
                >
                  {bloques.map((bloque) => (
                    <MenuItem key={bloque.id} value={bloque.id}>
                      {bloque.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
                <InputLabel id="espacio-label">Espacio</InputLabel>
                <Select
                  labelId="espacio-label"
                  value={selectedEspacio}
                  onChange={(e) => setSelectedEspacio(e.target.value)}
                >
                  {espacios.map((espacio) => (
                    <MenuItem key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="tipoProduccion-label">Tipo de Producción</InputLabel>
                <Select
                  labelId="tipoProduccion-label"
                  value={selectedTipoProduccion}
                  onChange={(e) => setSelectedTipoProduccion(e.target.value)}
                >
                  {tiposProduccion.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="nombre"
                name="nombre"
                label="Nombre de Producción"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                id="descripcion"
                name="descripcion"
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                id="fechaInicio"
                name="fechaInicio"
                label="Fecha de Inicio"
                type="datetime-local"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                id="fechaFinal"
                name="fechaFinal"
                label="Fecha Final"
                type="datetime-local"
                value={formData.fechaFinal}
                onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
