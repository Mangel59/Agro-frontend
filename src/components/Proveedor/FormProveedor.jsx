
/**
 * FormProveedor componente principal.
 * @component
 * @returns {JSX.Element}
 */
// import React, { useState } from "react";
// import axios from "axios";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import FormControl from "@mui/material/FormControl";
// import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormProveedor.
 * @module FormProveedor.jsx
 * @component
 * @returns {JSX.Element}
 */
// export default function FormProveedor(props) {
//   const [open, setOpen] = useState(false);
//   const [methodName, setMethodName] = useState("");

//   const create = () => {
//     const row = {
//       id: 0,
//       nombre: "",
//       descripcion: "",
//       estado: 0,
//       empresa: "",
//     };
//     props.setSelectedRow(row);
//     setMethodName("Add");
//     setOpen(true);
//   };

//   const update = () => {
//     if (!props.selectedRow || props.selectedRow.id === 0) {
//       props.setMessage({
//         open: true,
//         severity: "error",
//         text: "Selecciona una fila para actualizar",
//       });
//       return;
//     }
//     setMethodName("Update");
//     setOpen(true);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const formJson = Object.fromEntries(formData.entries());
//     const id = props.selectedRow?.id || 0;

//     const url =
//       methodName === "Add"
//         ? `${SiteProps.urlbasev1}/proveedores`
//         : `${SiteProps.urlbasev1}/proveedores/${id}`;
//     const token = localStorage.getItem("token");

//     axios({
//       method: methodName === "Add" ? "post" : "put",
//       url,
//       data: formJson,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then(() => {
//         props.setMessage({
//           open: true,
//           severity: "success",
//           text: `Proveedor ${methodName === "Add" ? "creado" : "actualizado"} con éxito!`,
//         });
//         setOpen(false);
//         props.reloadData();
//       })
//       .catch((error) => {
//         props.setMessage({
//           open: true,
//           severity: "error",
//           text: `Error al ${methodName === "Add" ? "crear" : "actualizar"} proveedor: ${
//             error.message
//           }`,
//         });
//       });
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Button onClick={create}>Agregar</Button>
//       <Button onClick={update}>Actualizar</Button>
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Proveedor</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth>
//             <TextField
//               required
//               id="nombre"
//               name="nombre"
//               label="Nombre"
//               defaultValue={props.selectedRow?.nombre || ""}
//             />
//           </FormControl>
//           <FormControl fullWidth>
//             <TextField
//               required
//               id="descripcion"
//               name="descripcion"
//               label="Descripción"
//               defaultValue={props.selectedRow?.descripcion || ""}
//             />
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancelar</Button>
//           <Button type="submit" onClick={handleSubmit}>
//             {methodName}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }


import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function FormProveedor({
  onAdd,
  onUpdate,
  onDelete,
  selectedRow,
  setSelectedRow,
}) {
  const [open, setOpen] = useState(false); // Controla si el formulario está visible
  const [formData, setFormData] = useState({
    pro_id: "",
    pro_empresa_id: "",
    pro_fecha_creacion: "",
    pro_estado: 1,
  });

  // Manejo de apertura del formulario para agregar o editar
  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow); // Carga los datos de la fila seleccionada
    } else {
      setFormData({
        pro_id: "",
        pro_empresa_id: "",
        pro_fecha_creacion: "",
        pro_estado: 1,
      }); // Limpia los datos si es una nueva creación
    }
    setOpen(true);
  };

  // Manejo de cierre del formulario
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setFormData({
      pro_id: "",
      pro_empresa_id: "",
      pro_fecha_creacion: "",
      pro_estado: 1,
    });
  };

  // Manejo de cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de envío del formulario (Agregar o Editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pro_id) {
      onUpdate(formData); // Actualizar proveedor existente
    } else {
      onAdd({ ...formData, pro_id: Date.now() }); // Agregar nuevo proveedor
    }
    handleClose();
  };

  // Manejo de eliminación
  const handleDelete = () => {
    if (selectedRow && selectedRow.pro_id) {
      onDelete(selectedRow.pro_id);
      setSelectedRow(null); // Limpiar selección
    }
  };

  return (
    <>
      {/* Botones visibles en todo momento */}
      <div style={{ marginBottom: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen} // Abre el formulario vacío para agregar
          style={{ marginRight: "1rem" }}
        >
          Agregar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpen} // Abre el formulario con datos para editar
          disabled={!selectedRow} // Desactivado si no hay fila seleccionada
          style={{ marginRight: "1rem" }}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete} // Elimina la fila seleccionada
          disabled={!selectedRow} // Desactivado si no hay fila seleccionada
        >
          Eliminar
        </Button>
      </div>

      {/* Dialog para Agregar o Editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRow ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
        <DialogContent>
          <TextField
            name="pro_empresa_id"
            label="Empresa ID"
            value={formData.pro_empresa_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="pro_fecha_creacion"
            label="Fecha Creación"
            value={formData.pro_fecha_creacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="datetime-local"
          />
          <TextField
            name="pro_estado"
            label="Estado (1: Activo, 0: Inactivo)"
            value={formData.pro_estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>
            {selectedRow ? "Actualizar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
