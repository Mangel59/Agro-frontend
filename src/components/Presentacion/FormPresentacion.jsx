/**
 * @file FormPresentacion.jsx
 * @module FormPresentacion
 * @description Componente de formulario para crear, actualizar o eliminar una presentación.
 * Utiliza Material UI Dialog y campos de entrada para manejar datos de presentación.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormPresentacion.
 *
 * Maneja la creación, actualización y eliminación de presentaciones.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {function(Object):void} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {Object} props.selectedRow - Fila actualmente seleccionada.
 * @param {function(Object):void} props.setMessage - Función para mostrar mensajes de éxito o error.
 * @param {function():void} props.reloadData - Función para recargar la lista de presentaciones.
 * @returns {JSX.Element}
 */
export default function FormPresentacion({ setSelectedRow, selectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estado: 0 });
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .delete(`${SiteProps.urlbasev1}/presentaciones/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Presentación eliminada con éxito" });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar presentación: ${error.response?.data?.message || error.message}`,
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = selectedRow?.id || 0;

    if (!formJson.nombre || !formJson.descripcion) {
      setMessage({
        open: true,
        severity: "error",
        text: "Datos inválidos. Revisa el formulario.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    const url = `${SiteProps.urlbasev1}/presentaciones`;
    const request = methodName === "Add"
      ? axios.post(url, formJson, { headers: { Authorization: `Bearer ${token}` } })
      : axios.put(`${url}/${id}`, formJson, { headers: { Authorization: `Bearer ${token}` } });

    request
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Presentación creada con éxito" : "Presentación actualizada con éxito",
        });
        setOpen(false);
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} presentación: ${error.response?.data?.message || error.message}`,
        });
      });
  };

  return (
    <React.Fragment>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>Presentación</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          <FormControl fullWidth margin="normal">
            <TextField
              autoFocus
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={selectedRow?.nombre || ""}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              defaultValue={selectedRow?.descripcion || ""}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={selectedRow?.estado || 1}
              fullWidth
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

// Validación de props
FormPresentacion.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }),
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
