import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormProceso({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [tiposProduccion, setTiposProduccion] = React.useState([]);
  const [errors, setErrors] = React.useState({});

  const initialData = {
    nombre: "",
    descripcion: "",
    tipoProduccionId: "",
    estado: ""
  };

  const [formData, setFormData] = React.useState(initialData);

  const loadTiposProduccion = () => {
    axios.get("/v1/tipo_produccion")
      .then(res => setTiposProduccion(res.data))
      .catch(err => console.error("Error al cargar tipo de producción:", err));
  };

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    loadTiposProduccion();
    setErrors({});
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un proceso para editar." });
      return;
    }

    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      tipoProduccionId: selectedRow.tipoProduccionId?.toString() || "",
      estado: selectedRow.estadoId?.toString() || ""
    });

    setMethodName("Update");
    loadTiposProduccion();
    setErrors({});
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un proceso para eliminar." });
      return;
    }

    axios.delete(`/v1/proceso/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Proceso eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${err.message}`
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.tipoProduccionId) newErrors.tipoProduccionId = "Debe seleccionar un tipo de producción.";
    if (!formData.estado) newErrors.estado = "Debe seleccionar un estado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipoProduccionId: parseInt(formData.tipoProduccionId),
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/proceso" : `/v1/proceso/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Proceso creado con éxito!" : "Proceso actualizado con éxito!"
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

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Proceso</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar procesos</DialogContentText>
            
            <FormControl fullWidth margin="normal" error={!!errors.tipoProduccionId}>
              <InputLabel>Tipo de Producción</InputLabel>
              <Select
                name="tipoProduccionId"
                value={formData.tipoProduccionId}
                onChange={handleChange}
                label="Tipo de Producción"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {tiposProduccion.map(tp => (
                  <MenuItem key={tp.id} value={tp.id}>{tp.nombre}</MenuItem>
                ))}
              </Select>
              {errors.tipoProduccionId && (
                <p style={{ color: "#d32f2f", margin: "3px 14px 0", fontSize: "0.75rem" }}>
                  {errors.tipoProduccionId}
                </p>
              )}
            </FormControl>

            <TextField
              fullWidth
              margin="dense"
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
            />

            <TextField
              fullWidth
              margin="dense"
              multiline
              rows={3}
              name="descripcion"
              label="Descripción"
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
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormProceso.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
