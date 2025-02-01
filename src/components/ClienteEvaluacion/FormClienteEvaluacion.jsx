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

export default function FormClienteEvaluacion({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    cle_id: "",
    cle_fecha: "",
    cle_persona_id: "",
    cle_evaluacion_id: "",
    cle_descripcion: "",
    cle_estado: 1,
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        cle_id: "",
        cle_fecha: "",
        cle_persona_id: "",
        cle_evaluacion_id: "",
        cle_descripcion: "",
        cle_estado: 1,
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
    if (formData.cle_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, cle_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow && selectedRow.cle_id) {
      onDelete(selectedRow.cle_id);
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
        <DialogTitle>{selectedRow ? "Editar Evaluación" : "Agregar Evaluación"}</DialogTitle>
        <DialogContent>
          <TextField name="cle_fecha" label="Fecha" value={formData.cle_fecha} onChange={handleChange} fullWidth margin="normal" type="datetime-local" />
          <TextField name="cle_persona_id" label="Persona ID" value={formData.cle_persona_id} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="cle_evaluacion_id" label="Evaluación ID" value={formData.cle_evaluacion_id} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="cle_descripcion" label="Descripción" value={formData.cle_descripcion} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="cle_estado" label="Estado (1: Activo, 0: Inactivo)" value={formData.cle_estado} onChange={handleChange} fullWidth margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>{selectedRow ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
