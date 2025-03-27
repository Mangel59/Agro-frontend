
/**
 * GridKardexNuevo componente principal.
 * @component
 * @returns {JSX.Element}
 */
// import React, { useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Button, Box, Modal, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
// import ProductoPresentacion from './ProductoPresentacion';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 90, hide: true },
//   {
//     field: 'productoPresentacion',
//     headerName: 'Producto Presentación',
//     width: 200,
//     renderCell: (params) => {
//       const producto = params.row.productoPresentacion;
//       return producto
//         ? `${producto.nombreProducto || ''} - ${producto.nombrePresentacion || ''}`
//         : '-';
//     }
//   },
//   { field: 'cantidad', headerName: 'Cantidad', type: 'number', width: 110 },
//   { field: 'precio', headerName: 'Precio', type: 'number', width: 130 },
//   { field: 'estado', headerName: 'Estado', width: 130 },
// ];

// const initialFormState = {
//   id: '',
//   productoPresentacion: null,
//   cantidad: '',
//   precio: '',
//   estado: '',
// };

/**
 * Componente GridKardexNuevo.
 * @module GridKardexNuevo.jsx
 * @component
 * @returns {JSX.Element}
 */
// export default function GridKardexNuevo({ kardexItems, setKardexItems }) {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState(initialFormState);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setFormData(initialFormState);
//     setSelectedRow(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleAdd = () => {
//     setIsEditMode(false);
//     handleOpen();
//   };

//   const handleEdit = () => {
//     if (selectedRow) {
//       setIsEditMode(true);
//       setFormData(selectedRow);
//       handleOpen();
//     } else {
//       alert("Por favor, selecciona una fila para actualizar");
//     }
//   };

//   const handleAddItem = async (item) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Token de autenticación no encontrado');
//         return;
//       }
//       await axios.post(`${SiteProps.urlbasev1}/kardexItem`, item, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setKardexItems((prevItems) => [...prevItems, item]);
//     } catch (error) {
//       console.error('Error al agregar item al Kardex:', error);
//       if (error.response && error.response.status === 403) {
//         console.error('Permiso denegado. Verifica el token o permisos en el backend.');
//       }
//     }
//   };
  

//   const handleUpdateItem = async (item) => {
//     try {
//       const response = await axios.put(`${SiteProps.urlbasev1}/kardexItem/${item.kardexID}`, item, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setKardexItems((prevItems) =>
//         prevItems.map((i) => (i.kardexID === item.kardexID ? response.data : i))
//       );
//     } catch (error) {
//       console.error('Error al actualizar item del Kardex:', error);
//     }
//   };

//   const handleSubmit = () => {
//     // Verificar si kardexID está definido
//     if (!formData.kardexID) {
//       console.error("kardexID no está definido");
//       return;
//     }
  
//     const kardexItemData = {
//       kardexID: formData.kardexID,                    // Nombre exacto esperado por el backend
//       productoPresentacionID: formData.productoPresentacion?.id, // Nombre exacto esperado por el backend
//       cantidad: formData.cantidad,
//       precio: formData.precio,
//       estado: formData.estado
//     };
  
//     if (isEditMode) {
//       handleUpdateItem(kardexItemData);
//     } else {
//       handleAddItem(kardexItemData);
//     }
//     handleClose();
//   };
  

//   const handleDelete = () => {
//     if (selectedRow) {
//       if (window.confirm('¿Estás seguro que deseas eliminar este item?')) {
//         handleDeleteItem(selectedRow);
//       }
//     } else {
//       alert("Por favor, selecciona una fila para eliminar");
//     }
//   };

//   return (
//     <Box sx={{ height: 400, width: '100%', mt: 2 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mr: 1 }}>
//           ADD
//         </Button>
//         <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 1 }}>
//           UPDATE
//         </Button>
//         <Button variant="contained" color="primary" onClick={handleDelete}>
//           DELETE
//         </Button>
//       </Box>

//       <DataGrid
//         rows={kardexItems}
//         columns={columns}
//         pageSize={5}
//         rowsPerPageOptions={[5]}
//         checkboxSelection
//         getRowId={(row) => row.productoPresentacionID || row.id}
//         onRowSelectionModelChange={(selectionModel) => {
//           const selectedID = selectionModel[0];
//           const selected = kardexItems.find(item => item.productoPresentacionID === selectedID);
//           setSelectedRow(selected);
//         }}
//       />

//       <Modal open={open} onClose={handleClose}>
//         <Box sx={{
//           position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
//         }}>
//           <h2>{isEditMode ? 'Actualizar Item' : 'Añadir Item'}</h2>
//           <form>
//             <ProductoPresentacion
//               value={formData.productoPresentacion}
//               setValue={(newValue) => {
//                 setFormData((prevState) => ({
//                   ...prevState,
//                   productoPresentacion: newValue,
//                   kardexID: newValue ? newValue.kardexID : undefined // Asigna automáticamente kardexID
//                 }));
//               }}
//             />


//             <TextField
//               fullWidth
//               margin="normal"
//               label="Cantidad"
//               name="cantidad"
//               type="number"
//               value={formData.cantidad}
//               onChange={handleInputChange}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Precio"
//               name="precio"
//               type="number"
//               value={formData.precio}
//               onChange={handleInputChange}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Estado</InputLabel>
//               <Select
//                 name="estado"
//                 value={formData.estado}
//                 onChange={handleInputChange}
//               >
//                 <MenuItem value="Disponible">Disponible</MenuItem>
//                 <MenuItem value="No_Disponible">No Disponible</MenuItem>
//               </Select>
//             </FormControl>
//             <Box textAlign="center" mt={2}>
//               <Button variant="contained" color="primary" onClick={handleSubmit}>
//                 {isEditMode ? 'Actualizar' : 'Añadir'}
//               </Button>
//             </Box>
//           </form>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }






/**
 * GridKardexNuevo - Componente para la gestión de los items del Kardex.
 * 
 * Este componente permite al usuario visualizar, agregar, actualizar y eliminar items de Kardex en una grilla.
 * Proporciona un modal para la entrada y edición de datos, además de validación automática para asignar un `kardexID`.
 * 
 * @module GridKardexNuevo
 */

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Modal, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProductoPresentacion from './ProductoPresentacion';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

// Columnas de la grilla para los items de Kardex
const columns = [
  { field: 'id', headerName: 'ID', width: 90, hide: true },
  {
    field: 'productoPresentacion',
    headerName: 'Producto Presentación',
    width: 200,
    renderCell: (params) => {
      const producto = params.row.productoPresentacion;
      return producto
        ? `${producto.nombreProducto || ''} - ${producto.nombrePresentacion || ''}`
        : '-';
    }
  },
  { field: 'cantidad', headerName: 'Cantidad', type: 'number', width: 110 },
  { field: 'precio', headerName: 'Precio', type: 'number', width: 130 },
  { field: 'estado', headerName: 'Estado', width: 130 },
];

// Estado inicial del formulario
const initialFormState = {
  id: '',
  productoPresentacion: null,
  cantidad: '',
  precio: '',
  estado: '',
  kardexID: ''
};

/**
 * Componente para gestionar y visualizar items en el Kardex.
 * 
 * @function GridKardexNuevo
 * @param {Object} props - Propiedades del componente, incluyendo `kardexItems` (items actuales en Kardex) y `setKardexItems` (función para actualizar el estado de items).
 * @returns {JSX.Element} Componente de grilla con funcionalidades de CRUD para items de Kardex.
 */
export default function GridKardexNuevo({ kardexItems, setKardexItems }) {
  const [open, setOpen] = useState(false); // Controla la apertura del modal
  const [formData, setFormData] = useState(initialFormState); // Datos del formulario
  const [isEditMode, setIsEditMode] = useState(false); // Controla el modo de edición
  const [selectedRow, setSelectedRow] = useState(null); // Fila seleccionada en la grilla
  const [kardexOptions, setKardexOptions] = useState([]); // Opciones disponibles de Kardex

  // Hook para obtener opciones de Kardex desde el backend
  useEffect(() => {
    const fetchKardexOptions = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/kardexItem`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const kardexItems = response.data._embedded.kardexItemDTOList;
        const kardexOptionsList = kardexItems
          .filter(item => item.productoPresentacionID)
          .map((item) => ({
            id: item.kardexID,
            productoPresentacionID: item.productoPresentacionID,
          }));
        setKardexOptions(kardexOptionsList);
      } catch (error) {
        console.error('Error al cargar opciones de Kardex:', error);
        setKardexOptions([]);
      }
    };
    fetchKardexOptions();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
    setSelectedRow(null);
  };

  /**
   * Maneja los cambios en los campos del formulario.
   * @function handleInputChange
   * @param {Object} e - Evento del input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    handleOpen();
  };

  /**
   * Activa el modo de edición y carga los datos de la fila seleccionada en el formulario.
   * @function handleEdit
   */
  const handleEdit = () => {
    if (selectedRow) {
      setIsEditMode(true);
      setFormData(selectedRow);
      handleOpen();
    } else {
      alert("Por favor, selecciona una fila para actualizar");
    }
  };

  /**
   * Agrega un nuevo item a la lista de items en el Kardex.
   * @async
   * @function handleAddItem
   * @param {Object} item - Objeto del item a agregar.
   */
  const handleAddItem = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${SiteProps.urlbasev1}/kardexItem`, item, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setKardexItems((prevItems) => [...prevItems, item]);
    } catch (error) {
      console.error('Error al agregar item al Kardex:', error);
    }
  };

  /**
   * Actualiza un item existente en la lista de items en el Kardex.
   * @async
   * @function handleUpdateItem
   * @param {Object} item - Objeto del item a actualizar.
   */
  const handleUpdateItem = async (item) => {
    try {
      const response = await axios.put(`${SiteProps.urlbasev1}/kardexItem/${item.kardexID}`, item, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setKardexItems((prevItems) =>
        prevItems.map((i) => (i.kardexID === item.kardexID ? response.data : i))
      );
    } catch (error) {
      console.error('Error al actualizar item del Kardex:', error);
    }
  };

  /**
   * Envía los datos del formulario para agregar o actualizar un item de Kardex.
   * @function handleSubmit
   */
  const handleSubmit = () => {
    if (!formData.kardexID) {
      alert("Error: kardexID no asignado automáticamente.");
      return;
    }

    const kardexItemData = {
      kardexID: formData.kardexID,
      productoPresentacionID: formData.productoPresentacion?.id,
      cantidad: formData.cantidad,
      precio: formData.precio,
      estado: formData.estado
    };

    if (isEditMode) {
      handleUpdateItem(kardexItemData);
    } else {
      handleAddItem(kardexItemData);
    }
    handleClose();
  };

  /**
   * Elimina un item seleccionado de la lista de items en el Kardex.
   * @async
   * @function handleDelete
   * @param {Object} item - Item a eliminar.
   */
  const handleDelete = async (item) => {
    try {
      const response = await axios.delete(`${SiteProps.urlbasev1}/kardexItem/${item.kardexID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        setKardexItems((prevItems) =>
          prevItems.filter((i) => i.kardexID !== item.kardexID)
        );
      }
    } catch (error) {
      console.error('Error al eliminar item del Kardex:', error);
    }
  };

  return (
    <Box sx={{ height: 400, width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mr: 1 }}>
          ADD
        </Button>
        <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 1 }}>
          UPDATE
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleDelete(selectedRow)}>
          DELETE
        </Button>
      </Box>

      <DataGrid
        rows={kardexItems}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.productoPresentacionID || row.id}
        onRowSelectionModelChange={(selectionModel) => {
          const selectedID = selectionModel[0];
          const selected = kardexItems.find(item => item.productoPresentacionID === selectedID);
          setSelectedRow(selected);
        }}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
        }}>
          <h2>{isEditMode ? 'Actualizar Item' : 'Añadir Item'}</h2>
          <form>
            <ProductoPresentacion
              value={formData.productoPresentacion}
              setValue={(newValue) => {
                setFormData((prevState) => ({
                  ...prevState,
                  productoPresentacion: newValue
                }));
              
                console.log("Producto Presentación seleccionado:", newValue);
                console.log("Opciones de Kardex disponibles:", kardexOptions);
              
                const matchingKardex = kardexOptions.find(
                  (kardex) => kardex.productoPresentacionID === newValue?.id
                );
                
                if (matchingKardex) {
                  setFormData((prevState) => ({
                    ...prevState,
                    kardexID: matchingKardex.id
                  }));
                  console.log("Kardex ID asignado automáticamente:", matchingKardex.id);
                } else {
                  console.warn("No se encontró un kardexID para el productoPresentacion seleccionado.");
                  setFormData((prevState) => ({ ...prevState, kardexID: '' }));
                }
              }}
                       
            />

            <TextField
              fullWidth
              margin="normal"
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <MenuItem value="Disponible">Disponible</MenuItem>
                <MenuItem value="No_Disponible">No Disponible</MenuItem>
              </Select>
            </FormControl>
            <Box textAlign="center" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {isEditMode ? 'Actualizar' : 'Añadir'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
