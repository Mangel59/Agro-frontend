/**
 * @file FormPais.jsx
 * @module FormPais
 * @description Componente de formulario para crear y editar países.
 *
 * Este formulario permite la creación, actualización y eliminación de países,
 * incluyendo validaciones básicas y control de estado.
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

/**
 * @typedef {Object} FormPaisProps
 * @property {Object} selectedRow - Fila seleccionada para editar
 * @property {Function} setSelectedRow - Setter para la fila seleccionada
 * @property {Function} setMessage - Setter para los mensajes de alerta
 * @property {Function} reloadData - Función para recargar los datos
 */

/**
 * @param {FormPaisProps} props
 * @returns {JSX.Element} Formulario de país
 */
export default function FormPais({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const initialData = {
    nombre: "",
    codigo: "",
    acronimo: "",
    estado: ""
  };

  const [formData, setFormData] = React.useState(initialData);

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un país para editar." });
      return;
    }
    setFormData({
      nombre: selectedRow.nombre || "",
      codigo: selectedRow.codigo || "",
      acronimo: selectedRow.acronimo || "",
      estado: selectedRow.estadoId?.toString() || ""
    });
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un país para eliminar." });
      return;
    }
    axios.delete(`/v1/pais/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "País eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        console.error("❌ Error al eliminar país:", err);
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      nombre: formData.nombre,
      codigo: parseInt(formData.codigo),
      acronimo: formData.acronimo.toUpperCase(),
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/pais" : `/v1/pais/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "País creado con éxito!" : "País actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${err.message || "Network Error"}`
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} País</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar país</DialogContentText>
            <TextField fullWidth required name="nombre" label="Nombre del País" value={formData.nombre} onChange={handleChange} margin="dense" />
            <TextField fullWidth required name="codigo" label="Código" type="number" value={formData.codigo} onChange={handleChange} margin="dense" />
            <TextField fullWidth required name="acronimo" label="Acrónimo" inputProps={{ maxLength: 3 }} value={formData.acronimo} onChange={handleChange} margin="dense" />
            <FormControl fullWidth required margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange} label="Estado">
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormPais.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
