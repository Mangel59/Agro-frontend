// FUNCIONAL CRUD
// import React, { useState, useEffect } from 'react';
// import { Grid, Select, MenuItem, Button, FormControl, InputLabel, Box, Modal, TextField, Autocomplete } from '@mui/material';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function FormPedido({
//   onAddPedido,
//   onUpdatePedido,
//   onDeletePedido,
//   setAlmacenId,
//   selectedPedido,
//   setSelectedPedido,
//   fetchPedidos, // Se pasa como prop
// }) {
//   const [sede, setSede] = useState('');
//   const [almacen, setAlmacen] = useState('');
//   const [sedes, setSedes] = useState([]);
//   const [almacenes, setAlmacenes] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false); // Estado para diferenciar entre ADD y EDIT
//   const [newPedido, setNewPedido] = useState({
//     fechaHora: '',
//     almacen: '',
//     produccion: '',
//     descripcion: '',
//     estado: 1,
//   });
//   const [producciones, setProducciones] = useState([]);
//   const [selectedProduccion, setSelectedProduccion] = useState(null);

//   useEffect(() => {
//     const fetchSedes = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSedes(response.data || []);
//       } catch (error) {
//         console.error('Error al cargar sedes:', error);
//       }
//     };
//     fetchSedes();
//   }, []);

//   const handleSedeChange = async (e) => {
//     const sedeId = e.target.value;
//     setSede(sedeId);
//     setAlmacen(''); // Reinicia el almacén al cambiar de sede
//     setAlmacenes([]); // Limpia los almacenes anteriores
//     setSelectedPedido(null); // Limpia el pedido seleccionado

//     if (sedeId) {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${SiteProps.urlbasev1}/almacen/minimal/sede/${sedeId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAlmacenes(response.data || []);
//       } catch (error) {
//         console.error('Error al cargar almacenes:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchProducciones = async () => {
//       if (!almacen) return;
//       setSelectedPedido(null);
//       setNewPedido({
//         fechaHora: '',
//         almacen: '',
//         produccion: '',
//         descripcion: '',
//         estado: 1,
//       });
//       setSelectedProduccion(null);
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${SiteProps.urlbasev1}/producciones/short/${almacen}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProducciones(response.data || []);
//       } catch (error) {
//         console.error('Error al cargar producciones:', error);
//       }
//     };
//     fetchProducciones();
//   }, [almacen]);

//   const handleSavePedido = async () => {
//     if (!almacen || !selectedProduccion) {
//       alert('Por favor selecciona un almacén y una producción antes de guardar el pedido.');
//       return;
//     }

//     const pedidoToSend = {
//       ...newPedido,
//       almacen,
//       produccion: selectedProduccion?.id || '',
//     };

//     if (!pedidoToSend.fechaHora || !pedidoToSend.descripcion) {
//       alert('Todos los campos son obligatorios.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (isEditing) {
//         await axios.put(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, pedidoToSend, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert('Pedido actualizado correctamente.');
//       } else {
//         await axios.post(`${SiteProps.urlbasev1}/pedido`, pedidoToSend, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert('Pedido creado correctamente.');
//       }

//       setModalOpen(false);
//       fetchPedidos(); // LLAMA A LA FUNCIÓN PASADA COMO PROP
//     } catch (error) {
//       console.error('Error al guardar el pedido:', error);
//       alert('Hubo un problema al guardar el pedido.');
//     }
//   };

//   const handleOpenAddModal = () => {
//     setIsEditing(false); // Modo Añadir
//     setSelectedPedido(null); // Limpia el pedido seleccionado
//     setNewPedido({
//       fechaHora: '',
//       almacen: '',
//       produccion: '',
//       descripcion: '',
//       estado: 1,
//     }); // Resetea el formulario
//     setModalOpen(true);
//   };

//   const handleOpenUpdateModal = () => {
//     if (selectedPedido) {
//       setIsEditing(true); // Modo Editar
//       setNewPedido({
//         fechaHora: selectedPedido.fechaHora,
//         almacen: selectedPedido.almacen,
//         produccion: selectedPedido.produccion,
//         descripcion: selectedPedido.descripcion,
//         estado: selectedPedido.estado,
//       });

//       // Actualizar la producción seleccionada
//       const currentProduccion = producciones.find((p) => p.id === selectedPedido.produccion);
//       setSelectedProduccion(currentProduccion || null);

//       setModalOpen(true);
//     } else {
//       alert('Selecciona un pedido para actualizar.');
//     }
//   };



//   return (
//     <Box mb={2}>
//       <Grid container spacing={2} alignItems="center">
//         <Grid item xs={3}>
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
//         <Grid item xs={3}>
//           <FormControl fullWidth>
//             <InputLabel>Almacén</InputLabel>
//             <Select
//               value={almacen}
//               onChange={(e) => {
//                 setAlmacen(e.target.value);
//                 setAlmacenId(e.target.value);
//               }}
//               required
//               disabled={!almacenes.length}
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
//         <Grid item xs={6} display="flex" justifyContent="flex-end">
//           <Button variant="contained" color="primary" onClick={handleOpenAddModal} style={{ marginRight: '10px' }}>
//             ADD
//           </Button>
//           <Button variant="contained" color="secondary" onClick={handleOpenUpdateModal} style={{ marginRight: '10px' }}>
//             UPDATE
//           </Button>
//           <Button variant="contained" color="error" onClick={onDeletePedido}>
//             DELETE
//           </Button>
//         </Grid>
//       </Grid>

//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box
//           p={4}
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             borderRadius: '8px',
//           }}
//         >
//           <h2>{isEditing ? 'Editar Pedido' : 'Añadir Pedido'}</h2>
//           <TextField
//             label="Fecha y Hora"
//             type="datetime-local"
//             fullWidth
//             margin="normal"
//             value={newPedido.fechaHora}
//             onChange={(e) => setNewPedido({ ...newPedido, fechaHora: e.target.value })}
//           />
//           <Autocomplete
//             options={producciones}
//             getOptionLabel={(option) => option.nombre}
//             value={selectedProduccion}
//             onChange={(event, value) => setSelectedProduccion(value)}
//             renderInput={(params) => <TextField {...params} label="Producción" margin="normal" required />}
//           />

//           <TextField
//             label="Descripción"
//             fullWidth
//             margin="normal"
//             value={newPedido.descripcion}
//             onChange={(e) => setNewPedido({ ...newPedido, descripcion: e.target.value })}
//           />
//           <Button variant="contained" color="primary" onClick={handleSavePedido} fullWidth>
//             Guardar
//           </Button>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }




import React, { useState, useEffect } from "react";
import { Grid, Select, MenuItem, Button, FormControl, InputLabel, Box, Modal, TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormPedido({
  onAddPedido,
  onUpdatePedido,
  onDeletePedido,
  setAlmacenId,
  selectedPedido,
  setSelectedPedido,
  fetchPedidos,
}) {
  const [sede, setSede] = useState("");
  const [almacen, setAlmacen] = useState("");
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPedido, setNewPedido] = useState({
    fechaHora: "",
    almacen: "",
    produccion: "",
    descripcion: "",
    estado: 1,
  });
  const [producciones, setProducciones] = useState([]);
  const [selectedProduccion, setSelectedProduccion] = useState(null);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  const handleSedeChange = async (e) => {
    const sedeId = e.target.value;
    setSede(sedeId);
    setAlmacen("");
    setAlmacenes([]);
    setSelectedPedido(null);

    if (sedeId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/almacen/minimal/sede/${sedeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlmacenes(response.data || []);
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
      }
    }
  };

  useEffect(() => {
    const fetchProducciones = async () => {
      if (!almacen) return;
      setSelectedPedido(null);
      setNewPedido({
        fechaHora: "",
        almacen: "",
        produccion: "",
        descripcion: "",
        estado: 1,
      });
      setSelectedProduccion(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/producciones/short/${almacen}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducciones(response.data || []);
      } catch (error) {
        console.error("Error al cargar producciones:", error);
      }
    };
    fetchProducciones();
  }, [almacen]);

  const handleSavePedido = async () => {
    if (!almacen || !selectedProduccion) {
      alert("Por favor selecciona un almacén y una producción antes de guardar el pedido.");
      return;
    }

    const pedidoToSend = {
      ...newPedido,
      almacen,
      produccion: selectedProduccion?.id || "",
    };

    if (!pedidoToSend.fechaHora || !pedidoToSend.descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, pedidoToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Pedido actualizado correctamente.");
      } else {
        await axios.post(`${SiteProps.urlbasev1}/pedido`, pedidoToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Pedido creado correctamente.");
      }

      setModalOpen(false);
      fetchPedidos();
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert("Hubo un problema al guardar el pedido.");
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedPedido(null);
    setNewPedido({
      fechaHora: "",
      almacen: "",
      produccion: "",
      descripcion: "",
      estado: 1,
    });
    setModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    if (selectedPedido) {
      setIsEditing(true);
      setNewPedido({
        fechaHora: selectedPedido.fechaHora,
        almacen: selectedPedido.almacen,
        produccion: selectedPedido.produccion,
        descripcion: selectedPedido.descripcion,
        estado: selectedPedido.estado,
      });

      const currentProduccion = producciones.find((p) => p.id === selectedPedido.produccion);
      setSelectedProduccion(currentProduccion || null);

      setModalOpen(true);
    } else {
      alert("Selecciona un pedido para actualizar.");
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
          <Button variant="contained" color="primary" onClick={handleOpenAddModal} style={{ marginRight: "10px" }}>
            ADD
          </Button>
          <Button variant="contained" color="secondary" onClick={handleOpenUpdateModal} style={{ marginRight: "10px" }}>
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
          }}
        >
          <h2>{isEditing ? "Editar Pedido" : "Añadir Pedido"}</h2>
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
            onChange={(event, value) => setSelectedProduccion(value)}
            renderInput={(params) => <TextField {...params} label="Producción" margin="normal" required />}
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
