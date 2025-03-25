/**
 * @file FormTipoProduccion.jsx
 * @module FormTipoProduccion
 * @description Componente para crear, editar o eliminar Tipos de Producción.
 * @author Karla
 */

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

/**
 * Componente FormTipoProduccion.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {function} props.setSelectedRow - Establece la fila seleccionada.
 * @param {TipoProduccionRow} props.selectedRow - Fila actualmente seleccionada.
 * @param {function} props.setMessage - Muestra un mensaje de estado.
 * @param {function} props.reloadData - Recarga los datos del backend.
 * @returns {JSX.Element} Componente de formulario para Tipo de Producción.
 */
export default function FormTipoProduccion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = { id: 0, nombre: "", descripcion: "", estado: 0 };
    props.setSelectedRow(row);
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;

    if (!formJson.nombre || !formJson.descripcion) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Datos inválidos. Revisa el formulario.",
      });
      return;
    }

    const url =
      methodName === "Add"
        ? `${SiteProps.urlbasev1}/tipo_produccion`
        : `${SiteProps.urlbasev1}/tipo_produccion/${id}`;
    const axiosMethod = methodName === "Add" ? axios.post : axios.put;

    const token = localStorage.getItem("token");
    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    axiosMethod(url, formJson, {
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
            methodName === "Add"
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
            methodName === "Add" ? "crear" : "actualizar"
          } Tipo de Producción: ${msg}`,
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ component: "form", onSubmit: handleSubmit }}
      >
        <DialogTitle>Tipo de Producción</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth margin="normal">
            <TextField
              autoFocus
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.nombre || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.descripcion || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label" sx={{ backgroundColor: "white", padding: "0 8px" }}>
              Estado
            </InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado ?? 1}
              fullWidth
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
