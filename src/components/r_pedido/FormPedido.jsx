// import React, { useState } from 'react';

// export default function FormPedido({ onGenerateReport }) {
//   const [pedidoId, setPedidoId] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (pedidoId) {
//       onGenerateReport(pedidoId);
//     } else {
//       alert('Por favor, ingresa un ID de pedido válido.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         ID del Pedido:
//         <input
//           type="number"
//           value={pedidoId}
//           onChange={(e) => setPedidoId(e.target.value)}
//           required
//         />
//       </label>
//       <button type="submit">Generar Reporte</button>
//     </form>
//   );
// }



// PARTE 2
// import React, { useState, useEffect } from 'react';
// import { Grid, TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function FormPedido({ onSavePedido }) {
//   const [sede, setSede] = useState('');
//   const [almacen, setAlmacen] = useState('');
//   const [descripcion, setDescripcion] = useState('');
//   const [fechaHora, setFechaHora] = useState(new Date().toISOString().slice(0, 16));
//   const [sedes, setSedes] = useState([]);
//   const [almacenes, setAlmacenes] = useState([]);

//   // Cargar las sedes al cargar el componente
//   useEffect(() => {
//     const fetchSedes = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         console.log('Token:', token);

//         const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log('Respuesta del backend:', response.data);

//         if (response.data) {
//           setSedes(response.data); // Almacenar directamente la lista de sedes
//         } else {
//           console.error('Error: La respuesta no contiene sedes.');
//         }
//       } catch (error) {
//         console.error('Error al cargar sedes:', error.response ? error.response.data : error.message);
//       }
//     };

//     fetchSedes();
//   }, []);


//   // Cargar los almacenes dinámicamente cuando se selecciona una sede
//   const handleSedeChange = async (e) => {
//     const sedeId = e.target.value; // Obtener el ID de la sede seleccionada
//     setSede(sedeId); // Actualizar el estado de la sede seleccionada
//     setAlmacen(''); // Reiniciar el valor de almacén al cambiar de sede
//     setAlmacenes([]); // Limpiar los almacenes para evitar inconsistencias

//     if (!sedeId) return; // Si no hay sede seleccionada, no hacer nada

//     try {
//       const token = localStorage.getItem('token'); // Obtener el token desde el localStorage
//       console.log('Token:', token);

//       const response = await axios.get(`${SiteProps.urlbasev1}/almacen/minimal/sede/${sedeId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       console.log('Almacenes cargados:', response.data);

//       if (response.data) {
//         setAlmacenes(response.data); // Actualizar el estado de los almacenes
//       } else {
//         console.error('Error: La respuesta no contiene almacenes.');
//       }
//     } catch (error) {
//       console.error('Error al cargar almacenes:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!almacen) {
//       alert('Por favor, selecciona un almacén.');
//       return;
//     }
//     onSavePedido({ almacen, descripcion, fechaHora });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <Grid container spacing={2}>
//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Sede</InputLabel>
//             <Select value={sede} onChange={handleSedeChange} required>
//               <MenuItem value="">
//                 <em>Seleccione una sede</em>
//               </MenuItem>
//               {sedes.map((s) => (
//                 <MenuItem key={s.id} value={s.id}>
//                   {s.nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//         </Grid>
//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Almacén</InputLabel>
//             <Select
//               value={almacen}
//               onChange={(e) => setAlmacen(e.target.value)}
//               required
//               disabled={!almacenes.length} // Deshabilitar si no hay almacenes disponibles
//             >
//               <MenuItem value="">
//                 <em>Seleccione un almacén</em>
//               </MenuItem>
//               {almacenes.map((a) => (
//                 <MenuItem key={a.id} value={a.id}>
//                   {a.nombre}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//         </Grid>
//         <Grid item xs={6}>
//           <TextField
//             fullWidth
//             label="Descripción"
//             value={descripcion}
//             onChange={(e) => setDescripcion(e.target.value)}
//             required
//           />
//         </Grid>
//         <Grid item xs={6}>
//           <TextField
//             fullWidth
//             label="Fecha y Hora"
//             type="datetime-local"
//             value={fechaHora}
//             onChange={(e) => setFechaHora(e.target.value)}
//             required
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button type="submit" variant="contained" color="primary">
//             Guardar Pedido
//           </Button>
//         </Grid>
//       </Grid>
//     </form>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Grid, Select, MenuItem, Button, FormControl, InputLabel, Box, Modal, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function FormPedido({ onAddPedido, onUpdatePedido, onDeletePedido, setAlmacenId, selectedPedido, setSelectedPedido }) {
  const [sede, setSede] = useState('');
  const [almacen, setAlmacen] = useState('');
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para diferenciar entre ADD y EDIT
  const [newPedido, setNewPedido] = useState({
    fechaHora: '',
    almacen: '',
    produccion: '',
    descripcion: '',
    estado: 1,
  });
  const [producciones, setProducciones] = useState([]);
  const [selectedProduccion, setSelectedProduccion] = useState(null);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error('Error al cargar sedes:', error);
      }
    };
    fetchSedes();
  }, []);

  const handleSedeChange = async (e) => {
    const sedeId = e.target.value;
    setSede(sedeId);
    setAlmacen('');
    setAlmacenes([]);
    setSelectedPedido(null); 
    setNewPedido({ 
      fechaHora: '',
      almacen: '',
      produccion: '',
      descripcion: '',
      estado: 1,
    });
    setSelectedProduccion(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SiteProps.urlbasev1}/almacen/minimal/sede/${sedeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlmacenes(response.data || []);
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
    }
  };

  useEffect(() => {
    const fetchProducciones = async () => {
      if (!almacen) return;
      setSelectedPedido(null);
      setNewPedido({ 
        fechaHora: '',
        almacen: '',
        produccion: '',
        descripcion: '',
        estado: 1,
      });
      setSelectedProduccion(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${SiteProps.urlbasev1}/producciones/short/${almacen}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducciones(response.data || []);
      } catch (error) {
        console.error('Error al cargar producciones:', error);
      }
    };
    fetchProducciones();
  }, [almacen]);

  const handleSavePedido = async () => {
    if (!almacen) {
      alert('Por favor selecciona un almacén antes de añadir un pedido.');
      return;
    }
    
    const pedidoToSend = { ...newPedido, almacen, produccion: selectedProduccion?.id || '' };
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SiteProps.urlbasev1}/pedido`, pedidoToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const createdPedido = response.data;
  
      // Crear un pedido_item predeterminado
      const pedidoItem = {
        pedido: createdPedido.id, // ID del pedido recién creado
        productoPresentacion: 1, // Cambia por un ID válido de Producto Presentación
        cantidad: 1,
        estado: 1,
      };
  
      await axios.post(`${SiteProps.urlbasev1}/pedido_item`, pedidoItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setModalOpen(false);
      alert('Pedido y pedido_item creados correctamente.');
    } catch (error) {
      console.error('Error al añadir el pedido y su item:', error);
      alert('Hubo un problema al crear el pedido.');
    }
  };
  

  const handleOpenAddModal = () => {
    setIsEditing(false); // Indica que estamos en modo ADD
    setSelectedProduccion(null); // Limpia selección de producción
    setNewPedido({
      fechaHora: '',
      almacen: '',
      produccion: '',
      descripcion: '',
      estado: 1,
    }); // Resetea formulario
    setModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    if (selectedPedido) {
      setIsEditing(true); // Indica que estamos en modo EDIT
      setNewPedido({
        fechaHora: selectedPedido.fechaHora,
        almacen: selectedPedido.almacen,
        produccion: selectedPedido.produccion,
        descripcion: selectedPedido.descripcion,
        estado: selectedPedido.estado,
      });
      const currentProduccion = producciones.find(p => p.id === selectedPedido.produccion);
      setSelectedProduccion(currentProduccion || null);
      setModalOpen(true);
    } else {
      alert('Selecciona un pedido para actualizar.');
    }
  };

  return (
    <Box mb={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Sede</InputLabel>
            <Select value={sede} onChange={handleSedeChange} required>
              <MenuItem value="">
                <em>Seleccione una sede</em>
              </MenuItem>
              {sedes.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Almacén</InputLabel>
            <Select
              value={almacen}
              onChange={(e) => {
                setAlmacen(e.target.value);
                setAlmacenId(e.target.value);
              }}
              required
              disabled={!almacenes.length}
            >
              <MenuItem value="">
                <em>Seleccione un almacén</em>
              </MenuItem>
              {almacenes.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleOpenAddModal} style={{ marginRight: '10px' }}>
            ADD
          </Button>
          <Button variant="contained" color="secondary" onClick={handleOpenUpdateModal} style={{ marginRight: '10px' }}>
            UPDATE
          </Button>
          <Button variant="contained" color="error" onClick={onDeletePedido}>
            DELETE
          </Button>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          p={4}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '8px',
          }}
        >
          <h2>{isEditing ? 'Editar Pedido' : 'Añadir Pedido'}</h2>
          <TextField
            label="Fecha y Hora"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={newPedido.fechaHora}
            onChange={(e) => setNewPedido({ ...newPedido, fechaHora: e.target.value })}
          />
          <Autocomplete
            options={producciones}
            getOptionLabel={(option) => option.nombre}
            value={selectedProduccion}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.nombre}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Producción" margin="normal" />}
            onChange={(event, value) => setSelectedProduccion(value)}
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={newPedido.descripcion}
            onChange={(e) => setNewPedido({ ...newPedido, descripcion: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleSavePedido} fullWidth>
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}


