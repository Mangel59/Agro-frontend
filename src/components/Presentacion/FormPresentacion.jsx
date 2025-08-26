import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormPresentacion({ open, setOpen, selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [methodName, setMethodName] = React.useState("");

  const initialData = {
    nombre: "",
    descripcion: "",
    estado: ""
  };

  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open && selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        estado: selectedRow.estadoId?.toString() || ""
      });
      setMethodName("Actualizar");
    } else {
      setFormData(initialData);
      setMethodName("Crear");
    }
    setErrors({});
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.estado) newErrors.estado = "Debe seleccionar un estado válido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Crear" ? axios.post : axios.put;
    const url = methodName === "Crear"
      ? "/v1/presentacion"
      : `/v1/presentacion/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Crear" ? "Presentación creada con éxito!" : "Presentación actualizada con éxito!"
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

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para eliminar." });
      return;
    }

    axios.delete(`/v1/presentacion/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Presentación eliminada correctamente." });
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

  return (
    <>
      <StackButtons methods={{
        create: () => { setFormData(initialData); setMethodName("Crear"); setOpen(true); },
        update: () => {
          if (!selectedRow?.id) {
            setMessage({ open: true, severity: "error", text: "Selecciona una presentación para editar." });
            return;
          }
          setOpen(true);
        },
        deleteRow
      }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Presentación</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar presentaciones de productos</DialogContentText>

            <TextField
              fullWidth margin="dense"
              name="nombre" label="Nombre del Producto"
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
              {errors.estado && (
                <p style={{ color: "#d32f2f", margin: "3px 14px 0", fontSize: "0.75rem" }}>
                  {errors.estado}
                </p>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>CANCELAR</Button>
            <Button type="submit">{methodName.toUpperCase()}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormPresentacion.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
