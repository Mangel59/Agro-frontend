import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import StackButtons from "../StackButtons";
import BaseFormCampos from "../common/BaseFormCampos";
import { validateCamposBase } from "../utils/validations";

export default function FormTipoProduccion({
  open,
  setOpen,
  selectedRow,
  setSelectedRow,
  setMessage,
  reloadData
}) {
  const [methodName, setMethodName] = React.useState("");
  const initialData = { nombre: "", descripcion: "", estado: "" };
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open && selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        estado: selectedRow.estadoId?.toString() || ""
      });
      setMethodName("Actualizar");
    } else {
      setFormData(initialData);
      setMethodName("Agregar");
    }
    setErrors({});
  }, [open, selectedRow]);

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
    const newErrors = validateCamposBase(formData); // reutiliza validación central (incluye XSS/SQLi si lo agregaste)
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
    const url = isCreate ? "/v1/tipo_produccion" : `/v1/tipo_produccion/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: `Tipo de Producción ${isCreate ? "creado" : "actualizado"} con éxito!`
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${err.message || "Network Error"}`
        });
      });
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un tipo de producción para eliminar." });
      return;
    }

    axios.delete(`/v1/tipo_produccion/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Producción eliminado correctamente." });
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

  return (
    <>
      <StackButtons
        methods={{
          create: () => { setFormData(initialData); setMethodName("Agregar"); setErrors({}); setOpen(true); },
          update: () => {
            if (!selectedRow?.id) {
              setMessage({ open: true, severity: "error", text: "Selecciona un tipo de producción para editar." });
              return;
            }
            setMethodName("Actualizar");
            setErrors({});
            setOpen(true);
          },
          deleteRow
        }}
      />

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle>{methodName} Tipo de Producción</DialogTitle>
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

FormTipoProduccion.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
