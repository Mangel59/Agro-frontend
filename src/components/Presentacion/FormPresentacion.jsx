/**
 * @file FormPresentacion.jsx
 * @module FormPresentacion
 * @description Componente de formulario para crear, actualizar o eliminar una presentación con Formik + Yup.
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function FormPresentacion({ setSelectedRow, selectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estado: 1 });
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar",
      });
      return;
    }
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .delete(`${SiteProps.urlbasev1}/presentaciones/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Presentación eliminada con éxito" });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar presentación: ${error.response?.data?.message || error.message}`,
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: selectedRow?.nombre || "",
      descripcion: selectedRow?.descripcion || "",
      estado: selectedRow?.estado ?? 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .trim("No puede contener solo espacios")
        .strict(true)
        .required("El nombre es obligatorio"),
      descripcion: Yup.string()
        .trim("No puede contener solo espacios")
        .strict(true)
        .required("La descripción es obligatoria"),
      estado: Yup.number().oneOf([0, 1], "Estado inválido"),
    }),
    onSubmit: (values) => {
      const id = selectedRow?.id || 0;
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({
          open: true,
          severity: "error",
          text: "Error: Token de autenticación no encontrado.",
        });
        return;
      }

      const url = `${SiteProps.urlbasev1}/presentaciones`;
      const request = methodName === "Agregar"
        ? axios.post(url, values, { headers: { Authorization: `Bearer ${token}` } })
        : axios.put(`${url}/${id}`, values, { headers: { Authorization: `Bearer ${token}` } });

      request
        .then(() => {
          setMessage({
            open: true,
            severity: "success",
            text: methodName === "Agregar" ? "Presentación creada con éxito" : "Presentación actualizada con éxito",
          });
          setOpen(false);
          reloadData();
        })
        .catch((error) => {
          setMessage({
            open: true,
            severity: "error",
            text: `Error al ${methodName === "Agregar" ? "crear" : "actualizar"} presentación: ${error.response?.data?.message || error.message}`,
          });
        });
    },
  });

  return (
    <React.Fragment>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: formik.handleSubmit }}>
        <DialogTitle>Presentación</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          {/* Campo: Nombre */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="nombre"
              name="nombre"
              label="Nombre"
              variant="standard"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              required
              autoFocus
            />
          </FormControl>

          {/* Campo: Descripción */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="descripcion"
              name="descripcion"
              label="Descripción"
              variant="standard"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
              required
            />
          </FormControl>

          {/* Campo: Estado */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              value={formik.values.estado}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.estado && Boolean(formik.errors.estado)}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

FormPresentacion.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }),
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
