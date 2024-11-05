// import React, { useState, useEffect } from 'react'; 
// import axios from 'axios';
// import { Box, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { SiteProps } from '../dashboard/SiteProps';
// import GridKardexNuevo from './GridKardexNuevo';

// export default function FormKardexNuevo(props) {
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
//     almacenId: '',
//     bloqueId: '',
//     espacioId: '',
//     produccionId: '',
//     tipoMovimientoId: '',
//     descripcion: '',
//     estadoId: '',
//     fechaHora: new Date().toISOString().substring(0, 16),
//   });

//   // Fetch sedes
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

//   // Fetch almacenes based on sedeId
//   useEffect(() => {
//     if (formData.sedeId) {
//       const fetchAlmacenes = async () => {
//         try {
//           const almacenResponse = await axios.get(`${SiteProps.urlbasev1}/almacenes/short/${formData.sedeId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           });
//           const almacenesTransformados = almacenResponse.data.map(almacen => ({
//             id: almacen.Id, nombre: almacen.nombre
//           }));
//           setAlmacenes(almacenesTransformados);
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

//   // // Fetch bloques based on sedeId
//   // useEffect(() => {
//   //   if (formData.sedeId) {
//   //     const fetchBloques = async () => {
//   //       try {
//   //         const bloqueResponse = await axios.get(`${SiteProps.urlbasev1}/bloques/short/${formData.sedeId}`, {
//   //           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//   //         });
//   //         setBloques(bloqueResponse.data);
//   //       } catch (error) {
//   //         console.error('Error fetching bloques:', error);
//   //         props.setMessage({ open: true, severity: 'error', text: 'Error al obtener bloques' });
//   //       }
//   //     };
//   //     fetchBloques();
//   //   } else {
//   //     setBloques([]);
//   //     setEspacios([]);
//   //     setProducciones([]);
//   //   }
//   // }, [formData.sedeId]);

//   // // Fetch espacios based on bloqueId
//   // useEffect(() => {
//   //   if (formData.bloqueId) {
//   //     const fetchEspacios = async () => {
//   //       try {
//   //         const espacioResponse = await axios.get(`${SiteProps.urlbasev1}/espacios/short/${formData.bloqueId}`, {
//   //           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//   //         });
//   //         setEspacios(espacioResponse.data);
//   //       } catch (error) {
//   //         console.error('Error fetching espacios:', error);
//   //         props.setMessage({ open: true, severity: 'error', text: 'Error al obtener espacios' });
//   //       }
//   //     };
//   //     fetchEspacios();
//   //   } else {
//   //     setEspacios([]);
//   //     setProducciones([]);
//   //   }
//   // }, [formData.bloqueId]);

//     // Fetch espacios based on sedeId
//     useEffect(() => {
//       if (formData.sedeId) {
//         const fetchEspacios = async () => {
//           try {
//             const espacioResponse = await axios.get(`${SiteProps.urlbasev1}/espacios/short/${formData.sedeId}`, {
//               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             setEspacios(espacioResponse.data);
//           } catch (error) {
//             console.error('Error fetching espacios:', error);
//             props.setMessage({ open: true, severity: 'error', text: 'Error al obtener espacios' });
//           }
//         };
//         fetchEspacios();
//       } else {
//         setEspacios([]);
//         setProducciones([]);
//       }
//     }, [formData.sedeId]);

//   // Fetch producciones based on espacioId
//   useEffect(() => {
//     if (formData.espacioId) {
//       const fetchProducciones = async () => {
//         try {
//           const produccionResponse = await axios.get(`${SiteProps.urlbasev1}/producciones/short/${formData.espacioId}`, {
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
//   }, [formData.espacioId]);

//   // Fetch tipoMovimientos y estados
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

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: name === 'fechaHora' ? value : parseInt(value) || value, // Asegurar que IDs sean enteros y otros valores se mantengan en su formato correcto
//     }));
//   };

//   const handleAddItem = (item) => {
//     setKardexItems((prevItems) => [...prevItems, item]);
//   };

//   const handleUpdateItem = (item) => {
//     setKardexItems((prevItems) =>
//       prevItems.map((i) => (i.id === item.id ? item : i))
//     );
//   };

//   const handleDeleteItem = (item) => {
//     setKardexItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
//   };

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
//               <Select name="almacenId" value={formData.almacenId || ''} onChange={handleInputChange} required>
//                 {almacenes.map((almacen) => (
//                   <MenuItem key={almacen.id} value={almacen.id}>{almacen.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Bloque</InputLabel>
//               <Select name="bloqueId" value={formData.bloqueId || ''} onChange={handleInputChange} required>
//                 {bloques.map((bloque) => (
//                   <MenuItem key={bloque.id} value={bloque.id}>{bloque.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid> */}

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Espacio</InputLabel>
//               <Select name="espacioId" value={formData.espacioId || ''} onChange={handleInputChange} required>
//                 {espacios.map((espacio) => (
//                   <MenuItem key={espacio.id} value={espacio.id}>{espacio.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Producción</InputLabel>
//               <Select name="produccionId" value={formData.produccionId || ''} onChange={handleInputChange} required>
//                 {producciones.map((produccion) => (
//                   <MenuItem key={produccion.id} value={produccion.id}>{produccion.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Tipo de Movimiento</InputLabel>
//               <Select name="tipoMovimientoId" value={formData.tipoMovimientoId || ''} onChange={handleInputChange} required>
//                 {tipoMovimientos.map((tipo) => (
//                   <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12}>
//             <TextField name="descripcion" label="Descripción" fullWidth value={formData.descripcion} onChange={handleInputChange} required />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Estado</InputLabel>
//               <Select name="estadoId" value={formData.estadoId || ''} onChange={handleInputChange} required>
//                 {estados.map((estado) => (
//                   <MenuItem key={estado.id} value={estado.id}>{estado.nombre}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField name="fechaHora" label="Fecha y Hora" type="datetime-local" fullWidth value={formData.fechaHora} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
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


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import GridKardexNuevo from './GridKardexNuevo';

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
    sedeId: '',           // Nombre de campo mantenido según tu estructura original
    almacenID: '',         // Coincide con el nombre que espera el backend
    bloqueID: '',
    espacioID: '',
    produccionID: '',
    tipoMovimientoID: '',
    descripcion: '',
    estado: '',
    fechaHora: new Date().toISOString().substring(0, 16),
  });

  // Fetch sedes
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const sedeResponse = await axios.get(`${SiteProps.urlbasev1}/sede/short`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSedes(sedeResponse.data);
      } catch (error) {
        console.error('Error fetching sedes:', error);
        props.setMessage({ open: true, severity: 'error', text: 'Error al obtener sedes' });
      }
    };
    fetchSedes();
  }, []);

  // Fetch almacenes basado en sedeId
  useEffect(() => {
    if (formData.sedeId) {
      const fetchAlmacenes = async () => {
        try {
          const almacenResponse = await axios.get(`${SiteProps.urlbasev1}/almacenes/short/${formData.sedeId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setAlmacenes(almacenResponse.data.map(almacen => ({
            id: almacen.Id, nombre: almacen.nombre
          })));
        } catch (error) {
          console.error('Error fetching almacenes:', error);
          props.setMessage({ open: true, severity: 'error', text: 'Error al obtener almacenes' });
        }
      };
      fetchAlmacenes();
    } else {
      setAlmacenes([]);
      setBloques([]);
      setEspacios([]);
      setProducciones([]);
    }
  }, [formData.sedeId]);

  // Fetch bloques basado en sedeId
  useEffect(() => {
    if (formData.sedeId) {
      const fetchBloques = async () => {
        try {
          const bloqueResponse = await axios.get(`${SiteProps.urlbasev1}/bloques/short/${formData.sedeId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setBloques(bloqueResponse.data);
        } catch (error) {
          console.error('Error fetching bloques:', error);
          props.setMessage({ open: true, severity: 'error', text: 'Error al obtener bloques' });
        }
      };
      fetchBloques();
    } else {
      setBloques([]);
      setEspacios([]);
      setProducciones([]);
    }
  }, [formData.sedeId]);

  // Fetch espacios basado en bloqueID
  useEffect(() => {
    if (formData.bloqueID) {
      const fetchEspacios = async () => {
        try {
          const espacioResponse = await axios.get(`${SiteProps.urlbasev1}/espacios/short/${formData.bloqueID}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setEspacios(espacioResponse.data);
        } catch (error) {
          console.error('Error fetching espacios:', error);
          props.setMessage({ open: true, severity: 'error', text: 'Error al obtener espacios' });
        }
      };
      fetchEspacios();
    } else {
      setEspacios([]);
      setProducciones([]);
    }
  }, [formData.bloqueID]);

  // Fetch producciones basado en espacioID
  useEffect(() => {
    if (formData.espacioID) {
      const fetchProducciones = async () => {
        try {
          const produccionResponse = await axios.get(`${SiteProps.urlbasev1}/producciones/short/${formData.espacioID}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setProducciones(produccionResponse.data);
        } catch (error) {
          console.error('Error fetching producciones:', error);
          props.setMessage({ open: true, severity: 'error', text: 'Error al obtener producciones' });
        }
      };
      fetchProducciones();
    } else {
      setProducciones([]);
    }
  }, [formData.espacioID]);

  // Fetch tipoMovimientos y estados
  useEffect(() => {
    const fetchTipoMovimientos = async () => {
      try {
        const tipoMovimientoResponse = await axios.get(`${SiteProps.urlbasev1}/tipoMovimiento/short`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTipoMovimientos(tipoMovimientoResponse.data);
      } catch (error) {
        console.error('Error fetching tipoMovimientos:', error);
        props.setMessage({ open: true, severity: 'error', text: 'Error al obtener tipo de movimientos' });
      }
    };

    const fetchEstados = async () => {
      try {
        const estadoResponse = await axios.get(`${SiteProps.urlbasev1}/estados/short`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEstados(estadoResponse.data);
      } catch (error) {
        console.error('Error fetching estados:', error);
        props.setMessage({ open: true, severity: 'error', text: 'Error al obtener estados' });
      }
    };

    fetchTipoMovimientos();
    fetchEstados();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'fechaHora' ? value : parseInt(value) || value, // Convierte a entero si es ID
    }));
  };

  // Handlers para agregar, actualizar y eliminar items
  const handleAddItem = (item) => {
    setKardexItems((prevItems) => [...prevItems, item]);
  };

  const handleUpdateItem = (item) => {
    setKardexItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? item : i))
    );
  };

  const handleDeleteItem = (item) => {
    setKardexItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Datos enviados:', formData); // Para depuración
      await axios.post(`${SiteProps.urlbasev1}/kardex`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });
      props.setMessage({ open: true, severity: 'success', text: 'Kardex guardado con éxito' });
    } catch (error) {
      console.error('Error al guardar kardex:', error);
      props.setMessage({ open: true, severity: 'error', text: 'Error al guardar el kardex' });
    }
  };

  return (
    <Box sx={{ marginLeft: '80px', paddingRight: '10px', mt: 50 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sede</InputLabel>
              <Select name="sedeId" value={formData.sedeId || ''} onChange={handleInputChange} required>
                {sedes.map((sede) => (
                  <MenuItem key={sede.id} value={sede.id}>{sede.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Almacén</InputLabel>
              <Select name="almacenID" value={formData.almacenID || ''} onChange={handleInputChange} required>
                {almacenes.map((almacen) => (
                  <MenuItem key={almacen.id} value={almacen.id}>{almacen.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Bloque</InputLabel>
              <Select name="bloqueID" value={formData.bloqueID || ''} onChange={handleInputChange}>
                {bloques.map((bloque) => (
                  <MenuItem key={bloque.id} value={bloque.id}>{bloque.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Espacio</InputLabel>
              <Select name="espacioID" value={formData.espacioID || ''} onChange={handleInputChange} required>
                {espacios.map((espacio) => (
                  <MenuItem key={espacio.id} value={espacio.id}>{espacio.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Producción</InputLabel>
              <Select name="produccionID" value={formData.produccionID || ''} onChange={handleInputChange} required>
                {producciones.map((produccion) => (
                  <MenuItem key={produccion.id} value={produccion.id}>{produccion.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select name="tipoMovimientoID" value={formData.tipoMovimientoID || ''} onChange={handleInputChange} required>
                {tipoMovimientos.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
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
              <Select name="estado" value={formData.estado || ''} onChange={handleInputChange} required>
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.id}>{estado.nombre}</MenuItem>
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
              <Button type="submit" variant="contained" color="primary">Guardar Kardex</Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <GridKardexNuevo 
        kardexItems={kardexItems}
        handleAddItem={handleAddItem}
        handleUpdateItem={handleUpdateItem}
        handleDeleteItem={handleDeleteItem}
      />
    </Box>
  );
}
