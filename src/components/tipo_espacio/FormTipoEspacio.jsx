
/**
 * FormTipoEspacio componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, Box } from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";
import PropTypes from "prop-types";

/**
 * Formulario para gestionar tipos de espacios: agregar, actualizar y eliminar.
 */
/**
 * Componente FormTipoEspacio.
 * @module FormTipoEspacio.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FormTipoEspacio({ selectedRow, setSelectedRow, reloadData, setMessage }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const url = `${SiteProps.urlbasev1}/tipo_espacio`;
  const token = localStorage.getItem("token");

  // Función para abrir el formulario para crear
  const create = () => {
    const row = {
      id: null,
      nombre: "",
      descripcion: "",
      estado: 1,
    };
    setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  // Función para abrir el formulario para actualizar
  const update = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un tipo de espacio para actualizar.",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  // Función para eliminar el registro seleccionado
  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un tipo de espacio para eliminar.",
      });
      return;
    }
    axios
      .delete(`${url}/${selectedRow.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Tipo de espacio eliminado con éxito.",
        });
        reloadData();
        setSelectedRow(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar tipo de espacio: ${errorMessage}`,
        });
      });
  };

  // Función para manejar el cierre del formulario
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      nombre: selectedRow.nombre,
      descripcion: selectedRow.descripcion,
      estado: selectedRow.estado,
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Tipo de espacio creado con éxito!" : "Tipo de espacio actualizado con éxito!",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} tipo de espacio: ${errorMessage}`,
        });
      });
  };

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button variant="outlined" color="primary" onClick={create} style={{ marginRight: "10px" }}>
          Agregar
        </Button>
        <Button variant="outlined" color="primary" onClick={update} style={{ marginRight: "10px" }}>
          Actualizar
        </Button>
        <Button variant="outlined" color="primary" onClick={deleteRow}>
          Eliminar
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>{methodName === "Add" ? "Agregar Tipo de Espacio" : "Actualizar Tipo de Espacio"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario para gestionar un tipo de espacio.</DialogContentText>
          <Box component="div" sx={{ width: "100%", maxWidth: "600px", mx: "auto" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="nombre"
                  name="nombre"
                  label="Nombre"
                  fullWidth
                  variant="standard"
                  value={selectedRow?.nombre || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="descripcion"
                  name="descripcion"
                  label="Descripción"
                  fullWidth
                  variant="standard"
                  value={selectedRow?.descripcion || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="estado"
                  name="estado"
                  label="Estado"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={selectedRow?.estado || 1}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
FormTipoEspacio.propTypes = {
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }),
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
