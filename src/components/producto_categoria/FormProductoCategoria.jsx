/**
 * @file FormProductoCategoria.jsx
 * @module FormProductoCategoria
 * @description Componente de formulario para agregar, editar y eliminar categorías de productos.
 * Utiliza Formik y Yup para validación, y envía el estado como "Activo" automáticamente.
 * Incluye un diálogo modal y botones de acción. Utiliza Material UI y Axios para las operaciones CRUD.
 * @author Karla
 */

import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

/**
 * Formulario para gestión de categorías de productos con Formik + Yup.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Objeto con los datos de la fila seleccionada
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @param {Function} props.setMessage - Función para mostrar mensajes con Snackbar
 * @param {Function} props.reloadData - Función para recargar los datos desde el backend
 * @returns {JSX.Element} Componente del formulario
 */
export default function FormProductoCategoria(props) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      estado: 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().trim("no puede contener solo espacios").strict(true).required("El nombre es obligatorio"),
      descripcion: Yup.string().trim("no puede contener solo espacios").strict(true).required("El nombre es obligatorio"),
    }),
  
    onSubmit: (values) => {
      const payload = {
        id: methodName === "Add" ? null : props.selectedRow?.id,
        nombre: values.nombre.trim(),
        descripcion: values.descripcion.trim(),
        estado: 1,
      };

      const url = `${SiteProps.urlbasev1}/producto_categoria`;
      const method = methodName === "Add" ? axios.post : axios.put;
      const endpoint = methodName === "Add" ? url : `${url}/${props.selectedRow.id}`;

      method(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(() => {
          props.setMessage({
            open: true,
            severity: "success",
            text:
              methodName === "Add"
                ? "Producto categoría creada con éxito."
                : "Producto categoría actualizada con éxito.",
          });
          props.reloadData();
          setOpen(false);
        })
        .catch(() => {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al enviar datos. Intente nuevamente.",
          });
        });
    },
  });

  const create = () => {
    formik.resetForm();
    formik.setFieldValue("estado", 1);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      return props.setMessage({ open: true, severity: "error", text: "Seleccione una fila para actualizar." });
    }
    formik.setValues({
      nombre: props.selectedRow.nombre || "",
      descripcion: props.selectedRow.descripcion || "",
      estado: 1,
    });
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      return props.setMessage({ open: true, severity: "error", text: "Seleccione una fila para eliminar." });
    }
    axios
      .delete(`${SiteProps.urlbasev1}/producto_categoria/${props.selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto categoría eliminada con éxito.",
        });
        props.reloadData();
      })
      .catch(() => {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar la categoría. Intente nuevamente.",
        });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create} sx={{ mr: 1 }}>
          Agregar
        </Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={update} sx={{ mr: 1 }}>
          Actualizar
        </Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={deleteRow}>
          Eliminar
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{methodName === "Add" ? "Agregar Categoría" : "Actualizar Categoría"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            margin="normal"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
          />

          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            margin="normal"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
            helperText={formik.touched.descripcion && formik.errors.descripcion}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={formik.handleSubmit}>{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
