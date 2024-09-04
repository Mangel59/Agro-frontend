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

export default function FormPais(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      codigo: 0,
      acronimo: "",
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + props.selectedRow);
  };

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

  const deleteRow = () => {
    setMethodName("Delete");
    setOpen(true);
    console.log("delete() " + props.selectedRow);
  };

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
    const id = props.selectedRow.id;
    console.log("Submitting data:", formJson);

    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/pais`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Pais creado con éxito!" });
          setOpen(false);
          // recargar paises
          axios.get(`${SiteProps.urlbase}/pais`)
            .then(response => {
              props.setMunicipios(response.data);
            })
            .catch(error => {
              console.error("Error al buscar municipio!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al crear municipio!" });
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
          props.setMessage({ open: true, severity: "error", text: "Error al actualizar municipio!" });
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
          props.setMessage({ open: true, severity: "error", text: "Error al eliminar municipio!" });
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
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const id = props.selectedRow.id;
            console.log(id, formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Pais</DialogTitle>
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
            <TextField
              autoFocus
              required
              id="codigo"
              name="codigo"
              label="Codigo"
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
              label="Acronimo"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.acronimo}
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