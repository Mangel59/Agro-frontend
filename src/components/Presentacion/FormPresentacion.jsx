
/**
 * FormPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
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

/**
 * Componente FormPresentacion.
 * @module FormPresentacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FormPresentacion({ setSelectedRow, selectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  // Crear un nuevo producto
  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 0,
    };
    setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  // Actualizar un producto existente
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

  // Eliminar un producto
  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }
    const id = selectedRow.id;
    const url = `${SiteProps.urlbasev1}/presentaciones/${id}`;
    const token = localStorage.getItem("token");

    axios
      .delete(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Presentación eliminada con éxito" });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar presentación: ${error.response?.data?.message || error.message}`,
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
    const id = selectedRow?.id || 0;

    if (!formJson.nombre || !formJson.descripcion) {
      setMessage({
        open: true,
        severity: "error",
        text: "Datos inválidos. Revisa el formulario.",
      });
      return;
    }

    const url = `${SiteProps.urlbasev1}/presentaciones`;
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    const request = methodName === "Add" ? axios.post(url, formJson) : axios.put(`${url}/${id}`, formJson);

    request
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Presentación creada con éxito" : "Presentación actualizada con éxito",
        });
        setOpen(false);
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} presentación: ${error.response?.data?.message || error.message}`,
        });
      });

    handleClose();
  };

  return (
    <React.Fragment>
      <StackButtons methods={{ create, update, deleteRow }} create={create} open={open} setOpen={setOpen} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>Presentación</DialogTitle>
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
              defaultValue={selectedRow?.nombre || ""}
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
            <Select labelId="estado-label" id="estado" name="estado" defaultValue={selectedRow?.estado || 1} fullWidth>
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

// **Validación de PropTypes**
FormPresentacion.propTypes = {
  setSelectedRow: PropTypes.func.isRequired, // Debe ser una función
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }),
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
