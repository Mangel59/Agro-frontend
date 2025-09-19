import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";

export default function FormInventario({ 
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  subseccionId = "",
  tiposInventario = [],
  subsecciones = [],
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {}
}) {
  const headers = authHeaders.headers ? authHeaders : { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  const initialData = {
    nombre: "",
    descripcion: "",
    fechaHora: new Date().toISOString().slice(0, 16), // Para datetime-local
    tipoInventarioId: "",
    subseccionId: subseccionId || "",
    estadoId: 1
  };

  const [formData, setFormData] = React.useState(initialData);

  // Actualizar datos cuando se abre el formulario
  React.useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        fechaHora: selectedRow.fechaHora ? new Date(selectedRow.fechaHora).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        tipoInventarioId: selectedRow.tipoInventarioId || "",
        subseccionId: selectedRow.subseccionId || subseccionId || "",
        estadoId: selectedRow.estadoId || 1
      });
    } else {
      setFormData({
        ...initialData,
        subseccionId: subseccionId || ""
      });
    }
  }, [open, formMode, selectedRow, subseccionId]);

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || "",
      subseccionId: Number(formData.subseccionId),
      tipoInventarioId: Number(formData.tipoInventarioId),
      fechaHora: new Date(formData.fechaHora).toISOString(),
      estadoId: Number(formData.estadoId)
    };

    try {
      if (formMode === "edit" && selectedRow?.id) {
        await axios.put(`/v1/inventario/${selectedRow.id}`, payload, headers);
        setMessage({ open: true, severity: "success", text: "Inventario actualizado correctamente." });
      } else {
        await axios.post("/v1/inventario", payload, headers);
        setMessage({ open: true, severity: "success", text: "Inventario creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar inventario.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{formMode === "edit" ? "Editar Inventario" : "Nuevo Inventario"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario para {formMode === "edit" ? "actualizar" : "crear"} el inventario</DialogContentText>

          <TextField
            fullWidth margin="normal"
            name="fechaHora" label="Fecha y Hora"
            type="datetime-local"
            value={formData.fechaHora}
            onChange={handleChange}
          />

          <TextField
            fullWidth margin="normal" required
            name="nombre" label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Tipo de Inventario</InputLabel>
            <Select
              name="tipoInventarioId"
              value={formData.tipoInventarioId}
              onChange={handleChange}
              label="Tipo de Inventario"
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {tiposInventario.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!subseccionId && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Subsección</InputLabel>
              <Select
                name="subseccionId"
                value={formData.subseccionId}
                onChange={handleChange}
                label="Subsección"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {subsecciones.map((subseccion) => (
                  <MenuItem key={subseccion.id} value={subseccion.id}>
                    {subseccion.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth margin="normal"
            name="descripcion" label="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            multiline
            rows={3}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estadoId"
              value={formData.estadoId}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={2}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {formMode === "edit" ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

FormInventario.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  formMode: PropTypes.string,
  selectedRow: PropTypes.object,
  subseccionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tiposInventario: PropTypes.array,
  subsecciones: PropTypes.array,
  reloadData: PropTypes.func,
  setMessage: PropTypes.func,
  authHeaders: PropTypes.object,
};
