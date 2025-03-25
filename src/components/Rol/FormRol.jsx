/**
 * @file FormRol.jsx
 * @module FormRol
 * @description Componente de formulario para agregar, editar o eliminar roles. Utiliza Material UI y recibe funciones de manejo desde el componente principal. Ideal para interfaces CRUD simples con JSON local o backend ligero.
 * @author Karla
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * @typedef {Object} RolData
 * @property {number|string} rol_id - ID del rol
 * @property {string} rol_nombre - Nombre del rol
 * @property {string} rol_descripcion - Descripción del rol
 * @property {number} rol_estado - Estado del rol (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} FormRolProps
 * @property {Function} onAdd - Función para agregar un nuevo rol
 * @property {Function} onUpdate - Función para actualizar un rol existente
 * @property {Function} onDelete - Función para eliminar un rol
 * @property {RolData|null} selectedRow - Rol actualmente seleccionado para edición
 * @property {Function} setSelectedRow - Función para cambiar la fila seleccionada
 */

/**
 * Componente FormRol.
 *
 * @param {FormRolProps} props - Propiedades del componente
 * @returns {JSX.Element}
 */
export default function FormRol({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    rol_id: "",
    rol_nombre: "",
    rol_descripcion: "",
    rol_estado: 1,
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        rol_id: "",
        rol_nombre: "",
        rol_descripcion: "",
        rol_estado: 1,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rol_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, rol_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow?.rol_id) {
      onDelete(selectedRow.rol_id);
      setSelectedRow(null);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          ADD
        </Button>
        <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={handleOpen} disabled={!selectedRow}>
          UPDATE
        </Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} disabled={!selectedRow}>
          DELETE
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRow ? "Editar Rol" : "Agregar Rol"}</DialogTitle>
        <DialogContent>
          <TextField
            name="rol_nombre"
            label="Nombre"
            value={formData.rol_nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="rol_descripcion"
            label="Descripción"
            value={formData.rol_descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="rol_estado"
            label="Estado (1: Activo, 0: Inactivo)"
            value={formData.rol_estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>
            {selectedRow ? "Actualizar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
