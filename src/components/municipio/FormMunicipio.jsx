/**
 * @file FormMunicipio.jsx
 * @module FormMunicipio
 * @description Formulario para crear o editar un municipio.
 *
 * Este componente renderiza un formulario dentro de un diálogo modal
 * para la gestión de municipios, incluyendo validación y envío a la API.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

/**
 * @typedef {Object} FormMunicipioProps
 * @property {boolean} open - Si el formulario está visible
 * @property {Function} setOpen - Función para cerrar el formulario
 * @property {number} selectedDepartamento - ID del departamento asociado
 * @property {Object|null} selectedRow - Datos del municipio seleccionado (para edición)
 * @property {"create"|"edit"} formMode - Modo del formulario (crear o editar)
 * @property {Function} setMessage - Función para mostrar notificaciones tipo snackbar
 * @property {Function} reloadData - Función para recargar la lista de municipios
 */

/**
 * Formulario modal de creación y edición de municipios.
 *
 * @param {FormMunicipioProps} props - Propiedades del componente
 * @returns {JSX.Element} El formulario de municipio
 */
export default function FormMunicipio({
  open = false,
  setOpen = () => {},
  selectedDepartamento,
  selectedRow = null,
  formMode = "create",
  setMessage,
  reloadData
}) {
  const initialData = {
    nombre: "",
    codigo: "",
    departamento: "",
    acronimo: "",
    estadoId: 1,
    departamentoId: selectedDepartamento,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  /**
   * Inicializa el formulario según si es modo edición o creación.
   */
  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, departamentoId: selectedDepartamento });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, selectedDepartamento]);

  /**
   * Maneja el cambio de campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement | { name: string, value: any }>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Valida los campos del formulario.
   * @returns {boolean} true si los campos son válidos
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.codigo?.toString().trim()) newErrors.codigo = "El código es obligatorio.";
    if (!formData.acronimo?.trim()) newErrors.acronimo = "El acrónimo es obligatorio.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Debe seleccionar estado.";
    if (!formData.departamentoId) newErrors.departamentoId = "Debe seleccionar un departamento.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Envía los datos a la API para crear o actualizar el municipio.
   */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (formMode === "edit" && selectedRow?.id) {
        await axios.put(`/v1/municipio/${selectedRow.id}`, formData);
        setMessage({
          open: true,
          severity: "success",
          text: "Municipio actualizado correctamente.",
        });
      } else {
        await axios.post("/v1/municipio", formData);
        setMessage({
          open: true,
          severity: "success",
          text: "Municipio creado correctamente.",
        });
      }

      setOpen(false);
      reloadData?.();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar municipio.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Municipio" : "Nuevo Municipio"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          error={!!errors.codigo}
          helperText={errors.codigo}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Acrónimo"
          name="acronimo"
          value={formData.acronimo}
          onChange={handleChange}
          error={!!errors.acronimo}
          helperText={errors.acronimo}
        />
        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
          </Select>
          {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
