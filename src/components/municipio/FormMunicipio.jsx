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

  // const create = () => {
  //   const row = {
  //     id: 0,
  //     name: "",
      
  //   };
  //   props.setSelectedRow(row);
  //   setMethodName("Add");
  //   setOpen(true);
  //   console.log("create() " + JSON.stringify(row));
  // };

  // const update = () => {
  //   if (!props.selectedRow || props.selectedRow.id === 0) {
  //     const messageData = {
  //       open: true,
  //       severity: "error",
  //       text: "Select row!",
  //     };
  //     props.setMessage(messageData);
  //     return;
  //   }
  //   setMethodName("Update");
  //   setOpen(true);
  //   console.log("update() " + JSON.stringify(props.selectedRow));
  // };

  // const deleteRow = () => {
  //   if (props.selectedRow.id === 0) {
  //     const messageData = {
  //       open: true,
  //       severity: "error",
  //       text: "Select row!",
  //     };
  //     props.setMessage(messageData);
  //     return;
  //   }
  //   const id = props.selectedRow.id;
  //   const url = `${SiteProps.urlbasev1}/items/municipio/${id}`;
  //   axios
  //     .delete(url, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((response) => {
  //       props.setMessage({
  //         open: true,
  //         severity: "success",
  //         text: "Municipio eliminada con éxito!",
  //       });
  //       setOpen(false);
  //       props.reloadData();
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.response
  //         ? error.response.data.message
  //         : error.message;
  //       props.setMessage({
  //         open: true,
  //         severity: "error",
  //         text: `Error al eliminar municipio! ${errorMessage}`,
  //       });
  //       console.error(
  //         "Error al eliminar municipio!",
  //         error.response || error.message
  //       );
  //     });
  // };

  // const methods = {
  //   create,
  //   update,
  //   deleteRow,
  // };

  // React.useEffect(() => {
  //   if (props.selectedRow !== undefined) {
  //     console.log("Selected Row ID: " + props.selectedRow.id);
  //   }
  // }, [props.selectedRow]);
  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const formJson = Object.fromEntries(formData.entries());
  //   const id = props.selectedRow?.id || 0;
  //   const validatePayload = (data) => {
  //     if (
  //       !data.name
  //     ) {
  //       console.error("Invalid data:", data);
  //       props.setMessage({
  //         open: true,
  //         severity: "error",
  //         text: "Por favor completa todos los campos obligatorios!",
  //       });
  //       return false;
  //     }
  //     return true;
  //   };

  //   if (!validatePayload(formJson)) return;

  //   if (methodName === "Add") {
  //     axios.post(`${SiteProps.urlbasev1}/items/municipio`, formJson)
  //       .then(response => {
  //         props.setMessage({ open: true, severity: "success", text: "Municipio creado con éxito!" });
  //         setOpen(false);
  //         // Reload municipios
  //         axios.get(`${SiteProps.urlbasev1}/items/municipio`)
  //           .then(response => {
  //             props.setMunicipios(response.data);
  //           })
  //           .catch(error => {
  //             console.error("Error al buscar municipio!", error);
  //           });
  //       })
  //       .catch(error => {
  //         const errorMessage = error.response ? error.response.data.message : error.message;
  //         props.setMessage({ open: true, severity: "error", text: `Error al crear municipio! ${errorMessage}` });
  //         console.error("Error al crear municipio!", error.response || error.message);
  //       });
  //   } else if (methodName === "Update") {
  //     axios.put(`${SiteProps.urlbasev1}/items/municipio/${id}`, formJson)
  //       .then(response => {
  //         props.setMessage({ open: true, severity: "success", text: "Municipio actualizado con éxito!" });
  //         setOpen(false);
  //         // Reload municipios
  //         axios.get(`${SiteProps.urlbasev1}/items/municipio`)
  //           .then(response => {
  //             props.setMunicipios(response.data);
  //           })
  //           .catch(error => {
  //             console.error("Error al buscar municipio!", error);
  //           });
  //       })
  //       .catch(error => {
  //         const errorMessage = error.response ? error.response.data.message : error.message;
  //         props.setMessage({ open: true, severity: "error", text: `Error al actualizar municipio! ${errorMessage}`});
  //         console.error("Error al actualizar municipio!", error.response || error.message);
  //       });
  //   } else if (methodName === "Delete") {
  //     axios.delete(`${SiteProps.urlbasev1}/items/municipio/${id}`)
  //       .then(response => {
  //         props.setMessage({ open: true, severity: "success", text: "Municipio eliminado con éxito!" });
  //         setOpen(false);
  //         // Reload municipios
  //         axios.get(`${SiteProps.urlbasev1}/items/municipio`)
  //           .then(response => {
  //             props.setMunicipios(response.data);
  //           })
  //           .catch(error => {
  //             console.error("Error al buscar municipio!", error);
  //           });
  //       })
  //       .catch(error => {
  //         const errorMessage = error.response ? error.response.data.message : error.message;
  //         props.setMessage({ open: true, severity: "error", text: `Error al eliminar municipio! ${errorMessage}` });
  //         console.error("Error al eliminar municipio!", error.response || error.message);
  //       });
  //   }

  //   handleClose();
  // };

  // return (
  //   <React.Fragment>
  //     <StackButtons
  //       methods={methods}
  //       create={create}
  //       open={open}
  //       setOpen={setOpen}

  //     />
  //     <Dialog
  //       open={open}
  //       onClose={handleClose}
  //       PaperProps={{
  //         component: "form",
  //         onSubmit: handleSubmit,
  //       }}
  //     >
  //       <DialogTitle>Municipios</DialogTitle>
  //       <DialogContent>
  //         <DialogContentText>Completa el formulario.</DialogContentText>
  //         <FormControl fullWidth>
  //           <TextField
  //             autoFocus
  //             required
  //             id="name"
  //             name="name"
  //             label="Nombre"
  //             fullWidth
  //             variant="standard"
  //             margin="normal"
  //             defaultValue={props.selectedRow.name}
  //           />
  //         </FormControl>

  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleClose}>Cancel</Button>
  //         <Button type="submit">{methodName}</Button>
  //       </DialogActions>
  //     </Dialog>
  //   </React.Fragment>
  // );
}

