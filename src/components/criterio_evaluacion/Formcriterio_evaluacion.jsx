import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// 👇 Agrega estos import si estás usando iconos
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FormCriterioEvaluacion({
  onAdd,
  onUpdate,
  onDelete,
  selectedRow,
  setSelectedRow,
}) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [formData, setFormData] = React.useState({
    cre_tipo_evaluacion_id: "",
    cre_nombre: "",
    cre_descripcion: "",
    cre_estado: 1,
  });

  const handleOpen = (mode) => {
    setMethodName(mode);
    if (mode === "Update" && selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        cre_tipo_evaluacion_id: "",
        cre_nombre: "",
        cre_descripcion: "",
        cre_estado: 1,
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cre_estado" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.cre_nombre || !formData.cre_tipo_evaluacion_id) {
      alert("Todos los campos son obligatorios");
      return;
    }

    methodName === "Add" ? onAdd(formData) : onUpdate(formData);
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow?.cre_id) {
      onDelete(selectedRow.cre_id);
      handleClose();
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen("Add")}>ADD</Button>
        <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={() => handleOpen("Update")} disabled={!selectedRow}>UPDATE</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} disabled={!selectedRow}>DELETE</Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar" : "Editar"} Evaluación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Completa todos los campos requeridos.
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <TextField
              name="cre_tipo_evaluacion_id"
              label="Tipo Evaluación ID"
              value={formData.cre_tipo_evaluacion_id}
              onChange={handleChange}
              required
              type="number"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              name="cre_nombre"
              label="Nombre"
              value={formData.cre_nombre}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              name="cre_descripcion"
              label="Descripción"
              value={formData.cre_descripcion}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="cre_estado"
              value={formData.cre_estado}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {methodName === "Add" ? "Agregar" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
