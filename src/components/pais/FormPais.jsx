import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem, FormHelperText
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormPais({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [formData, setFormData] = React.useState({
    nombre: "",
    codigo: "",
    acronimo: "",
    estado: ""
  });
  const [errors, setErrors] = React.useState({});

  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  const create = () => {
    setFormData({ nombre: "", codigo: "", acronimo: "", estado: "" });
    setErrors({});
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un país para editar." });
      return;
    }
    setFormData({
      nombre: selectedRow.nombre || "",
      codigo: selectedRow.codigo || "",
      acronimo: selectedRow.acronimo || "",
      estado: selectedRow.estadoId?.toString() || ""
    });
    setErrors({});
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un país para eliminar." });
      return;
    }
    axios.delete(`/v1/pais/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "País eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        console.error("❌ Error al eliminar país:", err);
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (invalidCharsRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre contiene caracteres no permitidos.";
    }

    if (!formData.codigo.toString().trim()) {
      newErrors.codigo = "El código es obligatorio.";
    } else if (invalidCharsRegex.test(formData.codigo.toString())) {
      newErrors.codigo = "El código contiene caracteres no permitidos.";
    }

    if (!formData.acronimo.trim()) {
      newErrors.acronimo = "El acrónimo es obligatorio.";
    } else if (invalidCharsRegex.test(formData.acronimo)) {
      newErrors.acronimo = "El acrónimo contiene caracteres no permitidos.";
    }

    if (!["1", "2"].includes(formData.estado)) {
      newErrors.estado = "Debe seleccionar un estado válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre.trim(),
      codigo: parseInt(formData.codigo),
      acronimo: formData.acronimo.trim().toUpperCase(),
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/pais" : `/v1/pais/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "País creado con éxito!" : "País actualizado con éxito!"
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
          <DialogTitle>{methodName} País</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar país</DialogContentText>

            <TextField
              fullWidth margin="dense"
              name="nombre" label="Nombre del País"
              value={formData.nombre} onChange={handleChange}
              error={!!errors.nombre} helperText={errors.nombre}
            />

            <TextField
              fullWidth margin="dense"
              name="codigo" label="Código" type="number"
              value={formData.codigo} onChange={handleChange}
              error={!!errors.codigo} helperText={errors.codigo}
            />

            <TextField
              fullWidth margin="dense"
              name="acronimo" label="Acrónimo"
              inputProps={{ maxLength: 3 }}
              value={formData.acronimo} onChange={handleChange}
              error={!!errors.acronimo} helperText={errors.acronimo}
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
              {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
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

FormPais.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
