/**
 * @file GridOrdenCompraItem.jsx
 * @module GridOrdenCompraItem
 * @description Componente de grilla para visualizar los ítems asociados a una orden de compra. Muestra información como producto, cantidad, unidad y precio. Ideal para tareas de revisión o validación de pedidos antes de su procesamiento final.
 * @author Karla
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";

/**
 * Componente GridOrdenCompraItem.
 *
 * @param {Object} props - Props del componente
 * @param {Array<Object>} props.items - Lista de ítems a mostrar, cada uno con producto, cantidad, unidad y precio
 * @param {number|string} props.ordenCompraId - ID de la orden de compra a la que pertenecen los ítems
 * @returns {JSX.Element} Tabla de ítems de orden de compra
 */
export default function GridOrdenCompraItem({ items, ordenCompraId }) {
  const columns = [
    { field: "producto", headerName: "Producto", width: 200 },
    { field: "cantidad", headerName: "Cantidad", width: 150 },
    { field: "unidad", headerName: "Unidad", width: 150 },
    { field: "precio", headerName: "Precio", width: 150 },
  ];

  return (
    <div style={{ marginTop: 20, height: 400, width: "100%" }}>
      <h3>Ítems de la Orden de Compra {ordenCompraId}</h3>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
