// FUNCIONAL CRUD
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
//     if (!selectedPedido || !selectedPedido.id) {
//       alert('Selecciona un pedido para generar el reporte.');
//       return;
//     }

//     try {
//       console.log('Generando reporte para pedido ID:', selectedPedido.id); // Depuración
//       const token = localStorage.getItem('token');

//       // Verifica si el pedido tiene ítems asociados
//       const itemsResponse = await axios.get(`${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!itemsResponse.data || itemsResponse.data.length === 0) {
//         alert('El pedido seleccionado no tiene ítems asociados. No se puede generar el reporte.');
//         return;
//       }

//       console.log('Ítems asociados al pedido:', itemsResponse.data); // Depuración

//       // Solicita el reporte desde el backend
//       const response = await axios.get(`${SiteProps.urlbasev2}/report/pedido`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { pedidoId: selectedPedido.id },
//         responseType: 'blob', // Para manejar archivos binarios
//       });

//       // Crea un enlace para descargar el reporte
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Reporte_Pedido_${selectedPedido.id}.pdf`);
//       document.body.appendChild(link);
//       link.click();

//       alert('Reporte generado correctamente.');
//     } catch (error) {
//       console.error('Error al generar el reporte:', error);
//       alert('Hubo un problema al generar el reporte. Intenta nuevamente.');
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
//         setSelectedPedido={setSelectedPedido}
//         fetchPedidos={fetchPedidos} // PASA LA FUNCIÓN AQUÍ
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


import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import FormPedido from './FormPedido';
import GridPedido from './GridPedido';
import GridPedidoItem from './GridPedidoItem';
import FormPedidoItem from './FormPedidoItem';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function Pedido() {
  const [pedidos, setPedidos] = useState([]);
  const [almacenId, setAlmacenId] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [pedidoItems, setPedidoItems] = useState([]);

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

  const fetchPedidoItems = async () => {
    if (!selectedPedido || !selectedPedido.id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const items = response.data?.content || [];
      console.log('Datos crudos obtenidos del backend:', items);

      // Mapea los items y realiza una segunda solicitud para obtener detalles del producto
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          const productoResponse = await axios.get(
            `${SiteProps.urlbasev1}/producto-presentacion/${item.productoPresentacion}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const productoData = productoResponse.data;

          return {
            id: item.id,
            producto: productoData.nombre || 'Sin nombre',
            cantidad: item.cantidad || '0',
          };
        })
      );

      setPedidoItems(detailedItems);
      console.log('Ítems obtenidos con detalles:', detailedItems);
    } catch (error) {
      console.error('Error al cargar los ítems:', error);
    }
  };


  const handleDeletePedido = async () => {
    if (!selectedPedido) {
      alert("Selecciona un pedido para eliminar.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      // Obtener los ítems asociados al pedido
      const itemsResponse = await axios.get(
        `${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Validar que itemsResponse.data sea un arreglo
      const items = itemsResponse.data?.content || []; // Ajustar según la estructura exacta del backend
  
      // Eliminar ítems asociados (solo si existen)
      if (Array.isArray(items)) {
        await Promise.all(
          items.map((item) =>
            axios.delete(`${SiteProps.urlbasev1}/pedido_item/${item.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
      }
  
      // Eliminar el pedido
      await axios.delete(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Pedido y sus ítems eliminados correctamente.");
      fetchPedidos();
      setPedidoItems([]); // Limpiar los ítems mostrados
      setSelectedPedido(null);
    } catch (error) {
      console.error("Error al eliminar el pedido o sus ítems:", error);
      alert("Hubo un problema al eliminar el pedido.");
    }
  };
  

  const handleGenerateReport = async () => {
    if (!selectedPedido || !selectedPedido.id) {
      alert('Selecciona un pedido para generar el reporte.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const items = response.data?.content || [];
      if (items.length !== 1) {
        alert('El pedido debe tener exactamente un ítem asociado para generar el reporte.');
        return;
      }

      // Generar el reporte
      const reportResponse = await axios.get(`${SiteProps.urlbasev2}/report/pedido`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pedidoId: selectedPedido.id },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([reportResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte_Pedido_${selectedPedido.id}.pdf`);
      document.body.appendChild(link);
      link.click();

      alert('Reporte generado correctamente.');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      alert('Hubo un problema al generar el reporte.');
    }
  };


  useEffect(() => {
    fetchPedidos();
  }, [almacenId]);

  useEffect(() => {
    fetchPedidoItems();
  }, [selectedPedido]);

  return (
    <Box 
  sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'auto', 
    height: '80vh' 
  }}
>
<h1>Gestión de Pedidos</h1>

      <FormPedido
        onAddPedido={fetchPedidos}
        onUpdatePedido={fetchPedidos}
        onDeletePedido={handleDeletePedido}
        setAlmacenId={setAlmacenId}
        selectedPedido={selectedPedido}
        setSelectedPedido={setSelectedPedido}
        fetchPedidos={fetchPedidos}
      />

      <GridPedido
        pedidos={pedidos}
        onGenerateReport={handleGenerateReport}
        onSelectPedido={pedido => {
          setSelectedPedido(pedido);
          console.log('Pedido seleccionado:', pedido);
        }}
      />

      {selectedPedido ? (
        <>
          <GridPedidoItem items={Array.isArray(pedidoItems) ? pedidoItems : []} pedidoId={selectedPedido.id} />

          <FormPedidoItem
            pedidoId={selectedPedido.id}
            fetchPedidoItems={fetchPedidoItems}
            disabled={pedidoItems.length > 0}
          />

        </>
      ) : (
        <Typography variant="body1" color="textSecondary" mt={2}>
          Selecciona un pedido para agregar ítems.
        </Typography>
      )}
    </Box>
  );
}
