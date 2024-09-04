import * as React from "react";
import axios from 'axios'; 
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

export default function FormMunicipio(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      mun_id: 0,
      mun_nombre: "",
      mun_departamento_id: 0,
      mun_codigo: 0,
      mun_acronimo: "",
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  const update = () => {
    if (props.selectedRow.mun_id === 0) {
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
    if (props.selectedRow.mun_id === 0) {
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
      console.log("SB: " + props.selectedRow.mun_id);
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
    const id = props.selectedRow.mun_id;
    console.log("Submitting data:", formJson);

    const validatePayload = (data) => {
      // Validate the payload here if necessary
      if (!data.mun_nombre || !data.mun_departamento_id || !data.mun_codigo || !data.mun_acronimo) {
        console.error("Invalid data:", data);
        props.setMessage({ open: true, severity: "error", text: "Invalid data!" });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;

    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/municipio`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Municipio creado con éxito!" });
          setOpen(false);
          // Reload municipios
          axios.get(`${SiteProps.urlbase}/municipio`)
            .then(response => {
              props.setMunicipios(response.data);
            })
            .catch(error => {
              console.error("Error al buscar municipio!", error);
            });
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al crear municipio! ${errorMessage}` });
          console.error("Error al crear municipio!", error.response || error.message);
        });
    } else if (methodName === "Update") {
      axios.put(`${SiteProps.urlbase}/municipio/${id}`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Municipio actualizado con éxito!" });
          setOpen(false);
          // Reload municipios
          axios.get(`${SiteProps.urlbase}/municipio`)
            .then(response => {
              props.setMunicipios(response.data);
            })
            .catch(error => {
              console.error("Error al buscar municipio!", error);
            });
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al actualizar municipio! ${errorMessage}`});
          console.error("Error al actualizar municipio!", error.response || error.message);
        });
    } else if (methodName === "Delete") {
      axios.delete(`${SiteProps.urlbase}/municipio/${id}`)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Municipio eliminado con éxito!" });
          setOpen(false);
          // Reload municipios
          axios.get(`${SiteProps.urlbase}/municipio`)
            .then(response => {
              props.setMunicipios(response.data);
            })
            .catch(error => {
              console.error("Error al buscar municipio!", error);
            });
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al eliminar municipio! ${errorMessage}` });
          console.error("Error al eliminar municipio!", error.response || error.message);
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
        <DialogTitle>Municipios</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="mun_nombre"
              name="mun_nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.mun_nombre}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="departamento-select-label">Departamento</InputLabel>
            <Select
              labelId="departamento-select-label"
              id="mun_departamento_id"
              name="mun_departamento_id"
              defaultValue={props.selectedRow.mun_departamento_id}
              margin="dense"
            >
              {props.departamentos.map((departamento) => (
                <MenuItem key={departamento.dep_id} value={departamento.dep_id}>
                  {departamento.dep_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="mun_codigo"
              name="mun_codigo"
              label="Codigo"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.mun_codigo}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="mun_acronimo"
              name="mun_acronimo"
              label="Acronimo"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.mun_acronimo}
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

