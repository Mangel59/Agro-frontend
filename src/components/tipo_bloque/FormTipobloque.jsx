import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import StackButtons from "../StackButtons";
import MessageSnackBar from "../MessageSnackBar";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente de formulario para crear, actualizar y eliminar tipo_bloque
 */
export default function FormTipoBloque({ selectedRow, setSelectedRow, addTipoBloque, updateTipoBloque, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [message, setMessage] = React.useState({ open: false, severity: "info", text: "" });

  const url = `${SiteProps.urlbasev1}/tipo_bloque`;
  const token = localStorage.getItem("token"); // Obtén el token de localStorage

  const handleCreate = () => {
    setSelectedRow({ id: null, nombre: "", descripcion: "", estado: 1 });
    setMethodName("Add");
    setOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({ open: true, severity: "error", text: "Seleccione un tipo de bloque para actualizar!" });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const handleDelete = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({ open: true, severity: "error", text: "Seleccione un tipo de bloque para eliminar!" });
      return;
    }
    axios
      .delete(`${url}/${selectedRow.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token de autorización aquí
        },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Bloque eliminado con éxito!" });
        reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        setMessage({ open: true, severity: "error", text: `Error al eliminar tipo_bloque! ${errorMessage}` });
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (methodName === "Add") {
      addTipoBloque(selectedRow);
    } else if (methodName === "Update") {
      updateTipoBloque(selectedRow);
    }
    setOpen(false);
    reloadData();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const methods = {
    create: handleCreate,
    update: handleUpdate,
    deleteRow: handleDelete,
  };

  return (
    <React.Fragment>
      <StackButtons methods={methods} />
      <MessageSnackBar message={message} setMessage={setMessage} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName === "Add" ? "Crear Tipo de Bloque" : "Editar Tipo de Bloque"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Completa la información del Tipo de Bloque.</DialogContentText>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedRow?.nombre || ""}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedRow?.descripcion || ""}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Estado"
              name="estado"
              type="number"
              fullWidth
              variant="outlined"
              margin="normal"
              value={selectedRow?.estado || 1}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" color="primary" variant="contained">
              {methodName === "Add" ? "Guardar" : "Actualizar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
