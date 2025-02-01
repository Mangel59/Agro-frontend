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

export default function FormProveedorEvaluacion({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    pre_id: "",
    pre_fecha_hora: "",
    pre_proveedor_id: "",
    pre_evaluacion_id: "",
    pre_descripcion: "",
    pre_estado: 1,
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        pre_id: "",
        pre_fecha_hora: "",
        pre_proveedor_id: "",
        pre_evaluacion_id: "",
        pre_descripcion: "",
        pre_estado: 1,
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
    if (formData.pre_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, pre_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow && selectedRow.pre_id) {
      onDelete(selectedRow.pre_id);
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
        <DialogTitle>{selectedRow ? "Editar Evaluación de Proveedor" : "Agregar Evaluación de Proveedor"}</DialogTitle>
        <DialogContent>
          <TextField name="pre_fecha_hora" label="Fecha y Hora" value={formData.pre_fecha_hora} onChange={handleChange} fullWidth margin="normal" type="datetime-local" />
          <TextField name="pre_proveedor_id" label="Proveedor ID" value={formData.pre_proveedor_id} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="pre_evaluacion_id" label="Evaluación ID" value={formData.pre_evaluacion_id} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="pre_descripcion" label="Descripción" value={formData.pre_descripcion} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="pre_estado" label="Estado (1: Activo, 0: Inactivo)" value={formData.pre_estado} onChange={handleChange} fullWidth margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>{selectedRow ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
