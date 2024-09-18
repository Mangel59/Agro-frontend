import * as React from "react";
import axios from '../axiosConfig';
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

export default function FormProductoPresentacion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const create = () => {
    const row = {
      prp_id: 0,
      prp_producto_id: 0,
      prp_nombre: "",
      prp_unidad_id: 0,
      prp_descripcion: "",
      prp_estado: 0,
      prp_cantidad: 0,
      prp_marca_id: 0,
      prp_presentacion_id: 0
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
    // console.log("create() " + props.selectedRow);
  };

  const update = () => {
    if (props.selectedRow.prp_id === 0) {
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
    // console.log("update() " + props.selectedRow);
    console.log("update() " + JSON.stringify(props.selectedRow));
  };



  const deleteRow = () => {
    if (props.selectedRow.prp_id === 0) {
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
    // console.log("delete() " + props.selectedRow);
    console.log("delete() " + JSON.stringify(props.selectedRow));
  };



  const methods = {
    create,
    update,
    deleteRow,
  };

  React.useEffect(() => {
    if (props.selectedRow != undefined) {
      console.log("SB: " + props.selectedRow.prp_id);
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
    const id = props.selectedRow.prp_id;
    console.log("Submitting data:", formJson);

    const validatePayload = (data) => {
      // Validate the payload here if necessary
      if (!data.prp_producto_id || !data.prp_unidad_id || !data.prp_descripcion || !data.prp_estado || !data.prp_estado || !data.prp_cantidad || !data.prp_marca_id || !data.prp_presentacion_id) {
        console.error("Invalid data:", data);
        props.setMessage({ open: true, severity: "error", text: "Invalid data!" });
        return false;
      }
      return true;
    };

    if (!validatePayload(formJson)) return;

    if (methodName === "Add") {
      axios.post(`${SiteProps.urlbase}/producto-presentaciones`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producto presentación creado con éxito!" });
          setOpen(false);
          // Reload producto_presentacion
          axios.get(`${SiteProps.urlbase}/producto-presentaciones`)
            .then(response => {
              props.setProductoPresentacion(response.data);
            })
            .catch(error => {
              console.error("Error al buscar producto_presentacion!", error);
            });
        })
        .catch(error => {
          const errorMessage = error.response ? error.response.data.message : error.message;
          props.setMessage({ open: true, severity: "error", text: `Error al crear producto presentación! ${errorMessage}  ` });
          console.error("Error al crear producto presentación!", error.response || error.message);
        });
    } else if (methodName === "Update") {
      axios.put(`${SiteProps.urlbase}/producto-presentaciones/${id}`, formJson)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producto presentación actualizado con éxito!" });
          setOpen(false);
          // Reload producto_presentacion
          axios.get(`${SiteProps.urlbase}/producto_presentacion`)
            .then(response => {
              props.setProductoPresentacion(response.data);
            })
            .catch(error => {
              console.error("Error al buscar producto_presentacion!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al actualizar producto presentación!" });
          console.error("Error al actualizar producto presentación!", error.response || error.message);
        });

    } else if (methodName === "Delete") {
      axios.delete(`${SiteProps.urlbase}/producto-presentaciones/${id}`)
        .then(response => {
          props.setMessage({ open: true, severity: "success", text: "Producto presentación eliminado con éxito!" });
          setOpen(false);
          // Reload producto_presentacion
          axios.get(`${SiteProps.urlbase}/producto-presentaciones`)
            .then(response => {
              props.setProductoPresentacion(response.data);
            })
            .catch(error => {
              console.error("Error al buscar producto_presentacion!", error);
            });
        })
        .catch(error => {
          props.setMessage({ open: true, severity: "error", text: "Error al eliminar producto presentación!" });
          console.error("Error al eliminar producto presentación!", error.response || error.message);
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
        <DialogTitle>Producto Presentación</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth>
            <TextField
              autoFocus
              required  
              id="prp_nombre"
              name="prp_nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.prp_nombre}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="producto-select-label">Producto</InputLabel>
            <Select
              labelId="producto-select-label"
              id="prp_producto_id"
              name="prp_producto_id"
              defaultValue={props.selectedRow.prp_producto_id}
              margin="dense"
            >
              {props.producto.map((producto) => (
                <MenuItem key={producto.pro_id} value={producto.pro_id}>
                  {producto.pro_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="unidad-select-label">Unidad</InputLabel>
            <Select
              labelId="unidad-select-label"
              id="prp_unidad_id"
              name="prp_unidad_id"
              defaultValue={props.selectedRow.prp_unidad_id}
              margin="dense"
            >
              {props.unidad.map((unidad) => (
                <MenuItem key={unidad.uni_id} value={unidad.uni_id}>
                  {unidad.uni_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              id="prp_estado"
              name="prp_estado"
              defaultValue={props.selectedRow.prp_estado}
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
              id="prp_descripcion"
              name="prp_descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.prp_descripcion}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              id="prp_cantidad"
              name="prp_cantidad"
              label="Cantidad"
              fullWidth
              variant="standard"
              margin="normal"
              defaultValue={props.selectedRow.prp_cantidad}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="marca-select-label">Marca</InputLabel>
            <Select
              labelId="marca-select-label"
              id="prp_marca_id"
              name="prp_marca_id"
              defaultValue={props.selectedRow.prp_marca_id}
              margin="dense"
            >
              {props.marca.map((marca) => (
                <MenuItem key={marca.mar_id} value={marca.mar_id}>
                  {marca.mar_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="presentacion-select-label">Presentación</InputLabel>
            <Select
              labelId="presentacion-select-label"
              id="prp_presentacion_id"
              name="prp_presentacion_id"
              defaultValue={props.selectedRow.prp_presentacion_id}
              margin="dense"
            >
              {props.presentacion.map((presentacion) => (
                <MenuItem key={presentacion.pre_id} value={presentacion.pre_id}>
                  {presentacion.pre_nombre}
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

// import * as React from "react";
// import AddIcon from "@mui/icons-material/Add";
// import UpdateIcon from "@mui/icons-material/Update";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
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

// export default function FormProductoPresentacion(props) {
//   const [open, setOpen] = React.useState(false);
//   const [methodName, setMethodName] = React.useState("");

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     props.setSelectedRow((prevRow) => ({
//       ...prevRow,
//       [name]: value,
//     }));
//   };

//   const create = () => {
//     const row = {
//       prp_id: Date.now(),  // Genera un ID único usando la fecha actual
//       prp_producto_id: 0,
//       prp_nombre: "",
//       prp_unidad_id: 0,
//       prp_descripcion: "",
//       prp_estado: 0,
//       prp_cantidad: 0,
//       prp_marca_id: 0,
//       prp_presentacion_id: 0
//     };
//     props.setSelectedRow(row);
//     setMethodName("Add");
//     setOpen(true);
//   };

//   const update = () => {
//     if (!props.selectedRow || !props.selectedRow.prp_id) {
//       props.setMessage({
//         open: true,
//         severity: "error",
//         text: "Seleccione una fila para actualizar!",
//       });
//       return;
//     }
//     setMethodName("Update");
//     setOpen(true);
//   };

//   const deleteRow = () => {
//     if (!props.selectedRow || !props.selectedRow.prp_id) {
//       props.setMessage({
//         open: true,
//         severity: "error",
//         text: "Seleccione una fila para eliminar!",
//       });
//       return;
//     }
//     props.deleteProductoPresentacion(props.selectedRow.prp_id);  // Llama a la función delete
//     setOpen(false);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = props.selectedRow;

//     if (methodName === "Add") {
//       props.addProductoPresentacion(formData);  // Llama a la función de agregar
//     } else if (methodName === "Update") {
//       props.updateProductoPresentacion(formData);  // Llama a la función de actualizar
//     }

//     setOpen(false);
//   };

//   return (
//     <React.Fragment>
//       <Box display="flex" justifyContent="right" mb={2}>
//       <Button
//         variant="outlined"
//         color="primary"
//         startIcon={<AddIcon />}
//         onClick={create}
//         style={{ marginRight: "10px" }}
//       >
//         ADD
//       </Button>
//       <Button
//         variant="outlined"
//         color="primary"
//         startIcon={<UpdateIcon />}
//         onClick={update}
//         style={{ marginRight: "10px" }}
//       >
//         UPDATE
//       </Button>
//       <Button
//         variant="outlined"
//         color="primary"
//         startIcon={<DeleteIcon />}
//         onClick={deleteRow}
//       >
//         DELETE
//       </Button>
//       </Box>
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         PaperProps={{
//           component: "form",
//           onSubmit: handleSubmit,
//         }}
//       >
//         <DialogTitle>Producto Presentación</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Completa el formulario.</DialogContentText>

//           <FormControl fullWidth>
//             <TextField
//               autoFocus
//               required  
//               id="prp_nombre"
//               name="prp_nombre"
//               label="Nombre"
//               fullWidth
//               variant="standard"
//               margin="normal"
//               value={props.selectedRow?.prp_nombre || ''} 
//               onChange={handleInputChange}
//             />
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="producto-select-label">Producto</InputLabel>
//             <Select
//               labelId="producto-select-label"
//               id="prp_producto_id"
//               name="prp_producto_id"
//               value={props.selectedRow?.prp_producto_id || ''}  
//               onChange={handleInputChange}
//               margin="dense"
//             >
//               {props.producto.map((producto) => (
//                 <MenuItem key={producto.pro_id} value={producto.pro_id}>
//                   {producto.pro_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="unidad-select-label">Unidad</InputLabel>
//             <Select
//               labelId="unidad-select-label"
//               id="prp_unidad_id"
//               name="prp_unidad_id"
//               value={props.selectedRow?.prp_unidad_id || ''} 
//               onChange={handleInputChange}
//               margin="dense"
//             >
//               {props.unidad.map((unidad) => (
//                 <MenuItem key={unidad.uni_id} value={unidad.uni_id}>
//                   {unidad.uni_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="estado-select-label">Estado</InputLabel>
//             <Select
//               labelId="estado-select-label"
//               id="prp_estado"
//               name="prp_estado"
//               value={props.selectedRow?.prp_estado || ''} 
//               onChange={handleInputChange}
//               margin="dense"
//             >
//               {props.estado.map((estado) => (
//                 <MenuItem key={estado.est_id} value={estado.est_id}>
//                   {estado.est_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <TextField
//               required
//               id="prp_descripcion"
//               name="prp_descripcion"
//               label="Descripción"
//               fullWidth
//               variant="standard"
//               margin="normal"
//               value={props.selectedRow?.prp_descripcion || ''} 
//               onChange={handleInputChange}
//             />
//           </FormControl>

//           <FormControl fullWidth>
//             <TextField
//               required
//               id="prp_cantidad"
//               name="prp_cantidad"
//               label="Cantidad"
//               fullWidth
//               variant="standard"
//               margin="normal"
//               value={props.selectedRow?.prp_cantidad || ''} 
//               onChange={handleInputChange}
//             />
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="marca-select-label">Marca</InputLabel>
//             <Select
//               labelId="marca-select-label"
//               id="prp_marca_id"
//               name="prp_marca_id"
//               value={props.selectedRow?.prp_marca_id || ''} 
//               onChange={handleInputChange}
//               margin="dense"
//             >
//               {props.marca.map((marca) => (
//                 <MenuItem key={marca.mar_id} value={marca.mar_id}>
//                   {marca.mar_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel id="presentacion-select-label">Presentación</InputLabel>
//             <Select
//               labelId="presentacion-select-label"
//               id="prp_presentacion_id"
//               name="prp_presentacion_id"
//               value={props.selectedRow?.prp_presentacion_id || ''} 
//               onChange={handleInputChange}
//               margin="dense"
//             >
//               {props.presentacion.map((presentacion) => (
//                 <MenuItem key={presentacion.pre_id} value={presentacion.pre_id}>
//                   {presentacion.pre_nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancelar</Button>
//           <Button type="submit">{props.methodName}</Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }
