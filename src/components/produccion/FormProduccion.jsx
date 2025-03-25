/**
 * @file FormProduccion.jsx
 * @module FormProduccion
 * @description Formulario para agregar o editar una producción. Permite seleccionar sede, bloque, espacio y tipo de producción.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormProduccion.
 *
 * Formulario para agregar o editar una producción, permitiendo seleccionar sede, bloque, espacio y tipo de producción.
 *
 * @param {Object} props - Props del componente.
 * @param {Function} props.reloadProducciones - Función para recargar la lista de producciones después de una actualización.
 * @param {Function} props.setMessage - Función para mostrar mensajes en la interfaz.
 * @param {Object} props.selectedRow - Fila seleccionada para editar (null si se está creando una nueva producción).
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @returns {JSX.Element} Formulario de producción.
 */
function FormProduccion({ reloadProducciones, setMessage, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);

  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [selectedTipoProduccion, setSelectedTipoProduccion] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFinal: "",
    estado: 1,
  });

  const token = localStorage.getItem("token");

  // Cargar sedes y tipos de producción
  useEffect(() => {
    if (!token) {
      setMessage({ open: true, severity: "error", text: "No se encontró el token de autenticación." });
      return;
    }

    axios.get(`${SiteProps.urlbasev1}/sede/minimal`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSedes(res.data))
      .catch(() => console.error("Error al cargar sedes."));

    axios.get(`${SiteProps.urlbasev1}/tipo_produccion`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTiposProduccion(res.data))
      .catch(() => console.error("Error al cargar tipos de producción."));
  }, []);

  // Cargar datos en modo edición
  useEffect(() => {
    if (selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        fechaInicio: selectedRow.fechaInicio?.slice(0, 16) || "",
        fechaFinal: selectedRow.fechaFinal?.slice(0, 16) || "",
        estado: selectedRow.estado || 1,
      });

      setSelectedEspacio(selectedRow.espacio || "");
      setSelectedTipoProduccion(selectedRow.tipoProduccion || "");

      if (selectedRow.sedeId) {
        setSelectedSede(selectedRow.sedeId);
        axios.get(`${SiteProps.urlbasev1}/bloque/sede/${selectedRow.sedeId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => setBloques(res.data));
      }

      if (selectedRow.bloqueId) {
        setSelectedBloque(selectedRow.bloqueId);
        axios.get(`${SiteProps.urlbasev1}/espacio/bloque/${selectedRow.bloqueId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => setEspacios(res.data));
      }

      setOpen(true);
    }
  }, [selectedRow]);

  /**
   * Maneja el cambio de selección de sede.
   * @param {string|number} sedeId - ID de la sede seleccionada.
   */
  const handleSedeChange = (sedeId) => {
    setSelectedSede(sedeId);
    setSelectedBloque("");
    setSelectedEspacio("");
    axios.get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBloques(res.data))
      .catch(() => console.error("Error al cargar bloques."));
  };

  /**
   * Maneja el cambio de selección de bloque.
   * @param {string|number} bloqueId - ID del bloque seleccionado.
   */
  const handleBloqueChange = (bloqueId) => {
    setSelectedBloque(bloqueId);
    setSelectedEspacio("");
    axios.get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setEspacios(res.data))
      .catch(() => console.error("Error al cargar espacios."));
  };

  /**
   * Maneja el envío del formulario para agregar o actualizar una producción.
   * @param {React.FormEvent} e - Evento del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEspacio || !selectedTipoProduccion) {
      setMessage({ open: true, severity: "error", text: "Selecciona un espacio y tipo de producción." });
      return;
    }

    const payload = {
      ...formData,
      espacio: selectedEspacio,
      tipoProduccion: selectedTipoProduccion,
    };

    try {
      if (selectedRow?.id) {
        await axios.put(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setMessage({ open: true, severity: "success", text: "Producción actualizada con éxito" });
      } else {
        await axios.post(`${SiteProps.urlbasev1}/producciones`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setMessage({ open: true, severity: "success", text: "Producción creada con éxito" });
      }

      reloadProducciones();
      setOpen(false);
      setSelectedRow(null);
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al guardar la producción." });
    }
  };

  return (
    <React.Fragment>
      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setOpen(true)}>
        Agregar Producción
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRow?.id ? "Editar Producción" : "Agregar Producción"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ width: "100%" }}>
              <TextField fullWidth margin="normal" label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              <TextField fullWidth margin="normal" label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required />
              <TextField fullWidth margin="normal" label="Fecha de Inicio" type="datetime-local" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} required />
              <TextField fullWidth margin="normal" label="Fecha Final" type="datetime-local" value={formData.fechaFinal} onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })} required />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{selectedRow?.id ? "Actualizar" : "Guardar"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

FormProduccion.propTypes = {
  reloadProducciones: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
};

export default FormProduccion;
