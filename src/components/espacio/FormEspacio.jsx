/**
 * @file FormEspacio.jsx
 * @module FormEspacio
 * @description Formulario modal para crear, actualizar o eliminar espacios físicos.
 * Gestiona relaciones con sedes, bloques y tipos de espacio.
 */

import * as React from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormEspacio.
 * Permite crear, actualizar y eliminar registros de espacios.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array<{id: number, nombre: string}>} props.sedes - Lista de sedes disponibles.
 * @param {Object} props.selectedRow - Objeto que representa el registro seleccionado.
 * @param {Function} props.setMessage - Función para mostrar mensajes.
 * @param {Function} props.reloadData - Función para recargar los datos después de una acción.
 * @param {Function} props.setSelectedRow - Función para actualizar el registro seleccionado.
 * @returns {JSX.Element}
 */
export default function FormEspacio({ sedes, selectedRow, setMessage, reloadData, setSelectedRow }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [bloques, setBloques] = React.useState([]);
  const [tipoEspacio, setTipoEspacio] = React.useState([]);
  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedBloque, setSelectedBloque] = React.useState("");

  React.useEffect(() => {
    const fetchTipoEspacio = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTipoEspacio(response.data || []);
      } catch (error) {
        console.error("Error al cargar tipos de espacio:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar tipos de espacio." });
      }
    };
    fetchTipoEspacio();
  }, [setMessage]);

  React.useEffect(() => {
    if (!selectedSede) {
      setBloques([]);
      return;
    }
    const fetchBloques = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/bloque/sede/${selectedSede}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBloques(response.data || []);
      } catch (error) {
        console.error("Error al cargar bloques:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar bloques." });
      }
    };
    fetchBloques();
  }, [selectedSede, setMessage]);

  const create = () => {
    setSelectedRow({
      id: 0,
      tipoEspacio: {},
      nombre: "",
      geolocalizacion: "",
      coordenadas: "",
      descripcion: "",
      estado: 1,
    });
    setSelectedSede("");
    setSelectedBloque("");
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Seleccione una fila para actualizar." });
      return;
    }
    const sedeId = selectedRow?.bloque?.sede?.id || selectedRow?.sede?.id || selectedRow?.sede || "";
    const bloqueId = selectedRow?.bloque?.id || selectedRow?.bloque || "";

    setSelectedSede(sedeId);
    setSelectedBloque(bloqueId);
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Seleccione una fila para eliminar." });
      return;
    }
    axios
      .delete(`${SiteProps.urlbasev1}/espacio/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Espacio eliminado con éxito." });
        reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar espacio:", error);
        setMessage({ open: true, severity: "error", text: "Error al eliminar el espacio." });
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedSede || !selectedBloque || !selectedRow.tipoEspacio?.id || !selectedRow.nombre) {
      setMessage({ open: true, severity: "error", text: "Por favor completa todos los campos obligatorios." });
      return;
    }
    const payload = {
      bloque: selectedBloque,
      tipoEspacio: selectedRow.tipoEspacio.id,
      nombre: selectedRow.nombre,
      geolocalizacion: selectedRow.geolocalizacion || null,
      coordenadas: selectedRow.coordenadas || null,
      descripcion: selectedRow.descripcion || null,
      estado: selectedRow.estado || 1,
    };
    const url = `${SiteProps.urlbasev1}/espacio`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Espacio creado con éxito." : "Espacio actualizado con éxito.",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        setMessage({ open: true, severity: "error", text: "Error al enviar datos. Intente nuevamente." });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create} sx={{ mr: 1 }}>
          AGREGAR
        </Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={update} sx={{ mr: 1 }}>
          ACTUALIZAR
        </Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={deleteRow}>
          ELIMINAR
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>Espacio</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select value={selectedSede} onChange={(e) => setSelectedSede(parseInt(e.target.value))}>
              {sedes.map((sede) => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Bloque</InputLabel>
            <Select value={selectedBloque} onChange={(e) => setSelectedBloque(parseInt(e.target.value))}>
              {bloques.map((bloque) => (
                <MenuItem key={bloque.id} value={bloque.id}>
                  {bloque.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Espacio</InputLabel>
            <Select
              value={selectedRow?.tipoEspacio?.id || ""}
              onChange={(e) => {
                const tipoSeleccionado = tipoEspacio.find(tipo => tipo.id === parseInt(e.target.value));
                setSelectedRow({ ...selectedRow, tipoEspacio: tipoSeleccionado });
              }}
            >
              {tipoEspacio.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField fullWidth margin="normal" label="Nombre" required value={selectedRow?.nombre || ""} onChange={(e) => setSelectedRow({ ...selectedRow, nombre: e.target.value })} />

          <TextField fullWidth margin="normal" label="Geolocalización" value={selectedRow?.geolocalizacion || ""} onChange={(e) => setSelectedRow({ ...selectedRow, geolocalizacion: e.target.value })} />

          <TextField fullWidth margin="normal" label="Coordenadas" value={selectedRow?.coordenadas || ""} onChange={(e) => setSelectedRow({ ...selectedRow, coordenadas: e.target.value })} />

          <TextField fullWidth margin="normal" label="Descripción" value={selectedRow?.descripcion || ""} onChange={(e) => setSelectedRow({ ...selectedRow, descripcion: e.target.value })} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedRow?.estado ?? 1}
              onChange={(e) => setSelectedRow({ ...selectedRow, estado: parseInt(e.target.value) })}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

FormEspacio.propTypes = {
  sedes: PropTypes.array.isRequired,
  selectedRow: PropTypes.object,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
