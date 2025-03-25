/**
 * @file GridPedido.jsx
 * @module GridPedido
 * @description Componente de grilla para visualizar los pedidos disponibles, permite seleccionar uno y generar un reporte PDF. Utiliza DataGrid de MUI para visualización tabular y estilo responsivo.
 * @author Karla
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

/**
 * Componente de grilla para mostrar pedidos.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.pedidos - Lista de pedidos a mostrar.
 * @param {function(): void} props.onGenerateReport - Función para generar el reporte PDF del pedido seleccionado.
 * @param {function(Object): void} props.onSelectPedido - Función para manejar la selección de un pedido.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function GridPedido({ pedidos, onGenerateReport, onSelectPedido }) {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "fechaHora", headerName: "Fecha y Hora", width: 200 },
    { field: "almacen", headerName: "Almacén", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "estado", headerName: "Estado", width: 100 },
  ];

  return (
    <Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={pedidos}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => onSelectPedido(params.row)}
        />
      </div>
      <Box mt={2}>
        <Button variant="contained" color="success" onClick={onGenerateReport}>
          GENERAR REPORTE
        </Button>
      </Box>
    </Box>
  );
}

GridPedido.propTypes = {
  pedidos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGenerateReport: PropTypes.func.isRequired,
  onSelectPedido: PropTypes.func.isRequired,
};
