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
import { useFormik } from "formik";
import * as Yup from "yup";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormProducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const handleOpen = (method, row = {}) => {
    setMethodName(method);
    setSelectedRow({
      id: row.id || 0,
      nombre: row.nombre || "",
      productoCategoria: row.productoCategoria || 0,
      descripcion: row.descripcion || "",
      estado: row.estado !== undefined ? row.estado : 1,
    });
    setOpen(true);
  };

  const create = () => handleOpen("Add");
  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar" });
      return;
    }
    handleOpen("Update", selectedRow);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .delete(`${SiteProps.urlbasev1}/producto/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Producto eliminado con éxito" });
        reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setMessage({ open: true, severity: "error", text: `Error al eliminar producto: ${errorMessage}` });
      });
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().trim("No puede contener solo espacios").strict(true).required("El nombre es obligatorio"),
    productoCategoria: Yup.number().required("La categoría es obligatoria"),
    descripcion: Yup.string().trim("No puede contener solo espacios").strict(true).required("La descripción es obligatoria"),
    estado: Yup.number().oneOf([0, 1], "Estado inválido"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: selectedRow?.nombre || "",
      productoCategoria: selectedRow?.productoCategoria || 0,
      descripcion: selectedRow?.descripcion || "",
      estado: selectedRow?.estado ?? 1,
    },
    validationSchema,
    onSubmit: (values) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
        return;
      }

      const method = methodName === "Add" ? axios.post : axios.put;
      const url =
        methodName === "Add"
          ? `${SiteProps.urlbasev1}/producto`
          : `${SiteProps.urlbasev1}/producto/${selectedRow.id}`;

      method(url, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          setMessage({
            open: true,
            severity: "success",
            text: `Producto ${methodName === "Add" ? "creado" : "actualizado"} con éxito`,
          });
          setOpen(false);
          reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message;
          setMessage({
            open: true,
            severity: "error",
            text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} producto: ${errorMessage}`,
          });
        });
    },
  });

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Producto</DialogTitle>
          <DialogContent>
            <DialogContentText>Completa el formulario.</DialogContentText>

            <TextField
              fullWidth
              margin="normal"
              id="nombre"
              name="nombre"
              label="Nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
            />

            <TextField
              fullWidth
              margin="normal"
              id="productoCategoria"
              name="productoCategoria"
              label="ID de categoría del producto"
              type="number"
              value={formik.values.productoCategoria}
              onChange={formik.handleChange}
              error={formik.touched.productoCategoria && Boolean(formik.errors.productoCategoria)}
              helperText={formik.touched.productoCategoria && formik.errors.productoCategoria}
            />

            <TextField
              fullWidth
              margin="normal"
              id="descripcion"
              name="descripcion"
              label="Descripción"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                id="estado"
                name="estado"
                value={formik.values.estado}
                onChange={formik.handleChange}
                error={formik.touched.estado && Boolean(formik.errors.estado)}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormProducto.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};