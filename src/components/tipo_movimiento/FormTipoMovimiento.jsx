import * as React from "react";
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

export default function FormTipoMovimiento(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 0,
      empresa: "",
    };
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
    const id = props.selectedRow.id;
    const url = `${SiteProps.urlbasev1}/tipo_movimiento/${id}`;
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
          text: "Tipo de Movimiento eliminado con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar Tipo de Movimiento: ${errorMessage}`,
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

    const validatePayload = (data) => {
      if (!data.nombre || !data.descripcion || !data.empresa) {
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

    const url = methodName === "Add" ? `${SiteProps.urlbasev1}/tipo_movimiento` : `${SiteProps.urlbasev1}/tipo_movimiento/${id}`;
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
          text: methodName === "Add" ? "Tipo de Movimiento creado con éxito!" : "Tipo de Movimiento actualizado con éxito!",
        });
        setOpen(false);
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} Tipo de Movimiento: ${errorMessage}`,
        });
      });
  };

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
        <DialogTitle>Tipo de Movimiento</DialogTitle>
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
              sx={{
                backgroundColor: "white",
                padding: "0 8px",
              }}
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
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="empresa"
              name="empresa"
              label="Empresa"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.empresa || ""}
            />
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
