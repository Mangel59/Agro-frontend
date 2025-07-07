import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig.js";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const TipoInventarioSchema = Yup.object().shape({
  nombre: Yup.string().trim().required("El nombre es obligatorio."),
  descripcion: Yup.string().trim().required("La descripción es obligatoria."),
  estadoId: Yup.number().oneOf([0, 1], "Estado inválido"),
});

export default function FormTipoInventario({ setMessage, selectedRow, setSelectedRow, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estadoId: 1 });
    setMethodName("Agregar");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar" });
      return;
    }
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    const token = localStorage.getItem("token");
    axios.delete(`${SiteProps.urlbasev1}/tipo_inventario/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setMessage({ open: true, severity: "success", text: "Eliminado con éxito!" });
      reloadData();
    })
    .catch((error) => {
      setMessage({ open: true, severity: "error", text: `Error al eliminar: ${error.message}` });
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
            estadoId: selectedRow?.estadoId ?? 1,
          }}
          enableReinitialize
          validationSchema={TipoInventarioSchema}
          onSubmit={(values, { setSubmitting }) => {
            const token = localStorage.getItem("token");
            const url = selectedRow?.id
              ? `${SiteProps.urlbasev1}/tipo_inventario/${selectedRow.id}`
              : `${SiteProps.urlbasev1}/tipo_inventario`;
            const method = selectedRow?.id ? axios.put : axios.post;

            method(url, values, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
              .then(() => {
                setMessage({ open: true, severity: "success", text: "Guardado correctamente." });
                setOpen(false);
                reloadData();
              })
              .catch((error) => {
                setMessage({ open: true, severity: "error", text: `Error: ${error.message}` });
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <DialogTitle>{methodName} Tipo de Inventario</DialogTitle>
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
                    name="estadoId"
                    value={values.estadoId}
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

FormTipoInventario.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
