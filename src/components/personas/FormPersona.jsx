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

/**
 * El componente FormPersona gestiona el formulario para crear, actualizar y eliminar personas.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {object} props.selectedRow - Datos de la persona seleccionada.
 * @param {function} props.reloadData - Función para recargar los datos después de una operación.
 * @param {function} props.setMessage - Función para establecer un mensaje en el snackbar.
 * @returns {JSX.Element} El formulario de gestión de personas.
 */
export default function FormPersona(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  
  /**
   * Crea una nueva persona y abre el diálogo de formulario.
   */
  const create = () => {
    const row = {
      id: 0,
      tipoIdentificacionId: "",
      identificacion: "",
      apellido: "",
      nombre: "",
      genero: "",
      fechaNacimiento: "",
      estrato: 0,
      direccion: "",
      celular: "",
      estado: 0,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  /**
   * Actualiza la persona seleccionada y abre el diálogo de formulario.
   */
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

  /**
   * Elimina la persona seleccionada.
   */
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
    const url = `${SiteProps.urlbase}/personas/${id}`;
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
          text: "Persona eliminada con éxito!",
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
          text: `Error al eliminar persona! ${errorMessage}`,
        });
        console.error(
          "Error al eliminar persona!",
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

   /**
   * Maneja el envío del formulario para crear o actualizar una persona.
   * 
   * @param {Event} event - El evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;
    const validatePayload = (data) => {
      if (
        !data.nombre ||
        !data.tipoIdentificacionId ||
        !data.identificacion ||
        !data.direccion
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
    const url = `${SiteProps.urlbasev1}/personas`;
    if (methodName === "Add") {
      axios
        .post(url, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Persona creada con éxito!",
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
            text: `Error al crear persona! ${errorMessage}`,
          });
        });
    } else if (methodName === "Update") {
      axios
        .put(`${url}/${id}`, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "Persona actualizada con éxito!",
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
            text: `Error al actualizar persona! ${errorMessage}`,
          });
          console.error(
            "Error al actualizar persona!",
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

  //hacer el post de la persona
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
        <DialogTitle>Persona</DialogTitle>
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
              id="apellido"
              name="apellido"
              label="Apellido"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.apellido || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipoIdentificacionId-label"
            sx={{
              backgroundColor: 'white', 
              padding: '0 8px',      
            }}
            >
              Tipo de Identificación
            </InputLabel>
            <Select
              labelId="tipoIdentificacionId-label"
              id="tipoIdentificacionId"
              name="tipoIdentificacionId"
              defaultValue={props.selectedRow?.tipoIdentificacionId || ""}
              fullWidth
            >
              <MenuItem value={1}>Cédula</MenuItem>
              <MenuItem value={2}>Pasaporte</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="identificacion"
              name="identificacion"
              label="Número de Identificación"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.identificacion || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="genero-label"
              sx={{
                backgroundColor: 'white', 
                padding: '0 8px',      
              }}
            >Género</InputLabel>
            <Select
              labelId="genero-label"
              id="genero"
              name="genero"
              defaultValue={props.selectedRow?.genero ? "f" : "m"}
              fullWidth
            >
              <MenuItem value="m">Maculino</MenuItem>
              <MenuItem value="f">Femenino</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="fechaNacimiento"
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.fechaNacimiento || ""}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="estrato"
              name="estrato"
              label="Estrato"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.estrato || 0}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="direccion"
              name="direccion"
              label="Dirección"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.direccion || ""}
            />
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
