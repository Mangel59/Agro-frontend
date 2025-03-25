/**
 * @file Pedido.jsx
 * @module Pedido
 * @description Componente principal para la gestión de pedidos y sus ítems. Permite listar, eliminar y generar reportes PDF. Utiliza Axios para comunicarse con la API.
 * @author Karla
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import FormPedido from './FormPedido';
import GridPedido from './GridPedido';
import GridPedidoItem from './GridPedidoItem';
import FormPedidoItem from './FormPedidoItem';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

/**
 * Componente principal para la gestión de pedidos.
 *
 * Permite:
 * - Cargar pedidos por almacén.
 * - Seleccionar un pedido y ver sus ítems.
 * - Eliminar pedidos e ítems asociados.
 * - Generar reportes PDF por pedido.
 *
 * @component
 * @returns {JSX.Element} Interfaz de gestión de pedidos
 */
export default function Pedido() {
  const [pedidos, setPedidos] = useState([]);
  const [almacenId, setAlmacenId] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [pedidoItems, setPedidoItems] = useState([]);

  /**
   * Carga pedidos por almacén desde la API.
   * @async
   */
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

  /**
   * Carga ítems de un pedido específico.
   * @async
   */
  const fetchPedidoItems = async () => {
    if (!selectedPedido?.id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = response.data?.content || [];

      const detailedItems = await Promise.all(
        items.map(async (item) => {
          const productoResponse = await axios.get(
            `${SiteProps.urlbasev1}/producto-presentacion/${item.productoPresentacion}`,
            { headers: { Authorization: `Bearer ${token}` } }
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
    } catch (error) {
      console.error('Error al cargar los ítems:', error);
    }
  };

  /**
   * Elimina un pedido y todos sus ítems asociados.
   * @async
   */
  const handleDeletePedido = async () => {
    if (!selectedPedido) {
      alert("Selecciona un pedido para eliminar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const itemsResponse = await axios.get(
        `${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = itemsResponse.data?.content || [];

      if (Array.isArray(items)) {
        await Promise.all(
          items.map((item) =>
            axios.delete(`${SiteProps.urlbasev1}/pedido_item/${item.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
      }

      await axios.delete(`${SiteProps.urlbasev1}/pedido/${selectedPedido.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Pedido y sus ítems eliminados correctamente.");
      fetchPedidos();
      setPedidoItems([]);
      setSelectedPedido(null);
    } catch (error) {
      console.error("Error al eliminar el pedido o sus ítems:", error);
      alert("Hubo un problema al eliminar el pedido.");
    }
  };

  /**
   * Genera y descarga el reporte PDF del pedido seleccionado.
   * @async
   */
  const handleGenerateReport = async () => {
    if (!selectedPedido?.id) {
      alert('Selecciona un pedido para generar el reporte.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${SiteProps.urlbasev1}/pedido_item/pedido/${selectedPedido.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = response.data?.content || [];
      if (items.length === 1) {
        alert('El pedido debe tener exactamente un ítem asociado para generar el reporte.');
        return;
      }

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
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto', height: '80vh' }}>
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
        onSelectPedido={(pedido) => {
          setSelectedPedido(pedido);
        }}
      />

      {selectedPedido ? (
        <>
          <GridPedidoItem items={Array.isArray(pedidoItems) ? pedidoItems : []} pedidoId={selectedPedido.id} />
          <FormPedidoItem
            pedidoId={selectedPedido.id}
            fetchPedidoItems={fetchPedidoItems}
            disabled={false}
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
