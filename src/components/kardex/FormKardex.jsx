// /**
//  * 
//  */
// //v1
// import * as React from "react";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import StackButtons from "../StackButtons";
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function FormKardex(props) {
//   const [open, setOpen] = React.useState(false);
//   const [methodName, setMethodName] = React.useState("");

//   const create = () => {
//     const row = {
//       kar_id: 0,
//       kar_fecha_hora: new Date(),
//       kar_almacen_id: 0,
//       kar_produccion_id: 0,
//       kar_tipo_movimiento_id: 0,
//       kar_descripcion: "",
//       kar_estado: 0
//     };
//     props.setSelectedRow(row);
//     setMethodName("Add");
//     setOpen(true);
//     console.log("create() " + JSON.stringify(row));
//   };

//   const update = () => {
//     if (props.selectedRow.kar_id === 0) {
//       console.log("select row");
//       const messageData = {
//         open: true,
//         severity: "error",
//         text: "Select row!",
//       };
//       props.setMessage(messageData);
//       return;
//     }
//     setMethodName("Update");
//     setOpen(true);
//     console.log("update() " + JSON.stringify(props.selectedRow));
//   };

//   const deleteRow = () => {
//     if (props.selectedRow.kar_id === 0) {
//       console.log("select row");
//       const messageData = {
//         open: true,
//         severity: "error",
//         text: "Select row!",
//       };
//       props.setMessage(messageData);
//       return;
//     }
//     setMethodName("Delete");
//     setOpen(true);
//     console.log("delete() " + JSON.stringify(props.selectedRow));
//   };

//   const methods = {
//     create,
//     update,
//     deleteRow,
//   };

//   React.useEffect(() => {
//     if (props.selectedRow != undefined) {
//       console.log("SB: " + props.selectedRow.kar_id);
//     }
//   }, [props.selectedRow]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const formJson = Object.fromEntries(formData.entries());
//     const id = props.selectedRow.kar_id;
//     console.log("Submitting data:", formJson);

//     const validatePayload = (data) => {
//       // Validate the payload here if necessary
//       if (!data.kar_fecha_hora || !data.kar_almacen_id || !data.kar_produccion_id || !data.kar_tipo_movimiento_id || !data.kar_descripcion || !data.kar_estado) {
//         console.error("Invalid data:", data);
//         props.setMessage({ open: true, severity: "error", text: "Invalid data!" });
//         return false;
//       }
//       return true;
//     };

//     if (!validatePayload(formJson)) return;

//     if (methodName === "Add") {
//       axios.post(`${SiteProps.urlbase}/kardex`, formJson)
//         .then(response => {
//           props.setMessage({ open: true, severity: "success", text: "Kardex creado con éxito!" });
//           setOpen(false);
//           // Reload kardex
//           axios.get(`${SiteProps.urlbase}/kardex`)
//             .then(response => {
//               props.setKardex(response.data);
//             })
//             .catch(error => {
//               console.error("Error al buscar kardex!", error);
//             });
//         })
//         .catch(error => {
//           const errorMessage = error.response ? error.response.data.message : error.message;
//           props.setMessage({ open: true, severity: "error", text: `Error al crear kardex! ${errorMessage}` });
//           console.error("Error al crear kardex!", error.response || error.message);
//         });
//     } else if (methodName === "Update") {
//       axios.put(`${SiteProps.urlbase}/kardex/${id}`, formJson)
//         .then(response => {
//           props.setMessage({ open: true, severity: "success", text: "Kardex actualizado con éxito!" });
//           setOpen(false);
//           // Reload kardex
//           axios.get(`${SiteProps.urlbase}/kardex`)
//             .then(response => {
//               props.setKardex(response.data);
//             })
//             .catch(error => {
//               console.error("Error al buscar kardex!", error);
//             });
//         })
//         .catch(error => {
//           props.setMessage({ open: true, severity: "error", text: "Error al actualizar kardex!" });
//           console.error("Error al actualizar kardex!", error.response || error.message);
//         });
//     } else if (methodName === "Delete") {
//       axios.delete(`${SiteProps.urlbase}/kardex/${id}`)
//         .then(response => {
//           props.setMessage({ open: true, severity: "success", text: "Kardex eliminado con éxito!" });
//           setOpen(false);
//           // Reload kardex
//           axios.get(`${SiteProps.urlbase}/kardex`)
//             .then(response => {
//               props.setKardex(response.data);
//             })
//             .catch(error => {
//               console.error("Error al buscar kardex!", error);
//             });
//         })
//         .catch(error => {
//           props.setMessage({ open: true, severity: "error", text: "Error al eliminar kardex!" });
//           console.error("Error al eliminar kardex!", error.response || error.message);
//         });
//     }

//     handleClose();
//   };

//   return (
//     <React.Fragment>
//       <StackButtons
//         methods={methods}
//         create={create}
//         open={open}
//         setOpen={setOpen}
//         handleClickOpen={handleClickOpen}
//       />
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           component: "form",
//           onSubmit: handleSubmit,
//         }}
//       >
//         <DialogTitle>Kardex</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Completa el formulario.</DialogContentText>
//           <FormControl fullWidth>
//             <TextField
//               autoFocus
//               required
//               id="kar_fecha_hora"
//               name="kar_fecha_hora"
//               label="Fecha y Hora (mm/dd/yyyy)"
//               type="datetime-local"
//               fullWidth
//               variant="standard"
//               margin="normal"
//               defaultValue={props.selectedRow.kar_fecha_hora.toISOString().substring(0, 16)}
              
//             />
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="almacen-select-label">Almacén</InputLabel>
//             <Select
//               labelId="almacen-select-label"
//               id="kar_almacen_id"
//               name="kar_almacen_id"
//               defaultValue={props.selectedRow.kar_almacen_id}
//               margin="dense"
//             >
//               {props.almacen.map((alm) => (
//                 <MenuItem key={alm.alm_id} value={alm.alm_id}>
//                   {alm.alm_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="produccion-select-label">Producción</InputLabel>
//             <Select
//               labelId="produccion-select-label"
//               id="kar_produccion_id"
//               name="kar_produccion_id"
//               defaultValue={props.selectedRow.kar_produccion_id}
//               margin="dense"
//             >
//               {props.produccion.map((prod) => (
//                 <MenuItem key={prod.pro_id} value={prod.pro_id}>
//                   {prod.pro_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="tipo-movimiento-select-label">Tipo Movimiento</InputLabel>
//             <Select
//               labelId="tipo-movimiento-select-label"
//               id="kar_tipo_movimiento_id"
//               name="kar_tipo_movimiento_id"
//               defaultValue={props.selectedRow.kar_tipo_movimiento_id}
//               margin="dense"
//             >
//               {props.tipoMovimiento.map((tipo) => (
//                 <MenuItem key={tipo.tim_id} value={tipo.tim_id}>
//                   {tipo.tim_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <TextField
//               autoFocus
//               required
//               id="kar_descripcion"
//               name="kar_descripcion"
//               label="Descripción"
//               fullWidth
//               variant="standard"
//               margin="normal"
//               defaultValue={props.selectedRow.kar_descripcion}
//             />
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="estado-select-label">Estado</InputLabel>
//             <Select
//               labelId="estado-select-label"
//               id="kar_estado"
//               name="kar_estado"
//               defaultValue={props.selectedRow.kar_estado}
//               margin="dense"
//             >
//               {props.estado.map((estado) => (
//                 <MenuItem key={estado.est_id} value={estado.est_id}>
//                   {estado.est_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button type="submit">{methodName}</Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }


import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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

export default function FormKardex(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      kar_id: 0,
      kar_fecha_hora: new Date(),
      kar_almacen_id: 0,
      kar_produccion_id: 0,
      kar_tipo_movimiento_id: 0,
      kar_descripcion: "",
      kar_estado: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  const update = () => {
    if (!props.selectedRow || !props.selectedRow.id) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para actualizar!",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!props.selectedRow || !props.selectedRow.id) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar!",
      });
      return;
    }
    props.deleteAlmacen(props.selectedRow.id);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = props.selectedRow;

    if (methodName === "Add") {
      props.addAlmacen(formData);
    } else if (methodName === "Update") {
      props.updateAlmacen(formData);
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={create}
          style={{ marginRight: "10px" }}
        >
          ADD
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginRight: "10px" }}
        >
          UPDATE
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
        >
          DELETE
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Kardex</DialogTitle>
         <DialogContent>
           <DialogContentText>Completa el formulario.</DialogContentText>
           <FormControl fullWidth>
             <TextField
              autoFocus
              required
              id="kar_fecha_hora"
              name="kar_fecha_hora"
              label="Fecha y Hora (mm/dd/yyyy)"
              type="datetime-local"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.kar_fecha_hora.toISOString().substring(0, 16)}
              
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="almacen-select-label">Almacén</InputLabel>
            <Select
              labelId="almacen-select-label"
              id="kar_almacen_id"
              name="kar_almacen_id"
              defaultValue={props.selectedRow.kar_almacen_id}
              margin="dense"
            >
              {props.almacen.map((alm) => (
                <MenuItem key={alm.alm_id} value={alm.alm_id}>
                  {alm.alm_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="produccion-select-label">Producción</InputLabel>
            <Select
              labelId="produccion-select-label"
              id="kar_produccion_id"
              name="kar_produccion_id"
              defaultValue={props.selectedRow.kar_produccion_id}
              margin="dense"
            >
              {props.produccion.map((prod) => (
                <MenuItem key={prod.pro_id} value={prod.pro_id}>
                  {prod.pro_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="tipo-movimiento-select-label">Tipo Movimiento</InputLabel>
            <Select
              labelId="tipo-movimiento-select-label"
              id="kar_tipo_movimiento_id"
              name="kar_tipo_movimiento_id"
              defaultValue={props.selectedRow.kar_tipo_movimiento_id}
              margin="dense"
            >
              {props.tipoMovimiento.map((tipo) => (
                <MenuItem key={tipo.tim_id} value={tipo.tim_id}>
                  {tipo.tim_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="almacen-select-label">Almacén</InputLabel>
            <Select
              labelId="almacen-select-label"
              id="kar_almacen_id"
              name="kar_almacen_id"
              defaultValue={props.selectedRow.kar_almacen_id}
            >
              
              {props.almacen.map((alm) => (
                <MenuItem key={alm.alm_id} value={alm.alm_id}>
                  {alm.alm_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="produccion-select-label">Producción</InputLabel>
            <Select
              labelId="produccion-select-label"
              id="kar_produccion_id"
              name="kar_produccion_id"
              defaultValue={props.selectedRow.kar_produccion_id}
              margin="dense"
            >
              {props.produccion.map((prod) => (
                <MenuItem key={prod.pro_id} value={prod.pro_id}>
                  {prod.pro_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="tipo-movimiento-select-label">Tipo Movimiento</InputLabel>
            <Select
              labelId="tipo-movimiento-select-label"
              id="kar_tipo_movimiento_id"
              name="kar_tipo_movimiento_id"
              defaultValue={props.selectedRow.kar_tipo_movimiento_id}
              margin="dense"
            >
              {props.tipoMovimiento.map((tipo) => (
                <MenuItem key={tipo.tim_id} value={tipo.tim_id}>
                  {tipo.tim_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="kar_descripcion"
              name="kar_descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.kar_descripcion}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              id="kar_estado"
              name="kar_estado"
              defaultValue={props.selectedRow.kar_estado}
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
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}