import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import StackButtons from "../StackButtons";
import BaseFormCampos from "../common/BaseFormCampos";
import { validateCamposBase } from "../utils/validations";

export default function FormUnidad({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const initialData = { nombre: "", descripcion: "", estado: "" };
  const [formData, setFormData] = React.useState(initialData);

  const create = () => {
    setFormData(initialData);
    setErrors({});
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una unidad para editar." });
      return;
    }
    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      estado: selectedRow.estadoId?.toString() || ""
    });
    setErrors({});
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una unidad para eliminar." });
      return;
    }
    axios.delete(`/v1/unidad/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Unidad eliminada correctamente." });
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
    const newErrors = validateCamposBase(formData); // ✔ usa la validación central (obligatorios + seguridad)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado, 10)
    };

    const isCreate = methodName === "Agregar";
    const method = isCreate ? axios.post : axios.put;
    const url = isCreate ? "/v1/unidad" : `/v1/unidad/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: `Unidad ${isCreate ? "creada" : "actualizada"} con éxito!`
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
          <DialogTitle>{methodName} Unidad</DialogTitle>
          <DialogContent>
            <BaseFormCampos
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
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

FormUnidad.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
