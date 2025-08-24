import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormCriterioEvaluacion({
  selectedRow, setSelectedRow, setMessage, reloadData, open, setOpen
}) {
  const [methodName, setMethodName] = React.useState("");

  const initialData = { nombre: "", descripcion: "", tipoEvaluacionId: "", estado: "" };
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [tiposEvaluacion, setTiposEvaluacion] = React.useState([]);

  // Cargar catálogo para el select de Tipo Evaluación
  React.useEffect(() => {
    const loadTipos = async () => {
      try {
        const res = await axios.get("/v1/tipo_evaluacion");
        setTiposEvaluacion(res?.data ?? []);
      } catch { /* silenciar */ }
    };
    loadTipos();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    if (selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        tipoEvaluacionId: selectedRow.tipoEvaluacionId?.toString() || "",
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
    const e = {};
    if (!formData.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
    if (!formData.tipoEvaluacionId) e.tipoEvaluacionId = "Seleccione un tipo de evaluación.";
    if (!formData.estado) e.estado = "Seleccione un estado.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipoEvaluacionId: parseInt(formData.tipoEvaluacionId, 10),
      estadoId: parseInt(formData.estado, 10),
    };

    const creating = methodName === "Agregar";
    const url = creating ? "/v1/criterio_evaluacion" : `/v1/criterio_evaluacion/${selectedRow.id}`;
    const req = creating ? axios.post : axios.put;

    try {
      await req(url, payload);
      setMessage({
        open: true,
        severity: "success",
        text: creating ? "Criterio creado con éxito!" : "Criterio actualizado con éxito!",
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
      setMessage({ open: true, severity: "error", text: "Selecciona un criterio para eliminar." });
      return;
    }
    try {
      await axios.delete(`/v1/criterio_evaluacion/${selectedRow.id}`);
      setMessage({ open: true, severity: "success", text: "Criterio eliminado correctamente." });
      setSelectedRow({});
      handleClose();
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
            setMessage({ open: true, severity: "error", text: "Selecciona un criterio para editar." });
            return;
          }
          setMethodName("Actualizar"); setErrors({}); setOpen(true);
        },
        deleteRow,
      }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Criterio de Evaluación</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar criterios de evaluación</DialogContentText>
            <FormControl fullWidth margin="normal" error={!!errors.tipoEvaluacionId}>
              <InputLabel>Tipo de evaluación</InputLabel>
              <Select
                name="tipoEvaluacionId"
                value={formData.tipoEvaluacionId}
                onChange={handleChange}
                label="Tipo de evaluación"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {tiposEvaluacion.map(t => (
                  <MenuItem key={t.id} value={String(t.id)}>{t.nombre}</MenuItem>
                ))}
              </Select>
              {errors.tipoEvaluacionId && (
                <p style={{ color: "#d32f2f", margin: "3px 14px 0", fontSize: "0.75rem" }}>
                  {errors.tipoEvaluacionId}
                </p>
              )}
            </FormControl>
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

FormCriterioEvaluacion.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
