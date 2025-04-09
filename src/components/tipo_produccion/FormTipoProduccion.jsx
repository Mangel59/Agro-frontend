/**
 * @file FormTipoProduccion.jsx
 * @module FormTipoProduccion
 * @description Componente para crear, editar o eliminar Tipos de Producción usando Formik + Yup para validación de formularios y MUI para el diseño del diálogo modal de entrada de datos.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

/**
 * @typedef {Object} TipoProduccionRow
 * @property {number} id - ID del tipo de producción
 * @property {string} nombre - Nombre del tipo de producción
 * @property {string} descripcion - Descripción del tipo de producción
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el snackbar está visible
 * @property {string} severity - Nivel de severidad del mensaje ("success", "error", etc.)
 * @property {string} text - Contenido del mensaje que se mostrará
 */

/**
 * Componente FormTipoProduccion.
 *
 * @component
 * @param {Object} props
 * @param {function} props.setSelectedRow
 * @param {TipoProduccionRow} props.selectedRow
 * @param {function} props.setMessage
 * @param {function} props.reloadData
 * @returns {JSX.Element}
 */
export default function FormTipoProduccion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    props.setSelectedRow({ id: 0, nombre: "", descripcion: "", estado: 1 });
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      props.setMessage({
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
    if (props.selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/tipo_produccion/${props.selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Tipo de Producción eliminado con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar Tipo de Producción: ${msg}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: props.selectedRow?.nombre || "",
      descripcion: props.selectedRow?.descripcion || "",
      estado: props.selectedRow?.estado ?? 1,
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
      const id = props.selectedRow?.id || 0;
      const url =
        methodName === "Agregar"
          ? `${SiteProps.urlbasev1}/tipo_produccion`
          : `${SiteProps.urlbasev1}/tipo_produccion/${id}`;
      const axiosMethod = methodName === "Agregar" ? axios.post : axios.put;
      const token = localStorage.getItem("token");

      if (!token) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error: Token de autenticación no encontrado.",
        });
        return;
      }

      axiosMethod(url, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          props.setMessage({
            open: true,
            severity: "success",
            text:
              methodName === "Agregar"
                ? "Tipo de Producción creado con éxito!"
                : "Tipo de Producción actualizado con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const msg = error.response?.data?.message || error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al ${
              methodName === "Agregar" ? "crear" : "actualizar"
            } Tipo de Producción: ${msg}`,
          });
        });
    },
  });

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ component: "form", onSubmit: formik.handleSubmit }}
      >
        <DialogTitle>Tipo de Producción</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          {/* Nombre */}
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

          {/* Descripción */}
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

          {/* Estado */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label" sx={{ backgroundColor: "white", padding: "0 8px" }}>
              Estado
            </InputLabel>
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
    </>
  );
}

FormTipoProduccion.propTypes = {
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
