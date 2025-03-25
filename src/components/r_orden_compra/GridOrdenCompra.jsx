/**
 * @file GridOrdenCompra.jsx
 * @module GridOrdenCompra
 * @description Componente de grilla para visualizar órdenes de compra. Permite seleccionar una orden mediante clic en fila. Utiliza MUI DataGrid para visualización estructurada de datos.
 * @author Karla
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

/**
 * Componente GridOrdenCompra.
 *
 * @param {Object} props - Props del componente
 * @param {Array<Object>} props.ordenesCompra - Lista de órdenes de compra a mostrar en la tabla
 * @param {Function} props.onSelectOrdenCompra - Función que se ejecuta al seleccionar una orden
 * @returns {JSX.Element} Grilla de órdenes de compra
 */
export default function GridOrdenCompra({ ordenesCompra, onSelectOrdenCompra }) {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "pedidoId", headerName: "Pedido ID", width: 200 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "estado", headerName: "Estado", width: 100 },
  ];

  return (
    <Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={ordenesCompra}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => onSelectOrdenCompra(params.row)}
        />
      </div>
    </Box>
  );
}
