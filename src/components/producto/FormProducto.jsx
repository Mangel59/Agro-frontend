/**
 * @file FormProducto.jsx
 * @module FormProducto
 * @description Componente de formulario para crear, actualizar y eliminar productos. Utiliza Material UI Dialogs y axios para comunicarse con la API. Incluye validación y manejo de errores mediante mensajes Snackbar.
 * @author Karla
 */

import * as React from "react";
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

/**
 * Componente de formulario para gestionar productos.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Fila seleccionada para editar
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada
 * @param {Function} props.setMessage - Función para mostrar mensajes snackbar
 * @param {Function} props.reloadData - Función para recargar los datos de la tabla
 * @returns {JSX.Element} Formulario de producto
 */
export default function FormProducto(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  /**
   * Prepara el formulario para crear un nuevo producto.
   */
  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      productoCategoriaId: 0,
      descripcion: "",
      estado: 0,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  /**
   * Prepara el formulario para actualizar un producto existente.
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
    setMethodName("Update");
    setOpen(true);
  };

  /**
   * Elimina el producto seleccionado.
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

    const id = props.selectedRow.id;
    const url = `${SiteProps.urlbasev1}/producto/${id}`;
    const token = localStorage.getItem("token");

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto eliminado con éxito",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar producto: ${errorMessage}`,
        });
      });
  };

  /**
   * Cierra el formulario.
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Maneja el envío del formulario para crear o actualizar un producto.
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envío del formulario
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;

    const validatePayload = (data) => {
      if (!data.nombre || !data.descripcion) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Datos inválidos. Revisa el formulario.",
        });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;

    const url = `${SiteProps.urlbasev1}/producto`;
    const token = localStorage.getItem("token");

    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    if (methodName === "Add") {
      axios
        .post(url, formJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Producto creado con éxito",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al crear producto: ${errorMessage}`,
          });
        });
    } else if (methodName === "Update") {
      axios
        .put(`${url}/${id}`, formJson, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Producto actualizado con éxito",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al actualizar producto: ${errorMessage}`,
          });
        });
    }

    handleClose();
  };

  return (
    <React.Fragment>
      <StackButtons
        methods={{ create, update, deleteRow }}
        create={create}
        open={open}
        setOpen={setOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Producto</DialogTitle>
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
              id="productoCategoria"
              name="productoCategoria"
              label="ID de categoría del producto"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.productoCategoria || 0}
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
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || 1}
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
    </React.Fragment>
  );
}
