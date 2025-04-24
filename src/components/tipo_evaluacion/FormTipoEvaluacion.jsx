import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export default function FormTipoEvaluacion({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tie_id: "",
    tie_nombre: "",
    tie_estado: 1, // Asegúrate de que tie_estado sea numérico por defecto
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData({
        ...selectedRow,
        tie_estado: selectedRow.tie_estado.toString(), // Convertir a string para que funcione con el Select
      });
    } else {
      setFormData({
        tie_id: "",
        tie_nombre: "",
        tie_estado: 1, // Por defecto 1 (Activo)
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
    if (!formData.tie_nombre.trim() || formData.tie_estado === "") {
      alert("Todos los campos son obligatorios");
      return;
    }

    const newData = {
      ...formData,
      tie_estado: parseInt(formData.tie_estado, 10), // Asegurarnos de que el estado es un número
    };

    if (selectedRow) {
      onUpdate(newData);
    } else {
      onAdd({ ...newData, tie_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow && selectedRow.tie_id) {
      onDelete(selectedRow.tie_id);
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
        <DialogTitle>{selectedRow ? "Editar Tipo de Evaluación" : "Agregar Tipo de Evaluación"}</DialogTitle>
        <DialogContent>
          <TextField name="tie_nombre" label="Nombre" value={formData.tie_nombre} onChange={handleChange} fullWidth margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              name="tie_estado"
              value={formData.tie_estado.toString()} // Aquí se convierte a string para que funcione con el Select
              onChange={handleChange}
              required
            >
              <MenuItem value={"1"}>Activo</MenuItem>
              <MenuItem value={"0"}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>{selectedRow ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Validación de PropTypes
FormTipoEvaluacion.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    tie_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tie_nombre: PropTypes.string,
    tie_estado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  setSelectedRow: PropTypes.func.isRequired,
};
