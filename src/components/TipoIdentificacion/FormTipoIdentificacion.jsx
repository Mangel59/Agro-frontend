/**
 * @file FormTipoIdentificacion.jsx
 * @module FormTipoIdentificacion
 * @description Formulario para agregar, editar o eliminar tipos de identificación. Utiliza un modal (Dialog) para el ingreso de datos y botones para acciones CRUD. Este componente funciona con datos locales (sin backend).
 * @author Karla
 */

import React, { useState } from "react";
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
 * Componente de formulario para gestionar tipos de identificación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onAdd - Función que recibe un objeto para agregar un nuevo tipo.
 * @param {Function} props.onUpdate - Función que recibe un objeto para actualizar un tipo existente.
 * @param {Function} props.onDelete - Función que recibe un ID numérico para eliminar un tipo.
 * @param {Object|null} props.selectedRow - Fila seleccionada actualmente.
 * @param {Function} props.setSelectedRow - Setter para actualizar la fila seleccionada.
 * @returns {JSX.Element} Formulario emergente (modal) con campos y botones para gestionar tipos.
 */
export default function FormTipoIdentificacion({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    tii_id: "",
    tii_nombre: "",
    tii_descripcion: "",
    tii_estado: 1,
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        tii_id: "",
        tii_nombre: "",
        tii_descripcion: "",
        tii_estado: 1,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Envía el formulario, ya sea para agregar o actualizar.
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.tii_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, tii_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow && selectedRow.tii_id) {
      onDelete(selectedRow.tii_id);
      setSelectedRow(null);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>ADD</Button>
        <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={handleOpen} disabled={!selectedRow}>UPDATE</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} disabled={!selectedRow}>DELETE</Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRow ? "Editar Tipo de Identificación" : "Agregar Tipo de Identificación"}</DialogTitle>
        <DialogContent>
          <TextField name="tii_nombre" label="Nombre" value={formData.tii_nombre} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="tii_descripcion" label="Descripción" value={formData.tii_descripcion} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="tii_estado" label="Estado (1: Activo, 0: Inactivo)" value={formData.tii_estado} onChange={handleChange} fullWidth margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>{selectedRow ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
