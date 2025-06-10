import PropTypes from "prop-types";
import * as React from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function FormTipoMovimiento({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [movimientos, setMovimientos] = React.useState([]);

  const loadMovimientos = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado" });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/movimiento`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMovimientos(res.data);
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al cargar movimientos: ${error.message}`,
        });
      });
  };

  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estado: 1, movimientoId: "" });
    setMethodName("Agregar");
    setOpen(true);
    loadMovimientos();
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar" });
      return;
    }
    setMethodName("Actualizar");
    setOpen(true);
    loadMovimientos();
  };

  const deleteRow = () => {
    if (selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado" });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/tipo_movimiento/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Movimiento eliminado con éxito!" });
        reloadData();
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message;
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${msg}` });
      });
  };

  const handleClose = () => setOpen(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: selectedRow?.nombre || "",
      descripcion: selectedRow?.descripcion || "",
      estado: selectedRow?.estado ?? 1,
      movimientoId: selectedRow?.movimientoId || "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().trim("No puede estar vacío").strict(true).required("El nombre es obligatorio"),
      descripcion: Yup.string().trim("No puede estar vacío").strict(true).required("La descripción es obligatoria"),
      movimientoId: Yup.number().required("El movimiento es obligatorio"),
      estado: Yup.number().oneOf([0, 1], "Estado inválido").required(),
    }),
    onSubmit: (values) => {
      const id = selectedRow?.id || 0;
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({ open: true, severity: "error", text: "Token no encontrado" });
        return;
      }

      let empresaId = null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        empresaId = payload.empresaId;
      } catch (e) {
        setMessage({ open: true, severity: "error", text: "Error al obtener empresa del token" });
        return;
      }

      const finalValues = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        estadoId: values.estado,               // ✅ corregido para backend
        movimientoId: values.movimientoId,
        empresaId: empresaId,
      };

      const url = methodName === "Agregar"
        ? `${SiteProps.urlbasev1}/tipo_movimiento`
        : `${SiteProps.urlbasev1}/tipo_movimiento/${id}`;
      const axiosMethod = methodName === "Agregar" ? axios.post : axios.put;

      axiosMethod(url, finalValues, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
        .then(() => {
          setMessage({
            open: true,
            severity: "success",
            text: methodName === "Agregar" ? "Creado con éxito!" : "Actualizado con éxito!",
          });
          setOpen(false);
          reloadData();
        })
        .catch((error) => {
          const msg = error.response?.data?.message || error.message;
          setMessage({ open: true, severity: "error", text: `Error al guardar: ${msg}` });
        });
    },
  });

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: formik.handleSubmit }}>
        <DialogTitle>Tipo de Movimiento</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

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
            />
          </FormControl>

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

          <FormControl fullWidth margin="normal">
            <InputLabel id="movimientoId-label">Movimiento</InputLabel>
            <Select
              labelId="movimientoId-label"
              id="movimientoId"
              name="movimientoId"
              value={formik.values.movimientoId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.movimientoId && Boolean(formik.errors.movimientoId)}
            >
              {movimientos.map((mov) => (
                <MenuItem key={mov.id} value={mov.id}>
                  {mov.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
    </>
  );
}

FormTipoMovimiento.propTypes = {
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
    movimientoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
