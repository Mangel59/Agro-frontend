import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormIngrediente({ selectedRow, setSelectedRow, setMessage, reloadData, open, setOpen }) {
  const [methodName, setMethodName] = React.useState("");

  const initialData = { nombre: "", descripcion: "", estado: "" };
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (!open) return;
    if (selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        estado: selectedRow.estadoId?.toString() || "",
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
    setFormData(initialData);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.estado) newErrors.estado = "Debe seleccionar un estado válido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado, 10),
    };

    const creating = methodName === "Agregar";
    const url = creating ? "/v1/ingrediente" : `/v1/ingrediente/${selectedRow.id}`;
    const req = creating ? axios.post : axios.put;

    try {
      await req(url, payload);
      setMessage({
        open: true,
        severity: "success",
        text: creating ? "Ingrediente creado con éxito!" : "Ingrediente actualizado con éxito!",
      });
      handleClose();
      setSelectedRow({});
      reloadData();
    } catch (err) {
      setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
    }
  };

  const deleteRow = async () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un ingrediente para eliminar." });
      return;
    }
    try {
      await axios.delete(`/v1/ingrediente/${selectedRow.id}`);
      setMessage({ open: true, severity: "success", text: "Ingrediente eliminado correctamente." });
      setSelectedRow({});
      handleClose();         // << cerrar después de eliminar
      reloadData();
    } catch (err) {
      setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
    }
  };

  return (
    <>
      <StackButtons methods={{
        create: () => { setFormData(initialData); setMethodName("Agregar"); setErrors({}); setOpen(true); },
        update: () => {
          if (!selectedRow?.id) {
            setMessage({ open: true, severity: "error", text: "Selecciona un ingrediente para editar." });
            return;
          }
          setMethodName("Actualizar");
          setErrors({});
          setOpen(true);
        },
        deleteRow,
      }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Ingrediente</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar ingredientes</DialogContentText>

            <TextField
              fullWidth margin="dense"
              name="nombre" label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              fullWidth margin="dense"
              name="descripcion" label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />

            <FormControl fullWidth margin="normal" error={!!errors.estado}>
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange} label="Estado">
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
              {errors.estado && (
                <p style={{ color: "#d32f2f", margin: "3px 14px 0", fontSize: "0.75rem" }}>{errors.estado}</p>
              )}
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

FormIngrediente.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
