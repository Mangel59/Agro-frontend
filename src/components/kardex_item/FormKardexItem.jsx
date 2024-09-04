import * as React from "react";
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
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function FormKardexItem(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      kai_id: 0,
      kai_kardex_id: 0,
      kai_producto_presentacion_id: 0,
      kai_cantidad: 0,
      kai_precio: 0,
      kai_estado: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  const update = () => {
    if (props.selectedRow.kai_id === 0) {
      console.log("select row");
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
    if (props.selectedRow.kai_id === 0) {
      console.log("select row");
      const messageData = {
        open: true,
        severity: "error",
        text: "Select row!",
      };
      props.setMessage(messageData);
      return;
    }
    setMethodName("Delete");
    setOpen(true);
    console.log("delete() " + JSON.stringify(props.selectedRow));
  };

  const methods = {
    create,
    update,
    deleteRow,
  };

  React.useEffect(() => {
    if (props.selectedRow != undefined) {
      console.log("SB: " + props.selectedRow.kai_id);
    }
  }, [props.selectedRow]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow.kai_id;
    console.log("Submitting data:", formJson);

    const validatePayload = (data) => {
      // Validate the payload here if necessary
      if (!data.kai_kardex_id || !data.kai_producto_presentacion_id || !data.kai_cantidad || !data.kai_precio || !data.kai_estado) {
        console.error("Invalid data:", data);
        props.setMessage({ open: true, severity: "error", text: "Invalid data!" });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;

    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/kardex_item`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Kardex item creado con éxito!" });
          setOpen(false);
          // Reload kardex items
          axios.get(`${SiteProps.urlbase}/kardex_item`)
            .then(response => {
              props.setKardexItems(response.data);
            })
            .catch(error => {
              console.error("Error al buscar kardex items!", error);
            });
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al crear kardex item! ${errorMessage}` });
          console.error("Error al crear kardex item!", error.response || error.message);
        });
    } else if (methodName === "Update") {
      axios.put(`${SiteProps.urlbase}/kardex_item/${id}`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Kardex item actualizado con éxito!" });
          setOpen(false);
          // Reload kardex items
          axios.get(`${SiteProps.urlbase}/kardex_item`)
            .then(response => {
              props.setKardexItems(response.data);
            })
            .catch(error => {
              console.error("Error al buscar kardex items!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al actualizar kardex item!" });
          console.error("Error al actualizar kardex item!", error.response || error.message);
        });
    } else if (methodName === "Delete") {
      axios.delete(`${SiteProps.urlbase}/kardex_item/${id}`)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Kardex item eliminado con éxito!" });
          setOpen(false);
          // Reload kardex items
          axios.get(`${SiteProps.urlbase}/kardex_item`)
            .then(response => {
              props.setKardexItems(response.data);
            })
            .catch(error => {
              console.error("Error al buscar kardex items!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al eliminar kardex item!" });
          console.error("Error al eliminar kardex item!", error.response || error.message);
        });
    }

    handleClose();
  };

  return (
    <React.Fragment>
      <StackButtons
        methods={methods}
        create={create}
        open={open}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Kardex Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="kardex-select-label">Kardex</InputLabel>
            <Select
              labelId="kardex-select-label"
              id="kai_kardex_id"
              name="kai_kardex_id"
              defaultValue={props.selectedRow.kai_kardex_id}
              margin="dense"
            >
              {props.kardex.map((kardex) => (
                <MenuItem key={kardex.kar_id} value={kardex.kar_id}>
                  {kardex.kar_id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="producto-presentacion-select-label">Producto Presentación</InputLabel>
            <Select
              labelId="producto-presentacion-select-label"
              id="kai_producto_presentacion_id"
              name="kai_producto_presentacion_id"
              defaultValue={props.selectedRow.kai_producto_presentacion_id}
              margin="dense"
            >
              {props.productoPresentacion.map((producto) => (
                <MenuItem key={producto.prp_id} value={producto.prp_id}>
                  {producto.prp_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="kai_cantidad"
              name="kai_cantidad"
              label="Cantidad"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.kai_cantidad}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="kai_precio"
              name="kai_precio"
              label="Precio"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.kai_precio}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              id="kai_estado"
              name="kai_estado"
              defaultValue={props.selectedRow.kai_estado}
              margin="dense"
            >
              {props.estado.map((estado) => (
                <MenuItem key={estado.est_id} value={estado.est_id}>
                  {estado.est_nombre}
                </MenuItem>
              ))}
            </Select>
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