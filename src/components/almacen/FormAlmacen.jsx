// import * as React from "react";
// import axios from "../axiosConfig";
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
// import { SiteProps } from "../dashboard/SiteProps";

// export default function FormAlmacen(props) {
//   const [open, setOpen] = React.useState(false);
//   const [methodName, setMethodName] = React.useState("");

//   const create = () => {
//     const row = {
//       id: 0,
//       nombre: "",
//       descripcion: "",
//       sedeId: 0,
//       geolocalizacion: {
//         type: "Point",
//         coordinates: []
//       },
//       estado: 0,
//     };
//     props.setSelectedRow(row);
//     setMethodName("Add");
//     setOpen(true);
//     console.log("create() " + JSON.stringify(row));
//   };

//   const update = () => {
//     if (!props.selectedRow || props.selectedRow.id === 0) {
//       props.setMessage({
//         open: true,
//         severity: "error",
//         text: "¡Seleccione una fila!",
//       });
//       return;
//     }
//     setMethodName("Update");
//     setOpen(true);
//     console.log("update() " + JSON.stringify(props.selectedRow));
//   };

//   const deleteRow = () => {
//     if (props.selectedRow.id === 0) {
//       props.setMessage({
//         open: true,
//         severity: "error",
//         text: "¡Seleccione una fila!",
//       });
//       return;
//     }
//     const id = props.selectedRow.id;
//     const url = `${SiteProps.urlbasev1}/almacenes/${id}`;
//     axios
//       .delete(url, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((response) => {
//         props.setMessage({
//           open: true,
//           severity: "success",
//           text: "Almacen eliminado con éxito!",
//         });
//         props.reloadData();
//       })
//       .catch((error) => {
//         const errorMessage = error.response
//           ? error.response.data.message
//           : error.message;
//         props.setMessage({
//           open: true,
//           severity: "error",
//           text: `Error al eliminar almace! ${errorMessage}`,
//         });
//         console.error(
//           "Error al eliminar almacen!",
//           error.response || error.message
//         );
//       });
//   };

//   const methods = {
//     create,
//     update,
//     deleteRow,
//   };
//   React.useEffect(() => {
//     if (props.selectedRow !== undefined) {
//       console.log("Selected Row ID: " + props.selectedRow.id);
//     }
//   }, [props.selectedRow]);
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const formJson = Object.fromEntries(formData.entries());
//     const id = props.selectedRow?.id || 0;
//     const validatePayload = (data) => {
//       if (
//         !data.nombre ||
//         !data.descripcion ||
//         !data.estado
//       ) {
//         console.error("Invalid data:", data);
//         props.setMessage({
//           open: true,
//           severity: "error",
//           text: "Invalid data!",
//         });
//         return false;
//       }
//       return true;
//     };
//     if (!validatePayload(formJson)) return;
//     const url = `${SiteProps.urlbasev1}/almacen`;
//     if (methodName === "Add") {
//       axios
//         .post(url, formJson)
//         .then((response) => {
//           props.setMessage({
//             open: true,
//             severity: "success",
//             text: "Almacen creado con éxito!",
//           });
//           setOpen(false);
//           props.reloadData();
//         })
//         .catch((error) => {
//           const errorMessage = error.response
//             ? error.response.data.message
//             : error.message;
//           props.setMessage({
//             open: true,
//             severity: "error",
//             text: `Error al crear almacen! ${errorMessage}`,
//           });
//         });
//     } else if (methodName === "Update") {
//       axios
//         .put(`${url}/${id}`, formJson)
//         .then((response) => {
//           props.setMessage({
//             open: true,
//             severity: "success",
//             text: "Almacén actualizado con éxito!",
//           });
//           setOpen(false);
//           props.reloadData();
//         })
//         .catch((error) => {
//           const errorMessage = error.response
//             ? error.response.data.message
//             : error.message;
//           props.setMessage({
//             open: true,
//             severity: "error",
//             text: `Error al actualizar alamcen! ${errorMessage}`,
//           });
//           console.error(
//             "Error al actualizar almacen!",
//             error.response || error.message
//           );
//         });
//     } else if (methodName === "Delete") {
//       axios
//         .delete(`${url}/${id}`)
//         .then((response) => {
//           props.setMessage({
//             open: true,
//             severity: "success",
//             text: "Almacén eliminado con éxito!",
//           });
//           setOpen(false);
//           props.reloadData();
//         })
//         .catch((error) => {
//           const errorMessage = error.response
//             ? error.response.data.message
//             : error.message;
//           props.setMessage({
//             open: true,
//             severity: "error",
//             text: `Error al eliminar almacen! ${errorMessage}`,
//           });
//           console.error(
//             "Error al eliminar almacen!",
//             error.response || error.message
//           );
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
//       />
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           component: "form",
//           onSubmit: handleSubmit,
//         }}
//       >
//         <DialogTitle>{methodName} Almacén</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Completa el formulario.</DialogContentText>
//           <FormControl fullWidth margin="normal">
//             <TextField
//               autoFocus
//               required
//               id="nombre"
//               name="nombre"
//               label="Nombre"
//               fullWidth
//               variant="standard"
//               defaultValue={props.selectedRow?.nombre || ""}
//             />
//           </FormControl>
          
//           <FormControl fullWidth margin="normal">
//             <TextField
//               required
//               id="descripcion"
//               name="descripcion"
//               label="Descripción"
//               fullWidth
//               variant="standard"
//               defaultValue={props.selectedRow?.descripcion || ""}
//             />
//           </FormControl>
          
//           {/* Geolocalización */}
//           <FormControl fullWidth margin="normal">
//             <TextField
//               required
//               id="latitud"
//               name="latitud"
//               label="Latitud"
//               type="number"
//               fullWidth
//               variant="standard"
//               defaultValue={props.selectedRow?.geolocalizacion?.coordinates[1] || ""}
//             />
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <TextField
//               required
//               id="longitud"
//               name="longitud"
//               label="Longitud"
//               type="number"
//               fullWidth
//               variant="standard"
//               defaultValue={props.selectedRow?.geolocalizacion?.coordinates[0] || ""}
//             />
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel
//               id="estado-label"
//               sx={{
//                 backgroundColor: 'white',
//                 padding: '0 8px',
//               }}
//             >
//               Estado
//             </InputLabel>
//             <Select
//               labelId="estado-label"
//               id="estado"
//               name="estado"
//               defaultValue={props.selectedRow?.estado || ""}
//               fullWidth
//             >
//               <MenuItem value={1}>Activo</MenuItem>
//               <MenuItem value={0}>Inactivo</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancelar</Button>
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

export default function FormAlmacen(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    props.setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const create = () => {
    const row = {
      alm_id: 0,
      alm_nombre: "",
      alm_descripcion: "",
      alm_sede_id: 0,
      alm_geolocalizacion: {
        type: "Point",
        coordinates: [0, 0],
      },
      alm_coordenadas: "",
      alm_estado: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!props.selectedRow || !props.selectedRow.alm_id) {
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
    if (!props.selectedRow || !props.selectedRow.alm_id) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar!",
      });
      return;
    }
    props.deleteAlmacen(props.selectedRow.alm_id);
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
        <DialogTitle>Almacén</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="alm_nombre"
              name="alm_nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.alm_nombre || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="alm_descripcion"
              name="alm_descripcion"
              label="Descripcion"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.alm_descripcion || ''}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="sede-select-label">Sede</InputLabel>
            <Select
              labelId="sede-select-label"
              id="alm_sede_id"
              name="alm_sede_id"
              value={props.selectedRow?.alm_sede_id || ''}
              onChange={handleInputChange}
              margin="dense"
            >
              {props.sede.map((sede) => (
                <MenuItem key={sede.sed_id} value={sede.sed_id}>
                  {sede.sed_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="latitud"
              name="latitud"
              label="Latitud"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.alm_geolocalizacion.coordinates[1] || ''}
              onChange={(event) => {
                const latitud = event.target.value;
                props.setSelectedRow((prevRow) => ({
                  ...prevRow,
                  alm_geolocalizacion: {
                    ...prevRow.alm_geolocalizacion,
                    coordinates: [prevRow.alm_geolocalizacion.coordinates[0], latitud],
                  },
                }));
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="longitud"
              name="longitud"
              label="Longitud"
              fullWidth
              variant="standard"
              margin="normal"
              value={props.selectedRow?.alm_geolocalizacion.coordinates[0] || ''}
              onChange={(event) => {
                const longitud = event.target.value;
                props.setSelectedRow((prevRow) => ({
                  ...prevRow,
                  alm_geolocalizacion: {
                    ...prevRow.alm_geolocalizacion,
                    coordinates: [longitud, prevRow.alm_geolocalizacion.coordinates[1]],
                  },
                }));
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              id="alm_estado"
              name="alm_estado"
              value={props.selectedRow?.alm_estado || ''}
              onChange={handleInputChange}
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
