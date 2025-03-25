/**
 * @file FormProducto.jsx
 * @module FormProducto
 * @description Componente de formulario para crear, actualizar o eliminar productos. Usa Material UI Dialogs y axios para interactuar con la API. 
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
import PropTypes from "prop-types";

/**
 * Componente FormProducto.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Fila seleccionada (producto a editar)
 * @param {Function} props.setSelectedRow - Función para establecer el producto seleccionado
 * @param {Function} props.setMessage - Función para mostrar mensajes en snackbar
 * @param {Function} props.reloadData - Función para recargar datos desde la API
 * @returns {JSX.Element} Formulario de gestión de productos
 */
export default function FormProducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    setSelectedRow({
      id: 0,
      nombre: "",
      productoCategoriaId: 0,
      descripcion: "",
      estado: 0,
    });
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
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
    if (selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .delete(`${SiteProps.urlbasev1}/producto/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Producto eliminado con éxito",
        });
        reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar producto: ${errorMessage}`,
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
    const id = selectedRow?.id || 0;

    if (!formJson.nombre || !formJson.descripcion) {
      setMessage({
        open: true,
        severity: "error",
        text: "Datos inválidos. Revisa el formulario.",
      });
      return;
    }

    const url = `${SiteProps.urlbasev1}/producto`;
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${id}`;

    method(endpoint, formJson, {
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
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={selectedRow?.nombre || ""}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="productoCategoriaId"
              name="productoCategoriaId"
              label="ID de categoría del producto"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={selectedRow?.productoCategoriaId || 0}
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
              defaultValue={selectedRow?.descripcion || ""}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={selectedRow?.estado || 1}
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

// PropTypes para validación
FormProducto.propTypes = {
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    productoCategoriaId: PropTypes.number,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
