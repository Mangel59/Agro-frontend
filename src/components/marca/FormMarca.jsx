import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Esquema de validación Yup
const MarcaSchema = Yup.object().shape({
  nombre: Yup.string().trim("No puede contener solo espacios").strict(true).required("El nombre es obligatorio."),
  descripcion: Yup.string()
    .trim("No puede contener solo espacios")
    .strict(true)
    .required("La descripción es obligatoria."),
  estado: Yup.number().oneOf([0, 1], "Estado inválido"),
});

export default function FormMarca({ setMessage, selectedRow, setSelectedRow, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estado: 1 });
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
    if (!selectedRow?.id || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado." });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/marca/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Marca eliminada con éxito!" });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${error.message}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose}>
        <Formik
          initialValues={{
            nombre: selectedRow?.nombre || "",
            descripcion: selectedRow?.descripcion || "",
            estado: selectedRow?.estado ?? 1,
          }}
          enableReinitialize
          validationSchema={MarcaSchema}
          onSubmit={(values, { setSubmitting }) => {
            const token = localStorage.getItem("token");
            const empresa = localStorage.getItem("empresa_id");
            const id = selectedRow?.id || 0;

            const payload = {
              ...values,
              empresa,
            };

            const url =
              methodName === "Agregar"
                ? `${SiteProps.urlbasev1}/marca`
                : `${SiteProps.urlbasev1}/marca/${id}`;

            const method = methodName === "Agregar" ? axios.post : axios.put;

            method(url, payload, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
              .then(() => {
                setMessage({
                  open: true,
                  severity: "success",
                  text: `Marca ${methodName === "Agregar" ? "creada" : "actualizada"} con éxito!`,
                });
                setSubmitting(false);
                setOpen(false);
                reloadData();
              })
              .catch((error) => {
                const errorMessage = error.response?.data?.message || error.message;
                setMessage({
                  open: true,
                  severity: "error",
                  text: `Error al guardar: ${errorMessage}`,
                });
                setSubmitting(false);
              });
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <DialogTitle>{methodName} Marca</DialogTitle>
              <DialogContent>
                <DialogContentText>Completa el formulario.</DialogContentText>

                <FormControl fullWidth margin="normal">
                  <TextField
                    name="nombre"
                    label="Nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    error={touched.nombre && Boolean(errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <TextField
                    name="descripcion"
                    label="Descripción"
                    value={values.descripcion}
                    onChange={handleChange}
                    error={touched.descripcion && Boolean(errors.descripcion)}
                    helperText={touched.descripcion && errors.descripcion}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    name="estado"
                    value={values.estado}
                    onChange={handleChange}
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
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

FormMarca.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};