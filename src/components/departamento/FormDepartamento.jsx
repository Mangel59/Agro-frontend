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

/**
 * Componente FormDepartamento que gestiona la creación, actualización y eliminación de departamentos.
 * 
 * @param {Object} props - Props del componente.
 * @param {Function} props.setMessage - Función para establecer el mensaje de notificación.
 * @param {Object} props.selectedRow - Fila seleccionada en la tabla de departamentos.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {Array} props.pais - Lista de países para seleccionar en el formulario.
 * @param {Function} props.setDepartamentos - Función para actualizar la lista de departamentos.
 * @returns {JSX.Element} Componente que contiene el formulario para gestionar departamentos.
 */
export default function FormDepartamento(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  // Función para crear un nuevo departamento
  const create = () => {
    const row = {
      dep_id: 0,
      dep_nombre: "",
      dep_pais_id: 0,
      dep_codigo: 0,
      dep_acronimo: "",
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + props.selectedRow);
  };

  // Función para actualizar un departamento existente
  const update = () => {
    if (props.selectedRow.id === 0) {
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
    console.log("update() " + props.selectedRow);
  };

  // Función para eliminar un departamento
  const deleteRow = () => {
    if (props.selectedRow.id === 0) {
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
    console.log("delete() " + props.selectedRow);
  };

  // Métodos disponibles para el formulario
  const methods = {
    create,
    update,
    deleteRow,
  };

  React.useEffect(() => {
    if (props.selectedRow != undefined) {
      console.log("SB: " + props.selectedRow.id);
    }
  }, [props.selectedRow]);

  // Función para abrir el diálogo
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Función para cerrar el diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow.id;
    console.log("Submitting data:", formJson);

    // Lógica para agregar un nuevo departamento
    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/departamento`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Departamento creado con éxito!" });
          setOpen(false);
          // Recargar departamentos
          axios.get(`${SiteProps.urlbase}/departamento`)
            .then(response => {
              props.setDepartamentos(response.data);
            })
            .catch(error => {
              console.error("Error al buscar departamento!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al crear departamento!" });
          console.error("Error al crear departamento!", error.response || error.message);
        });
    } 
    // Lógica para actualizar un departamento existente
    else if (methodName === "Update") {
      axios.put(`${SiteProps.urlbase}/departamento/${id}`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Departamento actualizado con éxito!" });
          setOpen(false);
          // Recargar departamentos
          axios.get(`${SiteProps.urlbase}/departamento`)
            .then(response => {
              props.setDepartamentos(response.data);
            })
            .catch(error => {
              console.error("Error al buscar departamento!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al actualizar departamento!" });
          console.error("Error al actualizar departamento!", error.response || error.message);
        });
    } 
    // Lógica para eliminar un departamento
    else if (methodName === "Delete") {
      axios.delete(`${SiteProps.urlbase}/departamento/${id}`)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Departamento eliminado con éxito!" });
          setOpen(false);
          // Recargar departamentos
          axios.get(`${SiteProps.urlbase}/departamento`)
            .then(response => {
              props.setDepartamentos(response.data);
            })
            .catch(error => {
              console.error("Error al buscar departamento!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al eliminar departamento!" });
          console.error("Error al eliminar departamento!", error.response || error.message);
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
        <DialogTitle>Departamentos</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.nombre}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="pais-select-label">Pais</InputLabel>
            <Select
              labelId="pais-select-label"
              id="pais"
              name="pais"
              defaultValue={props.selectedRow.pais}
              margin="dense"
            >
              {props.pais.map((pais) => (
                <MenuItem key={pais.id} value={pais.id}>
                  {pais.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="codigo"
              name="codigo"
              label="Código"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.codigo}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="acronimo"
              name="acronimo"
              label="Acrónimo"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.acronimo}
            />
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