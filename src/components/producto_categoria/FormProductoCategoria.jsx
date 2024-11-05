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

export default function FormProductoCategoria(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = { id: 0, nombre: "", descripcion: "", estado: 0 };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      props.setMessage({ open: true, severity: "error", text: "Select row!" });
      return;
    }
    setMethodName("Update");
    setOpen(true);
    console.log("update() " + JSON.stringify(props.selectedRow));
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token almacenado:", token);
  }, []);

  const deleteRow = () => {
    const token = localStorage.getItem("token");
    console.log("Token usado para la eliminación:", token);

    if (!token) {
      props.setMessage({ open: true, severity: "error", text: "Token no disponible. Inicie sesión nuevamente." });
      return;
    }

    if (!props.selectedRow || props.selectedRow.id === 0) {
      props.setMessage({ open: true, severity: "error", text: "Select row!" });
      return;
    }

    const id = props.selectedRow.id;
    const url = `/api/v1/productoCategorias/${id}`;

    axios
      .delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        props.setMessage({ open: true, severity: "success", text: "Producto categoría eliminada con éxito!" });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message || error.response.statusText : error.message;
        props.setMessage({ open: true, severity: "error", text: `Error al eliminar producto categoría! ${errorMessage}` });
        console.error("Detalles completos del error:", error);
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    if (!formJson.nombre || !formJson.descripcion || formJson.estado === undefined) {
      props.setMessage({ open: true, severity: "error", text: "Invalid data!" });
      return;
    }

    const url = `${SiteProps.urlbasev1}/productoCategorias`;
    const id = props.selectedRow?.id || 0;

    const request = methodName === "Add"
      ? axios.post(url, formJson)
      : axios.put(`${url}/${id}`, formJson);

    request
      .then((response) => {
        const successMessage = methodName === "Add"
          ? "Producto categoría creada con éxito!"
          : "Producto categoría actualizada con éxito!";
        props.setMessage({ open: true, severity: "success", text: successMessage });
        setOpen(false);
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : error.message;
        props.setMessage({ open: true, severity: "error", text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} producto categoría! ${errorMessage}` });
      });
  };

  return (
    <React.Fragment>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>{methodName} Producto Categoría</DialogTitle>
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
            <InputLabel id="estado-label" sx={{ backgroundColor: 'white', padding: '0 8px' }}>Estado</InputLabel>
            <Select labelId="estado-label" id="estado" name="estado" defaultValue={props.selectedRow?.estado || ''} fullWidth>
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
