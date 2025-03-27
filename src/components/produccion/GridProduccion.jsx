/**
 * @file GridProduccion.jsx
 * @module GridProduccion
 * @description Componente que permite visualizar, editar y eliminar producciones asociadas a un espacio.
 * Incluye lógica para cargar dinámicamente sedes, bloques, espacios y tipos de producción, así como un formulario para editar producciones seleccionadas.
 * @author Karla
 */

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

/**
 * @typedef {Object} ProduccionRow
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} fechaInicio
 * @property {string} fechaFinal
 * @property {number} estado
 * @property {string|number} sede
 * @property {string|number} bloque
 * @property {string|number} espacio
 * @property {string|number} tipoProduccion
 */

/**
 * @typedef {Object} GridProduccionProps
 * @property {number} espacioId
 * @property {string|number} selectedSede
 * @property {string|number} selectedBloque
 * @property {string|number} selectedEspacio
 * @property {Function} exposeReload - Func para exponer la recarga a otros componentes
 */

/**
 * Componente GridProduccion
 * @param {GridProduccionProps} props
 * @returns {JSX.Element}
 */
export default function GridProduccion({ espacioId, selectedSede, selectedBloque, selectedEspacio, exposeReload }) {
  const [producciones, setProducciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({ nombre: "", descripcion: "", fechaInicio: "", fechaFinal: "", estado: 1 });
  const [internalSede, setInternalSede] = useState("");
  const [internalBloque, setInternalBloque] = useState("");
  const [internalEspacio, setInternalEspacio] = useState("");
  const [selectedTipoProduccion, setSelectedTipoProduccion] = useState("");

  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProducciones = () => {
    if (!espacioId || !token) return;
    setLoading(true);
    axios.get(`${SiteProps.urlbasev1}/producciones/${espacioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setProducciones(res.data.content))
    .catch(() => setError("Error al cargar producciones"))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!espacioId) return;
    fetchProducciones();
    exposeReload(() => fetchProducciones());

    axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setSedes(res.data));

    axios.get(`${SiteProps.urlbasev1}/tipo_produccion`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setTiposProduccion(res.data));
  }, [espacioId]);

  const fetchBloquesBySede = (sedeId) => {
    axios.get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setBloques(res.data));
  };

  const fetchEspaciosByBloque = (bloqueId) => {
    axios.get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setEspacios(res.data));
  };

  useEffect(() => { if (internalSede) fetchBloquesBySede(internalSede); }, [internalSede]);
  useEffect(() => { if (internalBloque) fetchEspaciosByBloque(internalBloque); }, [internalBloque]);

  const handleEdit = async () => {
    if (!selectedRow) return;
    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      fechaInicio: selectedRow.fechaInicio || "",
      fechaFinal: selectedRow.fechaFinal || "",
      estado: selectedRow.estado || 1,
    });

    try {
      const sedeId = selectedRow.sede || selectedSede;
      const bloqueId = selectedRow.bloque || selectedBloque;
      const espId = selectedRow.espacio || selectedEspacio;

      setInternalSede(sedeId);
      const bloquesRes = await axios.get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, { headers: { Authorization: `Bearer ${token}` } });
      setBloques(bloquesRes.data);
      setInternalBloque(bloqueId);

      const espaciosRes = await axios.get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, { headers: { Authorization: `Bearer ${token}` } });
      setEspacios(espaciosRes.data);
      setInternalEspacio(espId);
      setSelectedTipoProduccion(selectedRow.tipoProduccion || "");
      setOpen(true);
    } catch (err) {
      console.error("Error al cargar datos para edición:", err);
      setSnackbar({ open: true, message: "Error al cargar datos para edición.", severity: "error" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, {
      ...formData,
      sede: internalSede,
      bloque: internalBloque,
      espacio: internalEspacio,
      tipoProduccion: selectedTipoProduccion,
    }, { headers: { Authorization: `Bearer ${token}` } })
    .then(() => {
      setSnackbar({ open: true, message: "Producción actualizada correctamente.", severity: "success" });
      setOpen(false);
      fetchProducciones();
    })
    .catch(() => {
      setSnackbar({ open: true, message: "Error al actualizar la producción.", severity: "error" });
    });
  };

  const handleDelete = () => {
    if (!selectedRow) return;
    axios.delete(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setSnackbar({ open: true, message: "Producción eliminada correctamente.", severity: "success" });
      setSelectedRow(null);
      fetchProducciones();
    })
    .catch(() => {
      setSnackbar({ open: true, message: "Error al eliminar la producción.", severity: "error" });
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button startIcon={<UpdateIcon />} variant="outlined" onClick={handleEdit} disabled={!selectedRow}>ACTUALIZAR</Button>
        <Button startIcon={<DeleteIcon />} variant="outlined" onClick={handleDelete} disabled={!selectedRow}>ELIMINAR</Button>
      </Box>

      <DataGrid
        rows={producciones}
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          { field: "nombre", headerName: "Nombre", width: 150 },
          { field: "descripcion", headerName: "Descripción", width: 250 },
          { field: "tipoProduccion", headerName: "Tipo Producción", width: 150 },
          { field: "espacio", headerName: "Espacio", width: 100 },
          { field: "estado", headerName: "Estado", width: 120 },
        ]}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
        autoHeight
      />

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Editar Producción</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sede</InputLabel>
              <Select value={internalSede} onChange={(e) => setInternalSede(e.target.value)}>
                {sedes.map((s) => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" disabled={!internalSede}>
              <InputLabel>Bloque</InputLabel>
              <Select value={internalBloque} onChange={(e) => setInternalBloque(e.target.value)}>
                {bloques.map((b) => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" disabled={!internalBloque}>
              <InputLabel>Espacio</InputLabel>
              <Select value={internalEspacio} onChange={(e) => setInternalEspacio(e.target.value)}>
                {espacios.map((e) => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Producción</InputLabel>
              <Select value={selectedTipoProduccion} onChange={(e) => setSelectedTipoProduccion(e.target.value)}>
                {tiposProduccion.map((t) => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth label="Nombre" margin="normal" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <TextField fullWidth label="Descripción" margin="normal" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
            <TextField fullWidth label="Fecha Inicio" type="datetime-local" margin="normal" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} />
            <TextField fullWidth label="Fecha Final" type="datetime-local" margin="normal" value={formData.fechaFinal} onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })} />
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
