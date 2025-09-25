import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Box
} from "@mui/material";
import StackButtons from "../StackButtons";

/* Helpers para normalizar respuestas */
const toList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content; // Page<>
  if (Array.isArray(payload?.data)) return payload.data;       // { data: [...] }
  try { return Array.isArray(JSON.parse(payload)) ? JSON.parse(payload) : []; } catch { return []; }
};

export default function FormProceso({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [tiposProduccion, setTiposProduccion] = React.useState([]);
  const [loadingTipos, setLoadingTipos] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const initialData = {
    nombre: "",
    descripcion: "",
    tipoProduccionId: "",
    estado: "",
  };

  const [formData, setFormData] = React.useState(initialData);

  const loadTiposProduccion = async () => {
    setLoadingTipos(true);
    try {
      // FIX 1: endpoint correcto
      const res = await axios.get("/v1/items/tipo_produccion/0");
      // FIX 3: normalizar respuesta
      const lista = toList(res.data);
      setTiposProduccion(lista);
    } catch (err) {
      console.error("Error al cargar tipo de producción:", err);
      setTiposProduccion([]);
      setMessage({
        open: true,
        severity: "error",
        text: "No se pudo cargar el catálogo de Tipo de Producción.",
      });
    } finally {
      setLoadingTipos(false);
    }
  };

  const create = () => {
    setFormData(initialData);
    setMethodName("Crear");
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
      // mantener como string para el <Select/>
      tipoProduccionId: selectedRow.tipoProduccionId != null ? String(selectedRow.tipoProduccionId) : "",
      // si tu backend usa estadoId 1/2, manténlo como string
      estado: selectedRow.estadoId != null ? String(selectedRow.estadoId) : "",
    });

    setMethodName("Actualizar");
    loadTiposProduccion();
    setErrors({});
    setOpen(true);
  };

  const deleteRow = async () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un proceso para eliminar." });
      return;
    }

    try {
      await axios.delete(`/v1/proceso/${selectedRow.id}`);
      setMessage({ open: true, severity: "success", text: "Proceso eliminado correctamente." });
      setSelectedRow({});
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: `Error al eliminar: ${err?.response?.data?.message || err.message}`,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // value siempre string en Select/TextField
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      // enviar como número
      tipoProduccionId: Number(formData.tipoProduccionId),
      estadoId: Number(formData.estado),
    };

    try {
      if (methodName === "Crear") {
        await axios.post("/v1/proceso", payload);
      } else {
        await axios.put(`/v1/proceso/${selectedRow.id}`, payload);
      }
      setMessage({
        open: true,
        severity: "success",
        text: methodName === "Crear" ? "Proceso creado con éxito!" : "Proceso actualizado con éxito!",
      });
      setOpen(false);
      setSelectedRow({});
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: `Error: ${err?.response?.data?.message || err.message || "Network Error"}`,
      });
    }
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Proceso</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar procesos</DialogContentText>

            {/* Tipo de Producción */}
            <FormControl fullWidth margin="normal" error={!!errors.tipoProduccionId}>
              <InputLabel>Tipo de Producción</InputLabel>
              <Select
                name="tipoProduccionId"
                value={formData.tipoProduccionId}
                onChange={handleChange}
                label="Tipo de Producción"
                disabled={loadingTipos}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {loadingTipos ? (
                  <MenuItem disabled>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={18} /> Cargando…
                    </Box>
                  </MenuItem>
                ) : (
                  tiposProduccion.map((tp) => (
                    // FIX 2: mostrar tp.name y usar value string
                    <MenuItem key={tp.id} value={String(tp.id)}>
                      {tp.name ?? `Tipo ${tp.id}`}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.tipoProduccionId && (
                <p style={{ color: "#d32f2f", margin: "3px 14px 0", fontSize: "0.75rem" }}>
                  {errors.tipoProduccionId}
                </p>
              )}
            </FormControl>

            {/* Nombre */}
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

            {/* Descripción */}
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

            {/* Estado (nota: si ya migraste a estados dinámicos, cambia este bloque a un catálogo) */}
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
