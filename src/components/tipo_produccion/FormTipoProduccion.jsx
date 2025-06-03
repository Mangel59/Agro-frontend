import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputLabel, TextField, Button, FormControl, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function FormTipoProduccion({ setSelectedRow, selectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estadoId: 1 });
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar" });
      return;
    }
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
      return;
    }
    axios.delete(`${SiteProps.urlbasev1}/tipo_produccion/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMessage({ open: true, severity: "success", text: "Tipo de Producción eliminado con éxito!" });
      reloadData();
    })
    .catch((error) => {
      setMessage({ open: true, severity: "error", text: `Error al eliminar: ${error.message}` });
    });
  };

  const handleClose = () => setOpen(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: selectedRow?.nombre || "",
      descripcion: selectedRow?.descripcion || "",
      estadoId: selectedRow?.estadoId ?? 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().trim().required("El nombre es obligatorio"),
      descripcion: Yup.string().trim().required("La descripción es obligatoria"),
      estadoId: Yup.number().oneOf([0, 1], "Estado inválido"),
    }),
    onSubmit: (values) => {
      const id = selectedRow?.id || 0;
      const url = methodName === "Agregar"
        ? `${SiteProps.urlbasev1}/tipo_produccion`
        : `${SiteProps.urlbasev1}/tipo_produccion/${id}`;
      const axiosMethod = methodName === "Agregar" ? axios.post : axios.put;
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
        return;
      }

      axiosMethod(url, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          setMessage({ open: true, severity: "success", text: `Tipo de Producción ${methodName === "Agregar" ? "creado" : "actualizado"} con éxito!` });
          setOpen(false);
          reloadData();
        })
        .catch((error) => {
          setMessage({ open: true, severity: "error", text: `Error al guardar: ${error.message}` });
        });
    },
  });

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: formik.handleSubmit }}>
        <DialogTitle>Tipo de Producción</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth margin="normal">
            <TextField id="nombre" name="nombre" label="Nombre" variant="standard"
              value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre} required autoFocus />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField id="descripcion" name="descripcion" label="Descripción" variant="standard"
              value={formik.values.descripcion} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion} required />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="estadoId-label">Estado</InputLabel>
            <Select labelId="estadoId-label" id="estadoId" name="estadoId"
              value={formik.values.estadoId} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.estadoId && Boolean(formik.errors.estadoId)}>
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
    </>
  );
}

FormTipoProduccion.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
