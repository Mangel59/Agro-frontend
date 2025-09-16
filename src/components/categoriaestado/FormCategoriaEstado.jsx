import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormCategoriaEstado({
  selectedRow, setSelectedRow, setMessage, reloadData, open, setOpen
}) {
  const [methodName, setMethodName] = React.useState("Agregar");

  const initialData = { nombre: "", descripcion: "" };
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (!open) return;
    if (selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
      });
      setMethodName("Actualizar");
    } else {
      setFormData(initialData);
      setMethodName("Agregar");
    }
    setErrors({});
  }, [open, selectedRow]);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow({});
    setFormData(initialData);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
    };

    const creating = methodName === "Agregar";
    const url = creating
      ? "/v1/categoria-estado"
      : `/v1/categoria-estado/${selectedRow.id}`;
    const req = creating ? axios.post : axios.put;

    try {
      await req(url, payload);
      setMessage({ open: true, severity: "success", text: creating ? "Categoría creada" : "Categoría actualizada" });
      handleClose();
      reloadData();
    } catch (err) {
      setMessage({ open: true, severity: "error", text: err?.response?.data?.message || "Error al guardar" });
    }
  };

  const deleteRow = async () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un registro para eliminar" });
      return;
    }
    if (!window.confirm(`¿Eliminar "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/categoria-estado/${selectedRow.id}`);
      setMessage({ open: true, severity: "success", text: "Eliminado" });
      handleClose();
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "No se pudo eliminar" });
    }
  };

  return (
    <>
      <StackButtons methods={{
        create: () => { setMethodName("Agregar"); setFormData(initialData); setErrors({}); setOpen(true); },
        update: () => {
          if (!selectedRow?.id) return setMessage({ open: true, severity: "error", text: "Selecciona un registro" });
          setMethodName("Actualizar"); setErrors({}); setOpen(true);
        },
        deleteRow,
      }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Categoría Estado</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar categorías de estado</DialogContentText>

            <TextField
              fullWidth margin="dense" name="nombre" label="Nombre"
              value={formData.nombre} onChange={handleChange}
              error={!!errors.nombre} helperText={errors.nombre}
            />
            <TextField
              fullWidth margin="dense" name="descripcion" label="Descripción"
              value={formData.descripcion} onChange={handleChange}
              error={!!errors.descripcion} helperText={errors.descripcion}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormCategoriaEstado.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
