/**
 * @file FromEspacioOcupacion.jsx
 * @module FromEspacioOcupacion
 * @description Formulario modal para crear, actualizar o eliminar ocupaciones de espacios.
 * Permite seleccionar sede, bloque, espacio, actividad, fechas y estado.
 *
 * @component
 * @name FromEspacioOcupacion
 * @exports FromEspacioOcupacion
 *
 * @param {Object} props - Props del componente.
 * @param {Object} props.selectedRow - Fila seleccionada con datos del registro.
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {Function} props.setMessage - Función para mostrar mensajes en Snackbar.
 * @param {Function} props.reloadData - Función para recargar datos de la tabla.
 * @returns {JSX.Element} Formulario de ocupación de espacio.
 */
import React from "react"; // ✅ ¡Esta línea es necesaria!
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { SiteProps } from "../dashboard/SiteProps";


export default function FromEspacioOcupacion(props) {

  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [sedes, setSedes] = React.useState([]);
  const [bloques, setBloques] = React.useState([]);
  const [espacios, setEspacios] = React.useState([]);
  const [actividades, setActividades] = React.useState([]);
  const selectedRow = props.selectedRow || {};

  React.useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        props.setMessage({ open: true, severity: "error", text: "Error al cargar las sedes." });
      }
    };
    fetchSedes();
  }, []);

  React.useEffect(() => {
    if (!selectedRow.sede) return;
    const fetchBloques = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/bloque/minimal/sede/${selectedRow.sede}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBloques(response.data || []);
      } catch (error) {
        props.setMessage({ open: true, severity: "error", text: "Error al cargar los bloques." });
      }
    };
    fetchBloques();
  }, [selectedRow.sede]);

  React.useEffect(() => {
    if (!selectedRow.bloque) return;
    const fetchEspacios = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/espacio/minimal/bloque/${selectedRow.bloque}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEspacios(response.data || []);
      } catch (error) {
        props.setMessage({ open: true, severity: "error", text: "Error al cargar los espacios." });
      }
    };
    fetchEspacios();
  }, [selectedRow.bloque]);

  React.useEffect(() => {
    if (open) {
      const fetchActividades = async () => {
        try {
          const response = await axios.get(`${SiteProps.urlbasev1}/actividad_ocupacion/minimal`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setActividades(response.data || []);
        } catch (error) {
          props.setMessage({ open: true, severity: "error", text: "Error al cargar actividades." });
        }
      };
      fetchActividades();
    }
  }, [open]);

  const formatDateTime = (date) => new Date(date).toISOString().slice(0, 19);

  const create = () => {
    props.setSelectedRow({ id: 0, espacio: "", actividad: "", fechaInicio: "", fechaFin: "", estado: 1 });
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      return props.setMessage({ open: true, severity: "error", text: "Seleccione una fila para actualizar." });
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      return props.setMessage({ open: true, severity: "error", text: "Seleccione una fila para eliminar." });
    }
    axios.delete(`${SiteProps.urlbasev1}/espacio_ocupacion/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({ open: true, severity: "success", text: "Registro eliminado con éxito." });
        props.reloadData();
      })
      .catch(() => {
        props.setMessage({ open: true, severity: "error", text: "Error al eliminar el registro." });
      });
  };

  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id || null,
      espacio: selectedRow.espacio,
      actividadOcupacion: selectedRow.actividad,
      fechaInicio: formatDateTime(selectedRow.fechaInicio),
      fechaFin: formatDateTime(selectedRow.fechaFin),
      estado: selectedRow.estado,
    };

    const url = `${SiteProps.urlbasev1}/espacio_ocupacion`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Registro creado con éxito." : "Registro actualizado con éxito.",
        });
        props.reloadData();
        setOpen(false);
      })
      .catch(() => {
        props.setMessage({ open: true, severity: "error", text: "Error al enviar datos." });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={create}>Agregar</Button>
        <Button variant="outlined" startIcon={<UpdateIcon />} onClick={update} sx={{ mx: 1 }}>Actualizar</Button>
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={deleteRow} >Eliminar</Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{methodName === "Add" ? "Agregar Registro" : "Actualizar Registro"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select value={selectedRow.sede || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, sede: e.target.value })}>
              {sedes.map((sede) => <MenuItem key={sede.id} value={sede.id}>{sede.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Bloque</InputLabel>
            <Select value={selectedRow.bloque || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, bloque: e.target.value })}>
              {bloques.map((bloque) => <MenuItem key={bloque.id} value={bloque.id}>{bloque.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Espacio</InputLabel>
            <Select value={selectedRow.espacio || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, espacio: e.target.value })}>
              {espacios.map((espacio) => <MenuItem key={espacio.id} value={espacio.id}>{espacio.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Actividad</InputLabel>
            <Select value={selectedRow.actividad || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, actividad: e.target.value })}>
              {actividades.map((actividad) => <MenuItem key={actividad.id} value={actividad.id}>{actividad.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Fecha de Inicio" type="datetime-local" InputLabelProps={{ shrink: true }} value={selectedRow.fechaInicio || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, fechaInicio: e.target.value })} margin="normal" />
          <TextField fullWidth label="Fecha de Fin" type="datetime-local" InputLabelProps={{ shrink: true }} value={selectedRow.fechaFin || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, fechaFin: e.target.value })} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select value={selectedRow.estado || 1} onChange={(e) => props.setSelectedRow({ ...selectedRow, estado: e.target.value })}>
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
