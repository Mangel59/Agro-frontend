/**
 * @file FormProveedor.jsx
 * @module FormProveedor
 * @description Componente de formulario para agregar, editar o eliminar proveedores. Usa Material UI y funciona con JSON local. Ideal para CRUDs simples sin backend complejo.
 * @author Karla
 */

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

/**
 * Componente FormProveedor.
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onAdd - Función para agregar un nuevo proveedor
 * @param {Function} props.onUpdate - Función para actualizar un proveedor existente
 * @param {Function} props.onDelete - Función para eliminar un proveedor por ID
 * @param {Object|null} props.selectedRow - Fila seleccionada (proveedor a editar)
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @returns {JSX.Element}
 */

export default function FormProveedor({
  onAdd,
  onUpdate,
  onDelete,
  selectedRow,
  setSelectedRow,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    pro_id: "",
    pro_empresa_id: "",
    pro_fecha_creacion: "",
    pro_estado: 1,
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        pro_id: "",
        pro_empresa_id: "",
        pro_fecha_creacion: "",
        pro_estado: 1,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setFormData({
      pro_id: "",
      pro_empresa_id: "",
      pro_fecha_creacion: "",
      pro_estado: 1,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pro_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, pro_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow?.pro_id) {
      onDelete(selectedRow.pro_id);
      setSelectedRow(null);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          style={{ marginRight: "1rem" }}
        >
          Agregar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpen}
          disabled={!selectedRow}
          style={{ marginRight: "1rem" }}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={!selectedRow}
        >
          Eliminar
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRow ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
        <DialogContent>
          <TextField
            name="pro_empresa_id"
            label="Empresa ID"
            value={formData.pro_empresa_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="pro_fecha_creacion"
            label="Fecha Creación"
            value={formData.pro_fecha_creacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="datetime-local"
          />
          <TextField
            name="pro_estado"
            label="Estado (1: Activo, 0: Inactivo)"
            value={formData.pro_estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
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

// Validación de tipos con PropTypes
FormProveedor.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
};
