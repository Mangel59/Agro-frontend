// import React from 'react';
// import ReportPedido from './ReportPedido';

// export default function Pedido() {
//   return (
//     <div>
//       <h1>Gestión de Pedidos</h1>
//       <ReportPedido />
//     </div>
//   );
// }



// PARTE 2
// import React, { useState, useEffect } from 'react';
// import { Box, Typography } from '@mui/material';
// import FormPedido from './FormPedido';
// import GridPedido from './GridPedido';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function Pedido() {
//   const [pedidos, setPedidos] = useState([]);
//   const [almacenId, setAlmacenId] = useState(null);

//   const fetchPedidos = async () => {
//     if (!almacenId) return;
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${SiteProps.urlbasev1}/pedido/almacen/${almacenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPedidos(response.data.content || []);
//     } catch (error) {
//       console.error('Error al cargar pedidos:', error);
//     }
//   };

//   const handleSavePedido = async (newPedido) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${SiteProps.urlbasev1}/pedido`, newPedido, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPedidos();
//     } catch (error) {
//       console.error('Error al guardar el pedido:', error);
//     }
//   };

//   const handleDeletePedido = async (pedidoId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${SiteProps.urlbasev1}/pedido/${pedidoId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPedidos();
//     } catch (error) {
//       console.error('Error al eliminar el pedido:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPedidos();
//   }, [almacenId]);

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Gestión de Pedidos
//       </Typography>
//       <FormPedido onSavePedido={handleSavePedido} setAlmacenId={setAlmacenId} />
//       <GridPedido pedidos={pedidos} onDeletePedido={handleDeletePedido} />
//     </Box>
//   );
// }


//PARTE 2
// import React, { useState, useEffect } from 'react';
// import { Box, Typography } from '@mui/material';
// import FormPedido from './FormPedido';
// import GridPedido from './GridPedido';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function Pedido() {
//   const [pedidos, setPedidos] = useState([]);
//   const [almacenId, setAlmacenId] = useState(null);
//   const [selectedPedido, setSelectedPedido] = useState(null);

//   const fetchPedidos = async () => {
//     if (!almacenId) return;
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${SiteProps.urlbasev1}/pedido/almacen/${almacenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPedidos(response.data.content || []);
//     } catch (error) {
//       console.error('Error al cargar pedidos:', error);
//     }
//   };

//   const handleAddPedido = async (newPedido) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${SiteProps.urlbasev1}/pedido`, newPedido, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPedidos();
//     } catch (error) {
//       console.error('Error al añadir el pedido:', error);
//     }
//   };

//   const handleUpdatePedido = async (updatedPedido) => {
//     if (!selectedPedido) {
//       alert('Selecciona un pedido para actualizar.');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, updatedPedido, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPedidos();
//     } catch (error) {
//       console.error('Error al actualizar el pedido:', error);
//     }
//   };

//   const handleDeletePedido = async () => {
//     if (!selectedPedido) {
//       alert('Selecciona un pedido para eliminar.');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPedidos();
//     } catch (error) {
//       console.error('Error al eliminar el pedido:', error);
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!selectedPedido) {
//       alert('Selecciona un pedido para generar el reporte.');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${SiteProps.urlbasev2}/report/pedido`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { pedidoId: selectedPedido.id },
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Reporte_Pedido_${selectedPedido.id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Error al generar el reporte:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPedidos();
//   }, [almacenId]);

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Gestión de Pedidos
//       </Typography>
//       <FormPedido
//         onAddPedido={handleAddPedido}
//         onUpdatePedido={handleUpdatePedido}
//         onDeletePedido={handleDeletePedido}
//         setAlmacenId={setAlmacenId}
//         selectedPedido={selectedPedido}
//         setSelectedPedido={setSelectedPedido} // PASA LA FUNCIÓN setSelectedPedido
//       />
//       <GridPedido
//         pedidos={pedidos}
//         onGenerateReport={handleGenerateReport}
//         onSelectPedido={(pedido) => {
//           setSelectedPedido(pedido); // Actualiza el pedido seleccionado
//           console.log('Pedido seleccionado:', pedido); // Depuración
//         }}
//       />
//     </Box>
//   );
// }


//PARTE 3
// import React, { useState, useEffect } from 'react';
// import { Box, Typography } from '@mui/material';
// import FormPedido from './FormPedido';
// import GridPedido from './GridPedido';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function Pedido() {
//   const [pedidos, setPedidos] = useState([]);
//   const [almacenId, setAlmacenId] = useState(null);
//   const [selectedPedido, setSelectedPedido] = useState(null);

//   const fetchPedidos = async () => {
//     if (!almacenId) return;
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${SiteProps.urlbasev1}/pedido/almacen/${almacenId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPedidos(response.data.content || []);
//     } catch (error) {
//       console.error('Error al cargar pedidos:', error);
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!selectedPedido || !selectedPedido.id) {
//       alert('Selecciona un pedido para generar el reporte.');
//       return;
//     }
  
//     try {
//       console.log('Generando reporte para pedido ID:', selectedPedido.id); // Depuración
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${SiteProps.urlbasev2}/report/pedido`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { pedidoId: selectedPedido.id }, // Enviar el ID como parámetro de consulta
//         responseType: 'blob', // Indica que esperamos un archivo binario
//       });
  
//       // Descargar el archivo si la solicitud fue exitosa
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Reporte_Pedido_${selectedPedido.id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Error al generar el reporte:', error.response || error);
//       alert('No se pudo generar el reporte. Intenta nuevamente.');
//     }
//   };
  

//   useEffect(() => {
//     fetchPedidos();
//   }, [almacenId]);

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Gestión de Pedidos
//       </Typography>
//       <FormPedido setAlmacenId={setAlmacenId} selectedPedido={selectedPedido} setSelectedPedido={setSelectedPedido} />
//       <GridPedido
//         pedidos={pedidos}
//         onGenerateReport={handleGenerateReport}
//         onSelectPedido={(pedido) => {
//           setSelectedPedido(pedido);
//           console.log('Pedido seleccionado:', pedido);
//         }}
//       />
//     </Box>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import FormPedido from './FormPedido';
import GridPedido from './GridPedido';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function Pedido() {
  const [pedidos, setPedidos] = useState([]);
  const [almacenId, setAlmacenId] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const fetchPedidos = async () => {
    if (!almacenId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${SiteProps.urlbasev1}/pedido/almacen/${almacenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(response.data.content || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const handleAddPedido = async (newPedido) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${SiteProps.urlbasev1}/pedido`, newPedido, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPedidos();
    } catch (error) {
      console.error('Error al añadir el pedido:', error);
    }
  };

  const handleUpdatePedido = async (updatedPedido) => {
    if (!selectedPedido) {
      alert('Selecciona un pedido para actualizar.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, updatedPedido, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPedidos();
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
    }
  };

  const handleDeletePedido = async () => {
    if (!selectedPedido) {
      alert('Selecciona un pedido para eliminar.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPedidos();
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedPedido) {
      alert('Selecciona un pedido para generar el reporte.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const itemsResponse = await axios.get(`${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!itemsResponse.data.length) {
        alert('El pedido seleccionado no tiene ítems asociados. No se puede generar el reporte.');
        return;
      }
  
      const response = await axios.get(`${SiteProps.urlbasev2}/report/pedido`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pedidoId: selectedPedido.id },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte_Pedido_${selectedPedido.id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  };
  

  useEffect(() => {
    fetchPedidos();
  }, [almacenId]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Pedidos
      </Typography>
      <FormPedido
        onAddPedido={handleAddPedido}
        onUpdatePedido={handleUpdatePedido}
        onDeletePedido={handleDeletePedido}
        setAlmacenId={setAlmacenId}
        selectedPedido={selectedPedido}
        setSelectedPedido={setSelectedPedido} // PASA LA FUNCIÓN setSelectedPedido
      />
      <GridPedido
        pedidos={pedidos}
        onGenerateReport={handleGenerateReport}
        onSelectPedido={(pedido) => {
          setSelectedPedido(pedido); // Actualiza el pedido seleccionado
          console.log('Pedido seleccionado:', pedido); // Depuración
        }}
      />
    </Box>
  );
}



