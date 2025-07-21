import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem, FormHelperText
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormTipoBloque({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const initialData = {
    nombre: "",
    descripcion: "",
    estado: ""
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const invalidCharsRegex = /[<>/"'`;(){}[\]\\]/;

  const create = () => {
    setFormData(initialData);
    setErrors({});
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un tipo bloque para editar." });
      return;
    }

    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      estado: selectedRow.estadoId?.toString() || ""
    });

    setErrors({});
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un tipo bloque para eliminar." });
      return;
    }

    axios.delete(`/v1/tipo_bloque/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "tipo bloque eliminado correctamente." });
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

    if (formData.descripcion && invalidCharsRegex.test(formData.descripcion)) {
      newErrors.descripcion = "La descripción contiene caracteres no permitidos.";
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
      descripcion: formData.descripcion.trim(),
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/tipo_bloque" : `/v1/tipo_bloque/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "tipo bloque creado con éxito!" : "tipo bloque actualizado con éxito!"
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
          <DialogTitle>{methodName} tipo bloque</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar tipo bloque</DialogContentText>

            <TextField
              fullWidth margin="dense"
              name="nombre" label="Nombre del tipo bloque"
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

FormTipoBloque.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
