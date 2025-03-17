
/**
 * FormProduccion componente principal.
 * @component
 * @returns {JSX.Element}
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

  useEffect(() => {
    if (!token) {
      setMessage({ open: true, severity: "error", text: "No se encontró el token de autenticación." });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/sede/minimal`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSedes(res.data))
      .catch((err) => console.error("Error al cargar sedes:", err));

    axios
      .get(`${SiteProps.urlbasev1}/tipo_produccion`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTiposProduccion(res.data))
      .catch((err) => console.error("Error al cargar tipos de producción:", err));
  }, []);

  // Cargar datos en modo edición
  useEffect(() => {
    if (selectedRow && selectedRow.id) {
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
        axios
          .get(`${SiteProps.urlbasev1}/bloque/sede/${selectedRow.sedeId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => setBloques(res.data));
      }

      if (selectedRow.bloqueId) {
        setSelectedBloque(selectedRow.bloqueId);
        axios
          .get(`${SiteProps.urlbasev1}/espacio/bloque/${selectedRow.bloqueId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => setEspacios(res.data));
      }

      setOpen(true);
    }
  }, [selectedRow]);

  const handleSedeChange = (sedeId) => {
    setSelectedSede(sedeId);
    setSelectedBloque("");
    setSelectedEspacio("");
    axios
      .get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBloques(res.data))
      .catch((err) => console.error("Error al cargar bloques:", err));
  };

  const handleBloqueChange = (bloqueId) => {
    setSelectedBloque(bloqueId);
    setSelectedEspacio("");
    axios
      .get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setEspacios(res.data))
      .catch((err) => console.error("Error al cargar espacios:", err));
  };

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
      if (selectedRow && selectedRow.id) {
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
      setSelectedRow({}); // Limpiar selección después
    } catch (error) {
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
              {/* Sede */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="sede-label">Sede</InputLabel>
                <Select labelId="sede-label" value={selectedSede} onChange={(e) => handleSedeChange(e.target.value)}>
                  {sedes.map((sede) => (
                    <MenuItem key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Bloque */}
              <FormControl fullWidth margin="normal" disabled={!selectedSede}>
                <InputLabel id="bloque-label">Bloque</InputLabel>
                <Select labelId="bloque-label" value={selectedBloque} onChange={(e) => handleBloqueChange(e.target.value)}>
                  {bloques.map((bloque) => (
                    <MenuItem key={bloque.id} value={bloque.id}>
                      {bloque.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Espacio */}
              <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
                <InputLabel id="espacio-label">Espacio</InputLabel>
                <Select labelId="espacio-label" value={selectedEspacio} onChange={(e) => setSelectedEspacio(e.target.value)}>
                  {espacios.map((espacio) => (
                    <MenuItem key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Tipo de Producción */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="tipoProduccion-label">Tipo de Producción</InputLabel>
                <Select labelId="tipoProduccion-label" value={selectedTipoProduccion} onChange={(e) => setSelectedTipoProduccion(e.target.value)}>
                  {tiposProduccion.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Nombre */}
              <TextField fullWidth margin="normal" label="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />

              {/* Descripción */}
              <TextField fullWidth margin="normal" label="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required />

              {/* Fechas */}
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
