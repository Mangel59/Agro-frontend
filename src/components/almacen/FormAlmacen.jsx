/**
 * @module FormAlmacen
 */
// ========================
// TIPOS AUXILIARES PARA JSDOC
// ========================

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible.
 * @property {string} severity - Nivel de severidad (success, error, etc.).
 * @property {string} text - Texto a mostrar en el mensaje.
 */

/**
 * @callback SetMessageFn
 * @param {SnackbarMessage} message
 * @returns {void}
 */

/**
 * @callback SetSelectedRowFn
 * @param {Object} row
 * @returns {void}
 */

/**
 * @callback ReloadDataFn
 * @returns {void}
 */

/**
 * @typedef {Object} FormAlmacenProps
 * @property {SetMessageFn} setMessage - Muestra un mensaje tipo snackbar.
 * @property {Object} selectedRow - Objeto del almacén seleccionado.
 * @property {number} [selectedRow.id] - ID del almacén.
 * @property {string} [selectedRow.nombre] - Nombre del almacén.
 * @property {string} [selectedRow.descripcion] - Descripción del almacén.
 * @property {string|number} [selectedRow.sede] - ID de la sede.
 * @property {string} [selectedRow.geolocalizacion] - Geolocalización.
 * @property {string} [selectedRow.coordenadas] - Coordenadas GPS.
 * @property {number} [selectedRow.estado] - Estado del almacén (1=Activo).
 * @property {SetSelectedRowFn} setSelectedRow - Cambia la fila seleccionada.
 * @property {ReloadDataFn} reloadData - Recarga la tabla.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormAlmacen. Permite agregar, actualizar y eliminar almacenes.
 *
 * @component
 * @param {FormAlmacenProps} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const FormAlmacen = ({ setMessage, selectedRow, setSelectedRow, reloadData }) => {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [sedes, setSedes] = useState([]);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar sedes.",
        });
      }
    };
    fetchSedes();
  }, []);

  const handleOpen = (method) => {
    setMethodName(method);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow({});
  };

  const handleSubmit = () => {
    if (!selectedRow.nombre || !selectedRow.sede) {
      setMessage({
        open: true,
        severity: "error",
        text: "Los campos Nombre y Sede son obligatorios.",
      });
      return;
    }

    const payload = {
      id: selectedRow?.id || null,
      nombre: selectedRow?.nombre || "",
      sede: selectedRow?.sede || "",
      geolocalizacion: selectedRow?.geolocalizacion || "",
      coordenadas: selectedRow?.coordenadas || "",
      descripcion: selectedRow?.descripcion || "",
      estado: selectedRow?.estado || 1,
    };

    const url = `${SiteProps.urlbasev1}/almacen`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Almacén creado con éxito." : "Almacén actualizado con éxito.",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al enviar datos. Intente nuevamente.",
        });
      });
  };

  const handleDelete = () => {
    if (!selectedRow || !selectedRow.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un almacén para eliminar.",
      });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/almacen/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Almacén eliminado con éxito.",
        });
        reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar almacén:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el almacén. Intente nuevamente.",
        });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen("Add")}>
          Agregar
        </Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={() => handleOpen("Update")} style={{ marginLeft: "10px" }}>
          Actualizar
        </Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={handleDelete} style={{ marginLeft: "10px" }}>
          Eliminar
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Almacén" : "Actualizar Almacén"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select
              value={selectedRow?.sede || ""}
              onChange={(e) => setSelectedRow({ ...selectedRow, sede: e.target.value })}
            >
              {sedes.map((sede) => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField fullWidth label="Nombre" value={selectedRow?.nombre || ""} onChange={(e) => setSelectedRow({ ...selectedRow, nombre: e.target.value })} required margin="normal" />
          <TextField fullWidth label="Geolocalización" value={selectedRow?.geolocalizacion || ""} onChange={(e) => setSelectedRow({ ...selectedRow, geolocalizacion: e.target.value })} required margin="normal" />
          <TextField fullWidth label="Coordenadas" value={selectedRow?.coordenadas || ""} onChange={(e) => setSelectedRow({ ...selectedRow, coordenadas: e.target.value })} margin="normal" />
          <TextField fullWidth label="Descripción" value={selectedRow?.descripcion || ""} onChange={(e) => setSelectedRow({ ...selectedRow, descripcion: e.target.value })} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

FormAlmacen.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};

export default FormAlmacen;
