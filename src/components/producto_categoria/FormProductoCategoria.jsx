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

export default function FormProductoCategoria(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const selectedRow = props.selectedRow || {};

  // Método para manejar la creación
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

  // Método para manejar la actualización
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

  // Método para manejar la eliminación
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

  // Método para manejar el cierre del diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Método para manejar el envío del formulario
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
          text: methodName === "Add" ? "Producto categoría creada con éxito." : "Producto categoría actualizada con éxito.",
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Categoría" : "Actualizar Categoría"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Nombre"
              value={selectedRow.nombre || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, nombre: e.target.value })}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Descripción"
              value={selectedRow.descripcion || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, descripcion: e.target.value })}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedRow.estado || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, estado: e.target.value })}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
