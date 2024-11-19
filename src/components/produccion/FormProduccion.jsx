import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import StackButtons from "../StackButtons";
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function FormProduccion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      pro_id: 0,
      pro_nombre: "",
      pro_descripcion: "",
      pro_estado: 0,
      pro_fecha_inicio: new Date(),
      pro_fecha_final: new Date()
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (props.selectedRow.pro_id === 0) {
      props.setMessage({ open: true, severity: "error", text: "Select row!" });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (props.selectedRow.pro_id === 0) {
      props.setMessage({ open: true, severity: "error", text: "Select row!" });
      return;
    }
    setMethodName("Delete");
    setOpen(true);
  };

  const methods = { create, update, deleteRow };

  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow.pro_id;

    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/producciones`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producción creada con éxito!" });
          setOpen(false);
          props.reloadData();
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al crear producción! ${errorMessage}` });
        });
    } else if (methodName === "Update") {
      axios.put(`${SiteProps.urlbase}/producciones/${id}`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producción actualizada con éxito!" });
          setOpen(false);
          props.reloadData();
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al actualizar producción!" });
        });
    } else if (methodName === "Delete") {
      axios.delete(`${SiteProps.urlbase}/producciones/${id}`)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producción eliminada con éxito!" });
          setOpen(false);
          props.reloadData();
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al eliminar producción!" });
        });
    }

    handleClose();
  };

  return (
    <React.Fragment>
      <StackButtons methods={methods} create={create} open={open} setOpen={setOpen} handleClickOpen={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ component: "form", onSubmit: handleSubmit }}
      >
        <DialogTitle>Producción</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="pro_nombre"
              name="pro_nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.pro_nombre}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="pro_descripcion"
              name="pro_descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.pro_descripcion}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="pro_fecha_inicio"
              name="pro_fecha_inicio"
              label="Fecha Inicio"
              type="datetime-local"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.pro_fecha_inicio.toISOString().substring(0, 16)}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="pro_fecha_final"
              name="pro_fecha_final"
              label="Fecha Final"
              type="datetime-local"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.pro_fecha_final.toISOString().substring(0, 16)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
