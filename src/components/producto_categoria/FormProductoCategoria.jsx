/**
 * @file FormProductoCategoria.jsx
 * @module FormProductoCategoria
 * @description Componente de formulario para crear, actualizar o eliminar categorías de productos. Utiliza Material UI y Axios para comunicación con la API. Incluye validaciones y mensajes de éxito o error para el usuario.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormProductoCategoria.
 *
 * Permite gestionar (crear, editar, eliminar) categorías de productos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Categoría seleccionada actualmente
 * @param {function(Object): void} props.setSelectedRow - Función para actualizar la categoría seleccionada
 * @param {function(Object): void} props.setMessage - Función para mostrar mensajes (éxito o error)
 * @param {function(): void} props.reloadData - Función para recargar la lista de categorías desde la API
 * @returns {JSX.Element} Formulario de categorías de productos
 */
export default function FormProductoCategoria(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const selectedRow = props.selectedRow || {};

  // Abrir formulario vacío
  const create = () => {
    const emptyRow = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 1,
    };
    props.setSelectedRow(emptyRow);
    setMethodName("Add");
    setOpen(true);
  };

  // Abrir formulario con datos seleccionados
  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para actualizar.",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  // Eliminar la fila seleccionada
  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar.",
      });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/producto_categoria/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto categoría eliminada con éxito.",
        });
        props.reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar producto categoría:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar la categoría. Intente nuevamente.",
        });
      });
  };

  // Cerrar modal
  const handleClose = () => {
    setOpen(false);
  };

  // Guardar (crear o actualizar)
  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id || null,
      nombre: selectedRow.nombre,
      descripcion: selectedRow.descripcion,
      estado: selectedRow.estado,
    };

    const url = `${SiteProps.urlbasev1}/producto_categoria`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add"
            ? "Producto categoría creada con éxito."
            : "Producto categoría actualizada con éxito.",
        });
        props.reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al enviar datos. Intente nuevamente.",
        });
      });
  };

  return (
    <React.Fragment>
      {/* Botones de acción */}
      <Box display="flex" justifyContent="right" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={create}
          style={{ marginRight: "10px" }}
        >
          ADD
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginRight: "10px" }}
        >
          UPDATE
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
        >
          DELETE
        </Button>
      </Box>

      {/* Diálogo para agregar o editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {methodName === "Add" ? "Agregar Categoría" : "Actualizar Categoría"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Nombre"
              value={selectedRow.nombre || ""}
              onChange={(e) =>
                props.setSelectedRow({ ...selectedRow, nombre: e.target.value })
              }
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Descripción"
              value={selectedRow.descripcion || ""}
              onChange={(e) =>
                props.setSelectedRow({
                  ...selectedRow,
                  descripcion: e.target.value,
                })
              }
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedRow.estado || ""}
              onChange={(e) =>
                props.setSelectedRow({ ...selectedRow, estado: e.target.value })
              }
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {methodName === "Add" ? "Agregar" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
