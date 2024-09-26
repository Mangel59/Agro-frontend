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
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 0,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };
  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      const messageData = {
        open: true,
        severity: "error",
        text: "Select row!",
      };
      props.setMessage(messageData);
      return;
    }
    setMethodName("Update");
    setOpen(true);
    console.log("update() " + JSON.stringify(props.selectedRow));
  };
  const deleteRow = () => {
    if (props.selectedRow.id === 0) {
      const messageData = {
        open: true,
        severity: "error",
        text: "Select row!",
      };
      props.setMessage(messageData);
      return;
    }
    const id = props.selectedRow.id;
    const url = `${SiteProps.urlbasev1}/productoCategoria/${id}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Producto categoría eliminada con éxito!",
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
          text: `Error al eliminar producto categoría! ${errorMessage}`,
        });
        console.error(
          "Error al eliminar producto categoría!",
          error.response || error.message
        );
      });
  };
  const methods = {
    create,
    update,
    deleteRow,
  };
  React.useEffect(() => {
    if (props.selectedRow !== undefined) {
      console.log("Selected Row ID: " + props.selectedRow.id);
    }
  }, [props.selectedRow]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;
    const validatePayload = (data) => {
      if (
        !data.nombre ||
        !data.descripcion ||
        !data.estado
      ) {
        console.error("Invalid data:", data);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Invalid data!",
        });
        return false;
      }
      return true;
    };
    if (!validatePayload(formJson)) return;
    const url = `${SiteProps.urlbasev1}/productoCategorias`;
    if (methodName === "Add") {
      axios
        .post(url, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "producto categoría creada con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al crear producto categoría! ${errorMessage}`,
          });
        });
    } else if (methodName === "Update") {
      axios
        .put(`${url}/${id}`, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Producto categoría actualizada con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al actualizar producto categoría! ${errorMessage}`,
          });
          console.error(
            "Error al actualizar producto categoría!",
            error.response || error.message
          );
        });
    } else if (methodName === "Delete") {
      axios
        .delete(`${url}/${id}`)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Producto categoría eliminada con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al eliminar producto categoría! ${errorMessage}`,
          });
          console.error(
            "Error al eliminar producto categoría!",
            error.response || error.message
          );
        });
    }
    handleClose();
  };

  //hacer el post de la producto categoría
  return (
    <React.Fragment>
      <StackButtons
        methods={methods}
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
            <InputLabel id="estado-label"
              sx={{
                backgroundColor: 'white', 
                padding: '0 8px',      
              }}
            >Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || ''}
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
