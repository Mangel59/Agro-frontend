import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FormTipoIdentificacion({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    estadoId: 1
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        id: "",
        nombre: "",
        descripcion: "",
        estadoId: 1
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
    setFormData({ ...formData, [name]: name === "estadoId" ? parseInt(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow?.id) {
      onDelete(selectedRow.id);
      setSelectedRow(null);
      setOpen(false);
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
          <TextField
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="descripcion"
            label="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="estadoId"
            label="Estado (1: Activo, 0: Inactivo)"
            type="number"
            value={formData.estadoId}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
