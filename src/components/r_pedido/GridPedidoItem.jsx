/**
 * @file GridPedidoItem.jsx
 * @module GridPedidoItem
 * @description Componente para mostrar en una tabla los ítems asociados a un pedido específico. Usa DataGrid de MUI para visualizar producto y cantidad de cada ítem en el pedido seleccionado.
 * @author Karla
 */

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Componente GridPedidoItem.
 *
 * Muestra una tabla de ítems de un pedido específico.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.items - Lista de ítems a mostrar.
 * @param {string|number} props.pedidoId - ID del pedido al que pertenecen los ítems.
 *
 * @returns {JSX.Element} Tabla de ítems del pedido.
 */
export default function GridPedidoItem({ items, pedidoId }) {
  const columns = [
    { field: 'producto', headerName: 'Producto', width: 200 },
    { field: 'cantidad', headerName: 'Cantidad', width: 150 },
  ];

  return (
    <div style={{ marginTop: 20, height: 400, width: '100%' }}>
      <h3>Ítems del Pedido {pedidoId}</h3>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
