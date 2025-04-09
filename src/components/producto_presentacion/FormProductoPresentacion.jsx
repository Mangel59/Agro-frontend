/**
 * @file FormProductoPresentacion.jsx
 * @module FormProductoPresentacion
 * @description Componente de formulario para agregar, editar o eliminar registros de Producto Presentación.
 * Utiliza Formik, Yup, Material UI y Axios para validaciones, formularios y conexión con el backend.
 * Incluye validación de token, errores del backend y manejo de mensajes personalizados en un snackbar externo.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

/**
 * Componente FormProductoPresentacion.
 *
 * @component
 * @param {Object} props - Props del componente
 * @param {Object} props.selectedRow - Objeto seleccionado para edición
 * @param {function(Object): void} props.setSelectedRow - Setter del objeto seleccionado
 * @param {function(Object): void} props.setMessage - Setter para mostrar mensajes en el snackbar
 * @param {function(): void} props.reloadData - Función para recargar los datos
 * @param {Array<Object>} props.productos - Lista de productos para el selector
 * @param {Array<Object>} props.unidades - Lista de unidades para el selector
 * @param {Array<Object>} props.marcas - Lista de marcas para el selector
 * @param {Array<Object>} props.presentacionesList - Lista de presentaciones para el selector
 * @returns {JSX.Element} Formulario para crear, actualizar o eliminar Producto Presentación
 */
export default function FormProductoPresentacion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("Add");

  const create = () => {
    props.setSelectedRow({
      id: 0,
      nombre: "",
      producto: "",
      unidad: "",
      cantidad: 0,
      marca: "",
      presentacion: "",
      descripcion: "",
      estado: 1,
    });
    setMethodName("Add");
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
    setMethodName("Update");
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

    const id = props.selectedRow.id;
    const url = `${SiteProps.urlbasev1}/producto-presentacion/${id}`;
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
      .delete(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto Presentación eliminado con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar Producto Presentación: ${errorMessage}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: props.selectedRow?.nombre || "",
      producto: props.selectedRow?.producto || "",
      unidad: props.selectedRow?.unidad || "",
      cantidad: props.selectedRow?.cantidad || 0,
      marca: props.selectedRow?.marca || "",
      presentacion: props.selectedRow?.presentacion || "",
      descripcion: props.selectedRow?.descripcion || "",
      estado: props.selectedRow?.estado || 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().trim("No puede estar vacío").required("El nombre es obligatorio"),
      producto: Yup.number().required("El producto es obligatorio"),
      unidad: Yup.number().required("La unidad es obligatoria"),
      cantidad: Yup.number().min(1, "Debe ser mayor a 0").required("Cantidad obligatoria"),
      marca: Yup.number().required("La marca es obligatoria"),
      presentacion: Yup.number().required("La presentación es obligatoria"),
      descripcion: Yup.string().trim("No puede estar vacío").required("La descripción es obligatoria"),
      estado: Yup.number().oneOf([0, 1], "Estado inválido"),
    }),
    onSubmit: (values) => {
      const id = props.selectedRow?.id || 0;
      const url = methodName === "Add"
        ? `${SiteProps.urlbasev1}/producto-presentacion`
        : `${SiteProps.urlbasev1}/producto-presentacion/${id}`;
      const token = localStorage.getItem("token");

      if (!token) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error: Token de autenticación no encontrado.",
        });
        return;
      }

      const axiosMethod = methodName === "Add" ? axios.post : axios.put;

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
            text: methodName === "Add"
              ? "Producto Presentación creado con éxito!"
              : "Producto Presentación actualizado con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} Producto Presentación: ${errorMessage || "Error indefinido"}`,
          });
        });
    },
  });

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: formik.handleSubmit }}>
        <DialogTitle>Producto Presentación</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          {/* Producto */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="producto-label">Producto</InputLabel>
            <Select
              labelId="producto-label"
              id="producto"
              name="producto"
              value={formik.values.producto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.producto && Boolean(formik.errors.producto)}
            >
              {props.productos.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Nombre */}
          <TextField
            fullWidth
            margin="normal"
            id="nombre"
            name="nombre"
            label="Nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
          />

          {/* Unidad */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="unidad-label">Unidad</InputLabel>
            <Select
              labelId="unidad-label"
              id="unidad"
              name="unidad"
              value={formik.values.unidad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.unidad && Boolean(formik.errors.unidad)}
            >
              {props.unidades.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cantidad */}
          <TextField
            fullWidth
            margin="normal"
            id="cantidad"
            name="cantidad"
            label="Cantidad"
            type="number"
            value={formik.values.cantidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
            helperText={formik.touched.cantidad && formik.errors.cantidad}
          />

          {/* Marca */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="marca-label">Marca</InputLabel>
            <Select
              labelId="marca-label"
              id="marca"
              name="marca"
              value={formik.values.marca}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.marca && Boolean(formik.errors.marca)}
            >
              {props.marcas.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Presentación */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="presentacion-label">Presentación</InputLabel>
            <Select
              labelId="presentacion-label"
              id="presentacion"
              name="presentacion"
              value={formik.values.presentacion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.presentacion && Boolean(formik.errors.presentacion)}
            >
              {props.presentacionesList.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Descripción */}
          <TextField
            fullWidth
            margin="normal"
            id="descripcion"
            name="descripcion"
            label="Descripción"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
            helperText={formik.touched.descripcion && formik.errors.descripcion}
          />

          {/* Estado */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              value={formik.values.estado}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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

FormProductoPresentacion.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  productos: PropTypes.array,
  unidades: PropTypes.array,
  marcas: PropTypes.array,
  presentacionesList: PropTypes.array,
};
