import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import StackButtons from "../StackButtons";
import BaseFormCampos from "../common/BaseFormCampos";
import { validateCamposBase } from "../utils/validations";

export default function FormProductoCategoria({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const initialData = { nombre: "", descripcion: "", estado: "" };
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});

  const create = () => {
    setFormData(initialData);
    setErrors({});
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una categoría para editar." });
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
      setMessage({ open: true, severity: "error", text: "Selecciona una categoría para eliminar." });
      return;
    }
    axios.delete(`/v1/producto_categoria/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Categoría eliminada correctamente." });
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = validateCamposBase(formData); // reutiliza validación (incluye XSS/SQLi si la agregaste allí)
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
    const url = isCreate ? "/v1/producto_categoria" : `/v1/producto_categoria/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: `Categoría ${isCreate ? "creada" : "actualizada"} con éxito!`
        });
        setOpen(false);
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
          <DialogTitle>{methodName} Categoría de Producto</DialogTitle>
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

FormProductoCategoria.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
