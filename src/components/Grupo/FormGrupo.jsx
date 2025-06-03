/**
 * @file FormGrupo.jsx
 * @module FormGrupo
 * @description Formulario para crear, editar y eliminar grupos.
 *
 * Este componente maneja la lógica del formulario de grupos,
 * incluyendo apertura, validación, envío a la API y control de estado.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

/**
 * @typedef {Object} FormGrupoProps
 * @property {Object} selectedRow - Fila actualmente seleccionada en la tabla
 * @property {Function} setSelectedRow - Función para actualizar la fila seleccionada
 * @property {Function} setMessage - Función para mostrar mensajes tipo snackbar
 * @property {Function} reloadData - Función para recargar la lista de grupos
 */

/**
 * Formulario de creación, edición y eliminación de grupos.
 *
 * @param {FormGrupoProps} props - Propiedades del componente
 * @returns {JSX.Element} Formulario en modal para gestionar grupos
 */
export default function FormGrupo({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const initialData = {
    nombre: "",
    descripcion: "",
    estado: ""
  };

  const [formData, setFormData] = useState(initialData);

  /**
   * Abre el formulario en modo creación.
   */
  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  /**
   * Abre el formulario en modo edición.
   */
  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un grupo para editar." });
      return;
    }

    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      estado: selectedRow.estadoId?.toString() || ""
    });

    setMethodName("Update");
    setOpen(true);
  };

  /**
   * Elimina el grupo actualmente seleccionado.
   */
  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un grupo para eliminar." });
      return;
    }

    axios.delete(`/v1/grupo/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Grupo eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${err.message}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  /**
   * Maneja los cambios en los campos del formulario.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Envía los datos del formulario a la API según el modo activo.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/grupo" : `/v1/grupo/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Grupo creado con éxito!" : "Grupo actualizado con éxito!"
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
          <DialogTitle>{methodName} Grupo</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar grupo</DialogContentText>

            <TextField
              fullWidth margin="dense" required
              name="nombre" label="Nombre del Grupo"
              value={formData.nombre}
              onChange={handleChange}
            />
            <TextField
              fullWidth margin="dense"
              name="descripcion" label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                label="Estado"
              >
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

FormGrupo.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
