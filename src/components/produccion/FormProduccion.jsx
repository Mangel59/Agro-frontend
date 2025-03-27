/**
 * @file FormProduccion.jsx
 * @module FormProduccion
 * @description Componente que permite crear nuevas producciones asociadas a un espacio. 
 * Incluye lógica para seleccionar sede, bloque, espacio y tipo de producción, con llamadas dinámicas a la API.
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
 * Componente para crear nuevas producciones.
 * @param {{
 *   reloadProducciones: Function,
 *   setMessage: Function
 * }} props
 * @returns {JSX.Element} Formulario de creación de producción
 */
function FormProduccion({ reloadProducciones, setMessage }) {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "No se encontró el token de autenticación." });
      return;
    }

    axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setSedes(res.data));

    axios.get(`${SiteProps.urlbasev1}/tipo_produccion`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setTiposProduccion(res.data));
  }, [setMessage]);

  const handleSedeChange = (sedeId) => {
    setSelectedSede(sedeId);
    setSelectedBloque("");
    setSelectedEspacio("");

    axios.get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setBloques(res.data));
  };

  const handleBloqueChange = (bloqueId) => {
    setSelectedBloque(bloqueId);
    setSelectedEspacio("");

    axios.get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setEspacios(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!selectedEspacio || !selectedTipoProduccion) {
      setMessage({ open: true, severity: "error", text: "Selecciona un espacio y un tipo de producción." });
      return;
    }

    try {
      await axios.post(
        `${SiteProps.urlbasev1}/producciones`,
        { ...formData, espacio: selectedEspacio, tipoProduccion: selectedTipoProduccion },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setMessage({ open: true, severity: "success", text: "Producción creada con éxito." });
      setFormData({ nombre: "", descripcion: "", fechaInicio: "", fechaFinal: "", estado: 1 });
      setSelectedSede("");
      setSelectedBloque("");
      setSelectedEspacio("");
      setSelectedTipoProduccion("");
      setOpen(false);
      if (typeof reloadProducciones === "function") {
        setTimeout(() => reloadProducciones(), 100);
      }
    } catch (err) {
      setMessage({ open: true, severity: "error", text: "Error al crear la producción." });
    }
  };

  return (
    <>
      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setOpen(true)}>
        ADD
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Crear Producción</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Sede</InputLabel>
                <Select value={selectedSede} onChange={(e) => handleSedeChange(e.target.value)}>
                  {sedes.map((s) => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!selectedSede}>
                <InputLabel>Bloque</InputLabel>
                <Select value={selectedBloque} onChange={(e) => handleBloqueChange(e.target.value)}>
                  {bloques.map((b) => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
                <InputLabel>Espacio</InputLabel>
                <Select value={selectedEspacio} onChange={(e) => setSelectedEspacio(e.target.value)}>
                  {espacios.map((e) => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Producción</InputLabel>
                <Select value={selectedTipoProduccion} onChange={(e) => setSelectedTipoProduccion(e.target.value)}>
                  {tiposProduccion.map((t) => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth margin="normal" label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              <TextField fullWidth margin="normal" label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required />
              <TextField fullWidth margin="normal" label="Fecha de Inicio" type="datetime-local" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} required />
              <TextField fullWidth margin="normal" label="Fecha Final" type="datetime-local" value={formData.fechaFinal} onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })} required />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormProduccion.propTypes = {
  reloadProducciones: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default FormProduccion;
