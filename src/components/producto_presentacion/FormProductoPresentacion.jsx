import * as React from "react";
import axios from '../axiosConfig';
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
import { SiteProps } from '../dashboard/SiteProps';

export default function FormProductoPresentacion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  // Crear un nuevo registro de Producto Presentación
  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      producto: 0,
      unidad: 0,
      cantidad: 0,
      marca: 0,
      presentacion: 0,
      descripcion: "",
      estado: 0,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  // Actualizar un registro existente de Producto Presentación
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

  // Eliminar un registro de Producto Presentación
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
    const url = `${SiteProps.urlbasev1}/producto-presentacion/${id}`;
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
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto Presentación eliminado con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar Producto Presentación: ${errorMessage}`,
        });
      });
  };

  // Cerrar el diálogo modal
  const handleClose = () => {
    setOpen(false);
  };

  // Manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;

    // Asegurarse de incluir el campo "producto" en el JSON a enviar
    if (!formJson.producto) {
      formJson = {
        ...formJson,
        producto: props.selectedRow?.producto || 1, // Ajustar según sea necesario
      };
    }

    console.log("Datos del formulario enviados:", formJson);

    const url = methodName === "Add" ? `${SiteProps.urlbasev1}/producto-presentacion` : `${SiteProps.urlbasev1}/producto-presentacion/${id}`;
    const token = localStorage.getItem("token");

    if (!token) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

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
          text: methodName === "Add" ? "Producto Presentación creado con éxito!" : "Producto Presentación actualizado con éxito!",
        });
        setOpen(false);
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} Producto Presentación: ${errorMessage || 'Error indefinido'}`,
        });
      });
  };

  // Acceder a los productos en la propiedad `data` si existe, de lo contrario usar un array vacío
  const productos = Array.isArray(props.productos?.data) ? props.productos.data : [];

  console.log("Productos en FormProductoPresentacion:", productos); // Log para verificar los productos

  return (
    <React.Fragment>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Producto Presentación</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          
          {/* Producto */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="producto-label">Producto</InputLabel>
            <Select
              labelId="producto-label"
              id="producto"
              name="producto"
              defaultValue={props.selectedRow?.producto || ""}
              fullWidth
            >
              {productos.map((producto) => (
                <MenuItem key={producto.id} value={producto.id}>
                  {producto.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Nombre */}
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

          {/* Unidad */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="unidad-label">Unidad</InputLabel>
            <Select
              labelId="unidad-label"
              id="unidad"
              name="unidad"
              defaultValue={props.selectedRow?.unidad || ""}
              fullWidth
            >
              {(Array.isArray(props.unidades) ? props.unidades : []).map((unidad) => (
                <MenuItem key={unidad.id} value={unidad.id}>
                  {unidad.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cantidad */}
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="cantidad"
              name="cantidad"
              label="Cantidad"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.cantidad || 0}
            />
          </FormControl>

          {/* Marca */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="marca-label">Marca</InputLabel>
            <Select
              labelId="marca-label"
              id="marca"
              name="marca"
              defaultValue={props.selectedRow?.marca || ""}
              fullWidth
            >
              {(Array.isArray(props.marcas) ? props.marcas : []).map((marca) => (
                <MenuItem key={marca.id} value={marca.id}>
                  {marca.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Presentación */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="presentacion-label">Presentación</InputLabel>
            <Select
              labelId="presentacion-label"
              id="presentacion"
              name="presentacion"
              defaultValue={props.selectedRow?.presentacion || ""}
              fullWidth
            >
              {(Array.isArray(props.presentacionesList) ? props.presentacionesList : []).map((presentacion) => (
                <MenuItem key={presentacion.id} value={presentacion.id}>
                  {presentacion.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Descripción */}
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

          {/* Estado */}
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
