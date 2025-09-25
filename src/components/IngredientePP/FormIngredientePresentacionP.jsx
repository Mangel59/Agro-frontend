import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormIngredientePresentacionP({
  open, setOpen, selectedRow, setSelectedRow, setMessage, reloadData
}) {
  const initialData = {
    nombre: "", descripcion: "",
    ingredienteId: "", presentacionProductoId: "", estadoId: ""
  };

  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [ingredientes, setIngredientes] = React.useState([]);
  const [presentaciones, setPresentaciones] = React.useState([]);

  const isEdit = Boolean(selectedRow?.id);
  const title = isEdit ? "Actualizar" : "Crear";

  const labelOf = (it) => it?.name ?? it?.nombre ?? it?.label ?? `ID ${it?.id}`;

  React.useEffect(() => {
    if (!open) return;

    // Prefill edición
    if (isEdit) {
      setFormData({
        nombre: selectedRow.nombre ?? "",
        descripcion: selectedRow.descripcion ?? "",
        ingredienteId: selectedRow.ingredienteId != null ? String(selectedRow.ingredienteId) : "",
        presentacionProductoId: selectedRow.presentacionProductoId != null ? String(selectedRow.presentacionProductoId) : "",
        estadoId: selectedRow.estadoId != null ? String(selectedRow.estadoId) : ""
      });
    } else {
      setFormData(initialData);
    }
    setErrors({});

    // Cargar listas (sin paginación)
    Promise.all([
      axios.get("/v1/items/ingrediente/0").then(res => Array.isArray(res.data) ? res.data : []),
      axios.get("/v1/items/producto_presentacion/0").then(res => Array.isArray(res.data) ? res.data : []),
    ])
      .then(([ings, pres]) => {
        setIngredientes(ings);
        setPresentaciones(pres);
      })
      .catch(() => {
        setIngredientes([]);
        setPresentaciones([]);
      });

  }, [open, isEdit, selectedRow]); // <<< CIERRE del useEffect

  const handleClose = () => {
    setOpen(false);
    setFormData(initialData);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // value como string
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.ingredienteId) newErrors.ingredienteId = "Requerido.";
    if (!formData.presentacionProductoId) newErrors.presentacionProductoId = "Requerido.";
    if (!formData.estadoId) newErrors.estadoId = "Debe seleccionar un estado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      ingredienteId: parseInt(formData.ingredienteId, 10),
      presentacionProductoId: parseInt(formData.presentacionProductoId, 10),
      estadoId: parseInt(formData.estadoId, 10)
    };

    try {
      if (isEdit) {
        await axios.put(`/v1/ingrediente-presentacion-producto/${selectedRow.id}`, payload);
      } else {
        await axios.post("/v1/ingrediente-presentacion-producto", payload);
      }
      setMessage({
        open: true,
        severity: "success",
        text: isEdit ? "Ingrediente actualizado correctamente" : "Ingrediente agregado con éxito"
      });
      setSelectedRow({});
      handleClose();
      reloadData();
    } catch (err) {
      setMessage({ open: true, severity: "error", text: `Error: ${err?.message || "operación fallida"}` });
    }
  };

  const deleteRow = async () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar." });
      return;
    }
    try {
      await axios.delete(`/v1/ingrediente-presentacion-producto/${selectedRow.id}`);
      setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
      setSelectedRow({});
      handleClose();
      reloadData();
    } catch (err) {
      setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err?.message || ""}` });
    }
  };

  return (
    <>
      <StackButtons
        methods={{
          create: () => { setSelectedRow({}); setFormData(initialData); setErrors({}); setOpen(true); },
          update: () => {
            if (!selectedRow?.id) {
              setMessage({ open: true, severity: "error", text: "Selecciona una fila para editar." });
              return;
            }
            setErrors({});
            setOpen(true);
          },
          deleteRow
        }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{title} Ingrediente</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestión de ingredientes por presentación</DialogContentText>

            <FormControl fullWidth margin="normal" error={!!errors.ingredienteId}>
              <InputLabel>Ingrediente</InputLabel>
              <Select
                name="ingredienteId"
                value={formData.ingredienteId}
                onChange={handleChange}
                label="Ingrediente"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {ingredientes.map((ing) => (
                  <MenuItem key={ing.id} value={String(ing.id)}>
                    {labelOf(ing)}
                  </MenuItem>
                ))}
              </Select>
              {errors.ingredienteId && <p style={{ color:"#d32f2f", fontSize:"0.75rem", margin:"3px 14px 0" }}>{errors.ingredienteId}</p>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.presentacionProductoId}>
              <InputLabel>Presentación</InputLabel>
              <Select
                name="presentacionProductoId"
                value={formData.presentacionProductoId}
                onChange={handleChange}
                label="Presentación"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {presentaciones.map((pres) => (
                  <MenuItem key={pres.id} value={String(pres.id)}>
                    {labelOf(pres)}
                  </MenuItem>
                ))}
              </Select>
              {errors.presentacionProductoId && <p style={{ color:"#d32f2f", fontSize:"0.75rem", margin:"3px 14px 0" }}>{errors.presentacionProductoId}</p>}
            </FormControl>

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

            <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
              <InputLabel>Estado</InputLabel>
              <Select name="estadoId" value={formData.estadoId} onChange={handleChange} label="Estado">
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
              {errors.estadoId && <p style={{ color:"#d32f2f", fontSize:"0.75rem", margin:"3px 14px 0" }}>{errors.estadoId}</p>}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>CANCELAR</Button>
            <Button type="submit">{(isEdit ? "Actualizar" : "Crear").toUpperCase()}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormIngredientePresentacionP.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
