import * as React from "react";
import axios from "axios";
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

export default function FormEmpresa(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/empresas`)
      .then((response) => {
        setEmpresas(response.data);  // Recargar los datos de empresas
      })
      .catch((error) => {
        console.error("Error al recargar los datos!", error);
      });
  };

  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 0,
      celular: "",
      correo: "",
      contacto: "",
      tipoIdentificacionId: 0,
      personaId: 0,
      identificacion: "",
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
    const url = `${SiteProps.urlbasev1}/empresas/${id}`;
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
          text: "Empresa eliminada con éxito!",
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
          text: `Error al eliminar empresa! ${errorMessage}`,
        });
        console.error(
          "Error al eliminar empresa!",
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
        !data.estado ||
        !data.celular ||
        !data.correo ||
        !data.identificacion
      ) {
        console.error("Invalid data:", data);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Por favor completa todos los campos obligatorios!",
        });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;
    const url = `${SiteProps.urlbasev1}/empresas`;
    if (methodName === "Add") {
      axios
        .post(url, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Empresa creada con éxito!",
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
            text: `Error al crear empresa! ${errorMessage}`,
          });
        });
    } else if (methodName === "Update") {
      axios
        .put(`${url}/${id}`, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Empresa actualizada con éxito!",
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
            text: `Error al actualizar empresa! ${errorMessage}`,
          });
          console.error(
            "Error al actualizar empresa!",
            error.response || error.message
          );
        });
    }
    else if (methodName === "Delete") {
      axios
        .delete(`${url}/${id}`)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Persona eliminada con éxito!",
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
            text: `Error al eliminar persona! ${errorMessage}`,
          });
          console.error(
            "Error al eliminar persona!",
            error.response || error.message
          );
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
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>{methodName} Empresa</DialogTitle>
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
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || 0}
              fullWidth
            >
              <MenuItem value={0}>Inactivo</MenuItem>
              <MenuItem value={1}>Activo</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="celular"
              name="celular"
              label="Celular"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.celular || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="correo"
              name="correo"
              label="Correo"
              type="email"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.correo || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="contacto"
              name="contacto"
              label="Contacto"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.contacto || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="identificacion"
              name="identificacion"
              label="Identificación"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.identificacion || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="personaId"
              name="personaId"
              label="ID Persona"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.personaId || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipoIdentificacionId-label">
              Tipo de Identificación
            </InputLabel>
            <Select
              labelId="tipoIdentificacionId-label"
              id="tipoIdentificacionId"
              name="tipoIdentificacionId"
              defaultValue={props.selectedRow?.tipoIdentificacionId || 0}
              fullWidth
            >
              <MenuItem value={1}>Cédula</MenuItem>
              <MenuItem value={2}>Pasaporte</MenuItem>
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
