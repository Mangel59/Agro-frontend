/**
 * @file GridProduccion.jsx
 * @module GridProduccion
 * @description Componente que muestra una grilla de producciones asociadas a un espacio. Permite editar o eliminar producciones usando DataGrid de Material UI. Incluye manejo de formularios y notificaciones con Snackbar.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

/**
 * Componente GridProduccion.
 *
 * Muestra una tabla de producciones relacionadas con un espacio específico.
 * Permite editar o eliminar una producción seleccionada.
 *
 * @param {Object} props - Props del componente.
 * @param {number|string} props.espacioId - ID del espacio seleccionado.
 * @returns {JSX.Element} Tabla con producciones.
 */
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
  const [selectedBloque] = useState(""); // No usado directamente
  const [selectedEspacio] = useState(""); // No usado directamente
  const [selectedTipoProduccion, setSelectedTipoProduccion] = useState("");
  const [sedes, setSedes] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);

  // Cargar datos al cambiar el espacioId
  useEffect(() => {
    if (!espacioId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de autenticación.");
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`${SiteProps.urlbasev1}/producciones/${espacioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setProducciones(res.data.content))
      .catch(() => {
        setError("Error al cargar las producciones. Verifica tu conexión o permisos.");
      })
      .finally(() => {
        setLoading(false);
      });

    axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setSedes(res.data));

    axios.get(`${SiteProps.urlbasev1}/tipo_produccion`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setTiposProduccion(res.data));
  }, [espacioId]);

  /**
   * Maneja la eliminación de una producción.
   */
  const handleDelete = () => {
    if (!selectedRow) return;
    const token = localStorage.getItem("token");

    axios.delete(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setProducciones((prev) => prev.filter((prod) => prod.id !== selectedRow.id));
        setSelectedRow(null);
        setSnackbar({ open: true, message: "Producción eliminada correctamente.", severity: "success" });
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Error al eliminar la producción.", severity: "error" });
      });
  };

  /**
   * Maneja el envío del formulario para actualizar una producción.
   * @param {React.FormEvent} event - Evento del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    axios.put(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, {
      ...formData,
      sede: selectedSede,
      bloque: selectedBloque,
      espacio: selectedEspacio,
      tipoProduccion: selectedTipoProduccion,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setProducciones((prev) =>
          prev.map((prod) =>
            prod.id === selectedRow.id ? { ...prod, ...formData } : prod
          )
        );
        setOpen(false);
        setSnackbar({ open: true, message: "Producción actualizada correctamente.", severity: "success" });
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Error al actualizar la producción.", severity: "error" });
      });
  };

  /**
   * Cierra el snackbar de mensajes.
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  /**
   * Abre el formulario para editar una producción.
   */
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

  if (!espacioId) return <Typography>Selecciona un espacio para ver las producciones.</Typography>;
  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
      <CircularProgress />
    </Box>
  );
  if (error) return <Typography color="error">{error}</Typography>;
  if (producciones.length === 0) return <Typography>No hay producciones disponibles para este espacio.</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
        <Button startIcon={<UpdateIcon />} variant="outlined" onClick={handleEdit} color="primary" disabled={!selectedRow}>
          Editar
        </Button>
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleDelete} color="primary" disabled={!selectedRow}>
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
              <TextField label="Nombre de Producción" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} fullWidth margin="normal" />
              <TextField label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} fullWidth margin="normal" />
              <TextField label="Fecha de Inicio" type="datetime-local" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} fullWidth margin="normal" />
              <TextField label="Fecha Final" type="datetime-local" value={formData.fechaFinal} onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })} fullWidth margin="normal" />
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

GridProduccion.propTypes = {
  espacioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
