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

export default function FormProducto(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  
  // Crear un nuevo producto
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
  
  // Actualizar un producto existente
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

  // Eliminar un producto
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
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar producto: ${errorMessage}`,
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Enviar el formulario para crear o actualizar un producto
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

    console.log("Datos del formulario: ", formJson);
    console.log("Token: ", token); // Para verificar si el token es válido
    
    if (!token) {
      console.error("Token no encontrado.");
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    // Lógica para crear un producto
    if (methodName === "Add") {
      axios.post(url, formJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto creado con éxito",
        });
        setOpen(false);
        props.reloadData();  // Actualiza la lista después de agregar
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al crear producto: ${errorMessage}`,
        });
      });
    }
    
    // Lógica para actualizar un producto
    else if (methodName === "Update") {
      axios
        .put(`${url}/${id}`, formJson, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Respuesta al actualizar: ", response);
          props.setMessage({
            open: true,
            severity: "success",
            text: "Producto actualizado con éxito",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          console.error("Error al actualizar producto:", error.response || error);
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al actualizar producto: ${errorMessage}`,
          });
        });
    }

    handleClose();
  };

  // Renderizado del formulario de producto
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
              id="productocategoriaid"
              name="productocategoriaid"
              label="ID de categoría del producto"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.productoCategoriaId || 0}
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
