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
  const [methodName, setMethodName] = React.useState("");
  const initialData = {
    nombre: "", descripcion: "",
    ingredienteId: "", presentacionProductoId: "", estadoId: ""
  };
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [ingredientes, setIngredientes] = React.useState([]);
  const [presentaciones, setPresentaciones] = React.useState([]);

  React.useEffect(() => {
    if (open && selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        ingredienteId: selectedRow.ingredienteId?.toString() || "",
        presentacionProductoId: selectedRow.presentacionProductoId?.toString() || "",
        estadoId: selectedRow.estadoId?.toString() || ""
      });
      setMethodName("Update");
    } else {
      setFormData(initialData);
      setMethodName("Add");
    }

    setErrors({});

    axios.get("/v1/ingrediente")
      .then(res => {
        const data = res.data;
        setIngredientes(Array.isArray(data) ? data : []);
      })
      .catch(() => setIngredientes([]));

    axios.get("/v1/producto_presentacion")
      .then(res => {
        const data = res.data;
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setPresentaciones(lista);
      })
      .catch(err => {
        console.error("❌ Error al cargar presentaciones:", err);
        setPresentaciones([]);
      });
  }, [open, selectedRow]);

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
    if (!formData.ingredienteId) newErrors.ingredienteId = "Requerido.";
    if (!formData.presentacionProductoId) newErrors.presentacionProductoId = "Requerido.";
    if (!formData.estadoId) newErrors.estadoId = "Debe seleccionar un estado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      ingredienteId: parseInt(formData.ingredienteId),
      presentacionProductoId: parseInt(formData.presentacionProductoId),
      estadoId: parseInt(formData.estadoId)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add"
      ? "/v1/ingrediente-presentacion-producto"
      : `/v1/ingrediente-presentacion-producto/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add"
            ? "Ingrediente agregado con éxito"
            : "Ingrediente actualizado correctamente"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
      });
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar." });
      return;
    }

    axios.delete(`/v1/ingrediente-presentacion-producto/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  return (
    <>
      <StackButtons methods={{
        create: () => { setFormData(initialData); setMethodName("Add"); setOpen(true); },
        update: () => {
          if (!selectedRow?.id) {
            setMessage({ open: true, severity: "error", text: "Selecciona una fila para editar." });
            return;
          }
          setOpen(true);
        },
        deleteRow
      }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Ingrediente</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestión de ingredientes por presentación</DialogContentText>

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
                  <MenuItem key={ing.id} value={ing.id}>
                    {ing.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.ingredienteId && (
                <p style={{ color: "#d32f2f", fontSize: "0.75rem", margin: "3px 14px 0" }}>
                  {errors.ingredienteId}
                </p>
              )}
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
                  <MenuItem key={pres.id} value={pres.id}>
                    {pres.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.presentacionProductoId && (
                <p style={{ color: "#d32f2f", fontSize: "0.75rem", margin: "3px 14px 0" }}>
                  {errors.presentacionProductoId}
                </p>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
              <InputLabel>Estado</InputLabel>
              <Select name="estadoId" value={formData.estadoId} onChange={handleChange} label="Estado">
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
              {errors.estadoId && (
                <p style={{ color: "#d32f2f", fontSize: "0.75rem", margin: "3px 14px 0" }}>
                  {errors.estadoId}
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

FormIngredientePresentacionP.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
