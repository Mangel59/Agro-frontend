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

export default function FormProduccion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      pro_id: 0,
      pro_nombre: "",
      pro_tipo_produccion_id: 0,
      pro_descripcion: "",
      pro_estado: 0,
      pro_fecha_inicio: new Date(),
      pro_fecha_final: new Date(),
      pro_espacio_id: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  const update = () => {
    if (props.selectedRow.pro_id === 0) {
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
    if (props.selectedRow.pro_id === 0) {
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
      console.log("SB: " + props.selectedRow.pro_id);
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
    const id = props.selectedRow.pro_id;
    console.log("Submitting data:", formJson);

    const validatePayload = (data) => {
      // Validate the payload here if necessary
      if (!data.pro_nombre || !data.pro_tipo_produccion_id || !data.pro_descripcion || !data.pro_estado || !data.pro_fecha_inicio || !data.pro_fecha_final || !data.pro_espacio_id) {
        console.error("Invalid data:", data);
        props.setMessage({ open: true, severity: "error", text: "Invalid data!" });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;

    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/produccion`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producción creada con éxito!" });
          setOpen(false);
          // Reload produccion
          axios.get(`${SiteProps.urlbase}/produccion`)
            .then(response => {
              props.setProduccion(response.data);
            })
            .catch(error => {
              console.error("Error al buscar produccion!", error);
            });
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al crear producción! ${errorMessage}` });
          console.error("Error al crear producción!", error.response || error.message);
        });
    } else if (methodName === "Update") {
      axios.put(`${SiteProps.urlbase}/produccion/${id}`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producción actualizada con éxito!" });
          setOpen(false);
          // Reload produccion
          axios.get(`${SiteProps.urlbase}/produccion`)
            .then(response => {
              props.setProduccion(response.data);
            })
            .catch(error => {
              console.error("Error al buscar produccion!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al actualizar producción!" });
          console.error("Error al actualizar producción!", error.response || error.message);
        });
    } else if (methodName === "Delete") {
      axios.delete(`${SiteProps.urlbase}/produccion/${id}`)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producción eliminada con éxito!" });
          setOpen(false);
          // Reload produccion
          axios.get(`${SiteProps.urlbase}/produccion`)
            .then(response => {
              props.setProduccion(response.data);
            })
            .catch(error => {
              console.error("Error al buscar produccion!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al eliminar producción!" });
          console.error("Error al eliminar producción!", error.response || error.message);
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
            <InputLabel id="tipo-produccion-select-label">Tipo Producción</InputLabel>
            <Select
              labelId="tipo-produccion-select-label"
              id="pro_tipo_produccion_id"
              name="pro_tipo_produccion_id"
              defaultValue={props.selectedRow.pro_tipo_produccion_id}
              margin="dense"
            >
              {props.tipoProduccion.map((tipo) => (
                <MenuItem key={tipo.tip_id} value={tipo.tip_id}>
                  {tipo.tip_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              id="pro_estado"
              name="pro_estado"
              defaultValue={props.selectedRow.pro_estado}
              margin="dense"
            >
              {props.estado.map((estado) => (
                <MenuItem key={estado.est_id} value={estado.est_id}>
                  {estado.est_nombre}
                </MenuItem>
              ))}
            </Select>
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

          <FormControl fullWidth>
            <InputLabel id="espacio-select-label">Espacio</InputLabel>
            <Select
              labelId="espacio-select-label"
              id="pro_espacio_id"
              name="pro_espacio_id"
              defaultValue={props.selectedRow.pro_espacio_id}
              margin="dense"
            >
              {props.espacio.map((esp) => (
                <MenuItem key={esp.esp_id} value={esp.esp_id}>
                  {esp.esp_nombre}
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