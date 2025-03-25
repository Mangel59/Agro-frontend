/**
 * @file FormTipoEspacio.jsx
 * @module FormTipoEspacio
 * @exports FormTipoEspacio
 * @description Formulario modal para agregar, actualizar o eliminar tipos de espacio.
 * Permite ingresar nombre, descripción y estado del tipo de espacio.
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
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente de formulario para gestionar tipos de espacio.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.selectedRow - Fila actualmente seleccionada.
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {Function} props.reloadData - Función para recargar los datos desde el backend.
 * @param {Function} props.setMessage - Función para mostrar mensajes de éxito o error.
 * @returns {JSX.Element} El componente de formulario.
 */
export default function FormTipoEspacio({
  selectedRow,
  setSelectedRow,
  reloadData,
  setMessage,
}) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const url = `${SiteProps.urlbasev1}/tipo_espacio`;
  const token = localStorage.getItem("token");

  const create = () => {
    setSelectedRow({
      id: null,
      nombre: "",
      descripcion: "",
      estado: 1,
    });
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id == null) {
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

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id == null) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un tipo de espacio para eliminar.",
      });
      return;
    }

    axios
      .delete(`${url}/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleClose = () => {
    setOpen(false);
  };

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
          text:
            methodName === "Add"
              ? "Tipo de espacio creado con éxito!"
              : "Tipo de espacio actualizado con éxito!",
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={create}
          sx={{ mr: 1 }}
        >
          Agregar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          sx={{ mr: 1 }}
        >
          Actualizar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
        >
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
        <DialogTitle>
          {methodName === "Add"
            ? "Agregar Tipo de Espacio"
            : "Actualizar Tipo de Espacio"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Completa el formulario para gestionar un tipo de espacio.
          </DialogContentText>
          <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
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
                  name="descripcion"
                  label="Descripción"
                  fullWidth
                  variant="standard"
                  value={selectedRow?.descripcion || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    name="estado"
                    value={selectedRow?.estado || 1}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={0}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">
            {methodName === "Add" ? "Agregar" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
