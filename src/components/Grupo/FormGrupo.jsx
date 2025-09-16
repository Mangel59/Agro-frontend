import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import StackButtons from "../StackButtons";
import BaseFormCampos from "../common/BaseFormCampos";
import { validateCamposBase } from "../utils/validations";

export default function FormGrupo({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const initialData = { nombre: "", descripcion: "", estado: "" };
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Si el diálogo se abre por "update", precarga datos
  useEffect(() => {
    if (!open) return;
    if (selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        estado: selectedRow.estadoId?.toString() || "",
      });
      setMethodName("Actualizar");
    } else {
      setFormData(initialData);
      setMethodName("Agregar");
    }
    setErrors({});
  }, [open, selectedRow]);

  const create = () => {
    setFormData(initialData);
    setErrors({});
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un grupo para editar." });
      return;
    }
    setMethodName("Actualizar");
    setErrors({});
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un grupo para eliminar." });
      return;
    }
    axios
      .delete(`/v1/grupo/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Grupo eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setFormData(initialData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = validateCamposBase(formData); // usa validación central (obligatorios + seguridad)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado, 10),
    };

    const isCreate = methodName === "Agregar";
    const method = isCreate ? axios.post : axios.put;
    const url = isCreate ? "/v1/grupo" : `/v1/grupo/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: `Grupo ${isCreate ? "creado" : "actualizado"} con éxito!`,
        });
        handleClose();
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message || "Network Error"}` });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle>{methodName} Grupo</DialogTitle>
          <DialogContent>
            <BaseFormCampos formData={formData} errors={errors} handleChange={handleChange} />
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

FormGrupo.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
