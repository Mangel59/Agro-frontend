/**
 * @file FormUnidad.jsx
 * @module FormUnidad
 * @description Componente principal del formulario de unidades. Maneja la creación, edición y eliminación de unidades. El campo empresa no se muestra, ya que se asigna automáticamente según el usuario autenticado (empresa guardada en localStorage).
 * @author Maria
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";
import PropTypes from "prop-types";

/**
 * Formulario que permite crear, editar y eliminar unidades.
 * Utiliza `StackButtons` para gestionar acciones.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.setMessage - Función para establecer el estado del mensaje snackbar.
 * @param {Object} props.selectedRow - Fila seleccionada de la grilla.
 * @param {number} props.selectedRow.id - ID de la unidad.
 * @param {string} props.selectedRow.nombre - Nombre de la unidad.
 * @param {string} props.selectedRow.descripcion - Descripción de la unidad.
 * @param {number} props.selectedRow.estado - Estado de la unidad (1 = activo, 0 = inactivo).
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {Function} props.reloadData - Función para recargar los datos de la grilla.
 * @returns {JSX.Element}
 */
export default function FormUnidad(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  /**
   * Inicializa el formulario para crear una unidad.
   */
  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 1,
    };
    props.setSelectedRow(row);
    setMethodName("AGREGAR");
    setOpen(true);
  };

  /**
   * Inicializa el formulario para actualizar una unidad.
   */
  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar",
      });
      return;
    }
    setMethodName("ACTUALIZAR");
    setOpen(true);
  };

  /**
   * Elimina la unidad seleccionada.
   */
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
      .delete(`${SiteProps.urlbasev1}/unidad/${props.selectedRow.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Unidad eliminada con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar Unidad: ${errorMessage}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  /**
   * Envía el formulario al backend.
   * Agrega automáticamente la empresa desde localStorage.
   * @param {React.FormEvent} event - Evento del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = {
      ...Object.fromEntries(formData.entries()),
      empresa: localStorage.getItem("empresa_id"), // Empresa asignada automáticamente
    };

    const id = props.selectedRow?.id || 0;

    if (!formJson.nombre || !formJson.descripcion) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Datos inválidos. Revisa el formulario.",
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

    const url =
      methodName === "Add"
        ? `${SiteProps.urlbasev1}/unidad`
        : `${SiteProps.urlbasev1}/unidad/${id}`;
    const axiosMethod = methodName === "Add" ? axios.post : axios.put;

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
          text: methodName === "Add"
            ? "Unidad creada con éxito!"
            : "Unidad actualizada con éxito!",
        });
        setOpen(false);
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} Unidad: ${errorMessage}`,
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Unidad</DialogTitle>
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
            <InputLabel
              id="estado-label"
              sx={{ backgroundColor: "white", padding: "0 8px" }}
            >
              Estado
            </InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || ""}
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

FormUnidad.propTypes = {
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
