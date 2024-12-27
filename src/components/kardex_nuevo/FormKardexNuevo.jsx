// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { SiteProps } from '../dashboard/SiteProps';
// import GridKardexNuevo from './GridKardexNuevo';

// /**
//  * @function FormKardexNuevo
//  * @description Formulario principal para la creación de una entrada en el Kardex.
//  * @param {Object} props - Propiedades del componente, incluyendo setMessage para mostrar mensajes de estado.
//  * @returns {JSX.Element} Componente de formulario con campos dependientes y grilla para gestionar items de Kardex.
//  */
// export default function FormKardexNuevo(props) {
//   // Definición de estados para almacenar datos de opciones de selección y del formulario
//   const [sedes, setSedes] = useState([]); 
//   const [almacenes, setAlmacenes] = useState([]); 
//   const [bloques, setBloques] = useState([]);
//   const [espacios, setEspacios] = useState([]); 
//   const [producciones, setProducciones] = useState([]); 
//   const [tipoMovimientos, setTipoMovimientos] = useState([]); 
//   const [estados, setEstados] = useState([]); 
//   const [kardexItems, setKardexItems] = useState([]); 
//   const [formData, setFormData] = useState({
//     sedeId: '',
//     almacenID: '',
//     bloqueID: '',
//     espacioID: '',
//     produccionID: '',
//     tipoMovimientoID: '',
//     descripcion: '',
//     estado: '',
//     fechaHora: new Date().toISOString().substring(0, 16),
//   });

//   // Hook para obtener las sedes al cargar el componente
//   useEffect(() => {
//     const fetchSedes = async () => {
//       try {
//         const sedeResponse = await axios.get(`${SiteProps.urlbasev1}/sede/short`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setSedes(sedeResponse.data);
//       } catch (error) {
//         console.error('Error fetching sedes:', error);
//         props.setMessage({ open: true, severity: 'error', text: 'Error al obtener sedes' });
//       }
//     };
//     fetchSedes();
//   }, []);

//   // Hook para obtener almacenes en base a la sede seleccionada
//   useEffect(() => {
//     if (formData.sedeId) {
//       const fetchAlmacenes = async () => {
//         try {
//           const almacenResponse = await axios.get(`${SiteProps.urlbasev1}/almacenes/short/${formData.sedeId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           });
//           setAlmacenes(almacenResponse.data.map(almacen => ({
//             id: almacen.Id, nombre: almacen.nombre
//           })));
//         } catch (error) {
//           console.error('Error fetching almacenes:', error);
//           props.setMessage({ open: true, severity: 'error', text: 'Error al obtener almacenes' });
//         }
//       };
//       fetchAlmacenes();
//     } else {
//       setAlmacenes([]);
//       setBloques([]);
//       setEspacios([]);
//       setProducciones([]);
//     }
//   }, [formData.sedeId]);

//   // Hook para obtener bloques en base a la sede seleccionada
//   useEffect(() => {
//     if (formData.sedeId) {
//       const fetchBloques = async () => {
//         try {
//           const bloqueResponse = await axios.get(`${SiteProps.urlbasev1}/bloques/short/${formData.sedeId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           });
//           setBloques(bloqueResponse.data);
//         } catch (error) {
//           console.error('Error fetching bloques:', error);
//           props.setMessage({ open: true, severity: 'error', text: 'Error al obtener bloques' });
//         }
//       };
//       fetchBloques();
//     } else {
//       setBloques([]);
//       setEspacios([]);
//       setProducciones([]);
//     }
//   }, [formData.sedeId]);

//   // Hook para obtener espacios en base al bloque seleccionado
//   useEffect(() => {
//     if (formData.bloqueID) {
//       const fetchEspacios = async () => {
//         try {
//           const espacioResponse = await axios.get(`${SiteProps.urlbasev1}/espacios/short/${formData.bloqueID}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           });
//           setEspacios(espacioResponse.data);
//         } catch (error) {
//           console.error('Error fetching espacios:', error);
//           props.setMessage({ open: true, severity: 'error', text: 'Error al obtener espacios' });
//         }
//       };
//       fetchEspacios();
//     } else {
//       setEspacios([]);
//       setProducciones([]);
//     }
//   }, [formData.bloqueID]);

//   // Hook para obtener producciones en base al espacio seleccionado
//   useEffect(() => {
//     if (formData.espacioID) {
//       const fetchProducciones = async () => {
//         try {
//           const produccionResponse = await axios.get(`${SiteProps.urlbasev1}/producciones/short/${formData.espacioID}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           });
//           setProducciones(produccionResponse.data);
//         } catch (error) {
//           console.error('Error fetching producciones:', error);
//           props.setMessage({ open: true, severity: 'error', text: 'Error al obtener producciones' });
//         }
//       };
//       fetchProducciones();
//     } else {
//       setProducciones([]);
//     }
//   }, [formData.espacioID]);

//   // Hook para obtener tipos de movimientos y estados
//   useEffect(() => {
//     const fetchTipoMovimientos = async () => {
//       try {
//         const tipoMovimientoResponse = await axios.get(`${SiteProps.urlbasev1}/tipoMovimiento/short`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setTipoMovimientos(tipoMovimientoResponse.data);
//       } catch (error) {
//         console.error('Error fetching tipoMovimientos:', error);
//         props.setMessage({ open: true, severity: 'error', text: 'Error al obtener tipo de movimientos' });
//       }
//     };

//     const fetchEstados = async () => {
//       try {
//         const estadoResponse = await axios.get(`${SiteProps.urlbasev1}/estados/short`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setEstados(estadoResponse.data);
//       } catch (error) {
//         console.error('Error fetching estados:', error);
//         props.setMessage({ open: true, severity: 'error', text: 'Error al obtener estados' });
//       }
//     };

//     fetchTipoMovimientos();
//     fetchEstados();
//   }, []);

//   /**
//    * Maneja los cambios en los campos del formulario.
//    * @function handleInputChange
//    * @param {Object} e - Evento del input.
//    */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: name === 'fechaHora' ? value : parseInt(value) || value,
//     }));
//   };

//   /**
//    * Agrega un nuevo item al Kardex.
//    * @function handleAddItem
//    * @param {Object} item - Objeto del item a agregar.
//    */
//   const handleAddItem = (item) => {
//     setKardexItems((prevItems) => [...prevItems, item]);
//   };

//   /**
//    * Actualiza un item existente en el Kardex.
//    * @function handleUpdateItem
//    * @param {Object} item - Objeto del item a actualizar.
//    */
//   const handleUpdateItem = (item) => {
//     setKardexItems((prevItems) =>
//       prevItems.map((i) => (i.id === item.id ? item : i))
//     );
//   };

//   /**
//    * Elimina un item del Kardex.
//    * @function handleDeleteItem
//    * @param {Object} item - Objeto del item a eliminar.
//    */
//   const handleDeleteItem = (item) => {
//     setKardexItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
//   };

//   /**
//    * Maneja el envío del formulario.
//    * @async
//    * @function handleSubmit
//    * @param {Object} e - Evento del formulario.
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Datos enviados:', formData); // Para depuración
//       await axios.post(`${SiteProps.urlbasev1}/kardex`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           "Content-Type": "application/json"
//         }
//       });
//       props.setMessage({ open: true, severity: 'success', text: 'Kardex guardado con éxito' });
//     } catch (error) {
//       console.error('Error al guardar kardex:', error);
//       props.setMessage({ open: true, severity: 'error', text: 'Error al guardar el kardex' });
//     }
//   };

//   return (
//     <Box sx={{ marginLeft: '80px', paddingRight: '10px', mt: 50 }}>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Sede</InputLabel>
//               <Select name="sedeId" value={formData.sedeId || ''} onChange={handleInputChange} required>
//                 {sedes.map((sede) => (
//                   <MenuItem key={sede.id} value={sede.id}>{sede.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Almacén</InputLabel>
//               <Select name="almacenID" value={formData.almacenID || ''} onChange={handleInputChange} required>
//                 {almacenes.map((almacen) => (
//                   <MenuItem key={almacen.id} value={almacen.id}>{almacen.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Bloque</InputLabel>
//               <Select name="bloqueID" value={formData.bloqueID || ''} onChange={handleInputChange}>
//                 {bloques.map((bloque) => (
//                   <MenuItem key={bloque.id} value={bloque.id}>{bloque.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Espacio</InputLabel>
//               <Select name="espacioID" value={formData.espacioID || ''} onChange={handleInputChange} required>
//                 {espacios.map((espacio) => (
//                   <MenuItem key={espacio.id} value={espacio.id}>{espacio.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Producción</InputLabel>
//               <Select name="produccionID" value={formData.produccionID || ''} onChange={handleInputChange} required>
//                 {producciones.map((produccion) => (
//                   <MenuItem key={produccion.id} value={produccion.id}>{produccion.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Tipo de Movimiento</InputLabel>
//               <Select name="tipoMovimientoID" value={formData.tipoMovimientoID || ''} onChange={handleInputChange} required>
//                 {tipoMovimientos.map((tipo) => (
//                   <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               name="descripcion"
//               label="Descripción"
//               fullWidth
//               value={formData.descripcion}
//               onChange={handleInputChange}
//               required
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Estado</InputLabel>
//               <Select name="estado" value={formData.estado || ''} onChange={handleInputChange} required>
//                 {estados.map((estado) => (
//                   <MenuItem key={estado.id} value={estado.id}>{estado.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               name="fechaHora"
//               label="Fecha y Hora"
//               type="datetime-local"
//               fullWidth
//               value={formData.fechaHora}
//               onChange={handleInputChange}
//               required
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <Box textAlign="center">
//               <Button type="submit" variant="contained" color="primary">Guardar Kardex</Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </form>

//       <GridKardexNuevo 
//         kardexItems={kardexItems}
//         handleAddItem={handleAddItem}
//         handleUpdateItem={handleUpdateItem}
//         handleDeleteItem={handleDeleteItem}
//       />
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";
import GridKardexNuevo from "./GridKardexNuevo";

export default function FormKardexNuevo(props) {
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [tipoMovimientos, setTipoMovimientos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [kardexItems, setKardexItems] = useState([]);
  const [formData, setFormData] = useState({
    sedeId: "",
    almacenID: "",
    bloqueID: "",
    espacioID: "",
    produccionID: "",
    tipoMovimientoID: "",
    descripcion: "",
    estado: "",
    fechaHora: new Date().toISOString().substring(0, 16),
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Agregar un nuevo item a la lista
  const handleAddItem = (item) => {
    setKardexItems((prevItems) => [...prevItems, item]);
  };

  // Actualizar un item existente
  const handleUpdateItem = (item) => {
    setKardexItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? item : i))
    );
  };

  // Eliminar un item por ID
  const handleDeleteItem = (id) => {
    setKardexItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Validar los datos del formulario
  const validateFormData = () => {
    const requiredFields = [
      "sedeId",
      "almacenID",
      "bloqueID",
      "espacioID",
      "produccionID",
      "tipoMovimientoID",
      "descripcion",
      "estado",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        props.setMessage({
          open: true,
          severity: "error",
          text: `El campo ${field} es obligatorio.`,
        });
        return false;
      }
    }
    return true;
  };

  // Transformar datos antes de enviarlos al backend
const transformFormData = () => {
  const payload = {
    fechaHora: formData.fechaHora, // Debe estar en formato ISO (YYYY-MM-DDTHH:mm:ss)
    almacen: parseInt(formData.almacenID, 10), // Convertir a entero
    produccion: parseInt(formData.produccionID, 10), // Convertir a entero
    tipoMovimiento: parseInt(formData.tipoMovimientoID, 10), // Convertir a entero
    descripcion: formData.descripcion, // Mantener como cadena
    estado: parseInt(formData.estado, 10), // Convertir a entero
  };

  console.log("Payload transformado:", payload); // Verifica el formato en la consola
  return payload;
};

// Manejar envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateFormData()) return;

  const payload = transformFormData();
  console.log("Payload enviado al backend:", payload);

  try {
    const response = await axios.post(`${SiteProps.urlbasev1}/kardex`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  
    console.log("Respuesta del backend:", response.data); // Verifica los datos que devuelve
    props.setMessage({
      open: true,
      severity: "success",
      text: "Kardex guardado con éxito",
    });
  } catch (error) {
    console.error("Error al guardar kardex:", error.response?.data || error.message);
    props.setMessage({
      open: true,
      severity: "error",
      text: `Error al guardar kardex: ${
        error.response?.data?.message || "Error desconocido"
      }`,
    });
  }
  
};

  // Obtener datos iniciales
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al obtener sedes",
        });
      }
    };
    fetchSedes();
  }, []);

  useEffect(() => {
    if (formData.sedeId) {
      const fetchAlmacenes = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/almacen/minimal/sede/${formData.sedeId}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setAlmacenes(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener almacenes",
          });
        }
      };
      fetchAlmacenes();
    } else {
      setAlmacenes([]);
    }
  }, [formData.sedeId]);

  useEffect(() => {
    if (formData.sedeId) {
      const fetchBloques = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/bloque/minimal/sede/${formData.sedeId}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setBloques(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener bloques",
          });
        }
      };
      fetchBloques();
    } else {
      setBloques([]);
    }
  }, [formData.sedeId]);

  useEffect(() => {
    if (formData.bloqueID) {
      const fetchEspacios = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/espacio/minimal/bloque/${formData.bloqueID}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setEspacios(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener espacios",
          });
        }
      };
      fetchEspacios();
    } else {
      setEspacios([]);
    }
  }, [formData.bloqueID]);


  useEffect(() => {
    if (formData.espacioID) {
      const fetchProducciones = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/producciones/short/${formData.espacioID}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setProducciones(response.data || []);
        } catch (error) {
          props.setMessage({
            open: true,
            severity: "error",
            text: "Error al obtener producciones",
          });
        }
      };
      fetchProducciones();
    } else {
      setProducciones([]);
    }
  }, [formData.espacioID]);


  useEffect(() => {
    const fetchTipoMovimientos = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/tipo_movimiento/minimal`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setTipoMovimientos(response.data || []);
      } catch (error) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al obtener tipo de movimientos",
        });
      }
    };

    const fetchEstados = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/estados`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEstados(response.data || []);
      } catch (error) {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al obtener estados",
        });
      }
    };

    fetchTipoMovimientos();
    fetchEstados();
  }, []);



  return (
    <Box sx={{ marginLeft: "80px", paddingRight: "10px", mt: 50 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sede</InputLabel>
              <Select
                name="sedeId"
                value={formData.sedeId || ""}
                onChange={handleInputChange}
                required
              >
                {sedes.map((sede) => (
                  <MenuItem key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Almacén</InputLabel>
              <Select
                name="almacenID"
                value={formData.almacenID || ""}
                onChange={handleInputChange}
                required
              >
                {almacenes.map((almacen) => (
                  <MenuItem key={almacen.id} value={almacen.id}>
                    {almacen.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Bloque</InputLabel>
              <Select
                name="bloqueID"
                value={formData.bloqueID || ""}
                onChange={handleInputChange}
              >
                {bloques.map((bloque) => (
                  <MenuItem key={bloque.id} value={bloque.id}>
                    {bloque.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Espacio</InputLabel>
              <Select
                name="espacioID"
                value={formData.espacioID || ""}
                onChange={handleInputChange}
                required
              >
                {espacios.map((espacio) => (
                  <MenuItem key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Producción</InputLabel>
              <Select
                name="produccionID"
                value={formData.produccionID}
                onChange={handleInputChange}
                required
              >
                {Array.isArray(producciones) &&
                  producciones.map((produccion) => (
                    <MenuItem key={produccion.id} value={produccion.id}>
                      {produccion.nombre}
                    </MenuItem>
                  ))}
              </Select>

            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select
                name="tipoMovimientoID"
                value={formData.tipoMovimientoID || ""}
                onChange={handleInputChange}
                required
              >
                {tipoMovimientos.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="descripcion"
              label="Descripción"
              fullWidth
              value={formData.descripcion}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado || ""}
                onChange={handleInputChange}
                required
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="fechaHora"
              label="Fecha y Hora"
              type="datetime-local"
              fullWidth
              value={formData.fechaHora}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button type="submit" variant="contained" color="primary">
                Guardar Kardex
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "10px" }}
              >
                Generar Reporte
              </Button>
            </Box>
          </Grid>
        </Grid>
        
      </form>


      {/* GridKardexNuevo */}
      <GridKardexNuevo
        kardexItems={kardexItems}
        handleAddItem={handleAddItem}
        handleUpdateItem={handleUpdateItem}
        handleDeleteItem={handleDeleteItem}
      />
    </Box>
  );
}
