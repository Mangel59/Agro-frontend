/**
 * @file FormEvaluacion.jsx
 * @module FormEvaluacion
 * @description Formulario para agregar, editar o eliminar una evaluación. Se muestra en un `Dialog` modal y gestiona su propio estado local.
 * @author Karla
 */

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Componente `FormEvaluacion`.
 * Permite agregar, editar y eliminar evaluaciones con campos controlados.
 *
 * @function
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onAdd - Función para agregar una nueva evaluación.
 * @param {Function} props.onUpdate - Función para actualizar una evaluación existente.
 * @param {Function} props.onDelete - Función para eliminar una evaluación.
 * @param {Object|null} props.selectedRow - Evaluación seleccionada para edición.
 * @param {Function} props.setSelectedRow - Función para actualizar la evaluación seleccionada.
 * @returns {JSX.Element} Componente de formulario con modal para gestión de evaluaciones.
 */
export default function FormEvaluacion({
  onAdd,
  onUpdate,
  onDelete,
  selectedRow,
  setSelectedRow,
}) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    eva_id: "",
    eva_nombre: "",
    eva_descripcion: "",
    eva_estado: 1,
  });

  /**
   * Abre el formulario y carga datos si hay una fila seleccionada.
   */
  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        eva_id: "",
        eva_nombre: "",
        eva_descripcion: "",
        eva_estado: 1,
      });
    }
    setOpen(true);
  };

  /**
   * Cierra el formulario y limpia la fila seleccionada.
   */
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {Object} e - Evento del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  /**
   * Envía los datos del formulario para agregar o actualizar.
   * @param {Object} e - Evento del formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.eva_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, eva_id: Date.now() });
    }
    handleClose();
  };

  /**
   * Elimina la evaluación seleccionada si existe.
   */
  const handleDelete = () => {
    if (selectedRow?.eva_id) {
      onDelete(selectedRow.eva_id);
      setSelectedRow(null);
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          ADD
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<EditIcon />}
          onClick={handleOpen}
          disabled={!selectedRow}
        >
          UPDATE
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={!selectedRow}
        >
          DELETE
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedRow ? "Editar Evaluación" : "Agregar Evaluación"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="eva_nombre"
            label="Nombre"
            value={formData.eva_nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="eva_descripcion"
            label="Descripción"
            value={formData.eva_descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="eva_estado"
            label="Estado (1: Activo, 0: Inactivo)"
            type="number"
            value={formData.eva_estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>
            {selectedRow ? "Actualizar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
