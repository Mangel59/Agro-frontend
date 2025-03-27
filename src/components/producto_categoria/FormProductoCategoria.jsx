/**
 * @file FormProductoCategoria.jsx
 * @module FormProductoCategoria
 * @description Componente de formulario para agregar, editar y eliminar categorías de productos. Incluye un diálogo modal y botones de acción. Utiliza Material UI y Axios para las operaciones CRUD y el estado del formulario.
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
 * Formulario para gestión de categorías de productos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Objeto con los datos de la fila seleccionada
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @param {Function} props.setMessage - Función para mostrar mensajes con Snackbar
 * @param {Function} props.reloadData - Función para recargar los datos desde el backend
 * @returns {JSX.Element} Componente del formulario
 */
export default function FormProductoCategoria(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const selectedRow = props.selectedRow || {};

  /**
   * Maneja la acción de crear una nueva categoría.
   */
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

  /**
   * Maneja la acción de actualizar una categoría existente.
   */
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

  /**
   * Maneja la eliminación de una categoría.
   */
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

  /**
   * Cierra el diálogo del formulario.
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Envía el formulario para crear o actualizar una categoría.
   */
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
          text:
            methodName === "Add"
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
          Agregar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginRight: "10px" }}
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

      {/* Diálogo del formulario */}
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
                props.setSelectedRow({
                  ...selectedRow,
                  nombre: e.target.value,
                })
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
                props.setSelectedRow({
                  ...selectedRow,
                  estado: e.target.value,
                })
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
