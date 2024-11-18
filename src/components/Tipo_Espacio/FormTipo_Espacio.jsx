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
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoEspacio({ selectedRow, setSelectedRow, reloadData, setMessage }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const url = `${SiteProps.urlbasev1}/tipo_espacio`;
  const token = localStorage.getItem("token");

  const handleCreate = () => {
    setSelectedRow({ id: null, nombre: "", descripcion: "", estado: 1 });
    setMethodName("Add");
    setOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedRow || !selectedRow.id) {
      setMessage({ open: true, severity: "error", text: "Seleccione un tipo de Espacios para actualizar!" });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const handleDelete = () => {
    if (!selectedRow || selectedRow.id === null) {
      setMessage({ open: true, severity: "error", text: "Seleccione un tipo de Espacios para eliminar!" });
      return;
    }
    axios
      .delete(`${url}/${selectedRow.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Espacios eliminado con éxito!" });
        reloadData();
        setSelectedRow(null);
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        setMessage({ open: true, severity: "error", text: `Error al eliminar tipo Espacios! ${errorMessage}` });
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      nombre: selectedRow.nombre,
      descripcion: selectedRow.descripcion,
      estado: selectedRow.estado,
    };

    try {
      if (methodName === "Add") {
        await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
        setMessage({ open: true, severity: "success", text: "Tipo de Espacios creado con éxito!" });
      } else if (methodName === "Update") {
        await axios.put(`${url}/${selectedRow.id}`, data, { headers: { Authorization: `Bearer ${token}` } });
        setMessage({ open: true, severity: "success", text: "Tipo de Espacios actualizado con éxito!" });
      }
      setOpen(false);
      reloadData();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setMessage({ open: true, severity: "error", text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} tipo Espacios! ${errorMessage}` });
    }
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
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName === "Add" ? "Crear Tipo de Espacios" : "Editar Tipo de Espacios"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Completa la información del Tipo de Espacios.</DialogContentText>
            <TextField label="Nombre" name="nombre" fullWidth variant="outlined" margin="normal" value={selectedRow?.nombre || ""} onChange={handleInputChange} required />
            <TextField label="Descripción" name="descripcion" fullWidth variant="outlined" margin="normal" value={selectedRow?.descripcion || ""} onChange={handleInputChange} required />
            <TextField label="Estado" name="estado" type="number" fullWidth variant="outlined" margin="normal" value={selectedRow?.estado || 1} onChange={handleInputChange} required />
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
