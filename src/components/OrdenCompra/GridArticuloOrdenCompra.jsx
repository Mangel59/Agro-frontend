// GridArticuloOrdenCompra.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

function Toolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default function GridArticuloOrdenCompra({
  items = [],
  setSelectedRow = () => {},
  presentacionesMap = {},
}) {
  const columns = useMemo(() => {
    const presentacionNameGetter = ({ row }) => {
      // ID puede venir con distintos nombres
      const presId =
        row.presentacionProductoId ??
        row.presentacion_id ??
        row.presentacionId ??
        row.presentacion?.id ??
        null;

      // nombre directo si vino expandido
      const directName =
        row.presentacionNombre ??
        row.presentacion_name ??
        row.presentacion?.name;

      return directName ?? (presId != null ? presentacionesMap[Number(presId)] : "") ?? "";
    };

    return [
      { field: "id", headerName: "ID", width: 90, type: "number" },
      { field: "cantidad", headerName: "Cantidad", width: 120, type: "number" },
      { field: "precio", headerName: "Precio", width: 120, type: "number" },
      { field: "ordenCompraId", headerName: "Orden Compra", width: 140, type: "number" },
      {
        field: "presentacion",
        headerName: "Presentación",
        width: 220,
        valueGetter: presentacionNameGetter, 
      },
      {
        field: "estadoId",
        headerName: "Estado",
        width: 110,
        valueGetter: ({ row }) => (Number(row.estadoId) === 1 ? "Activo" : "Inactivo"),
      },
    ];
  }, [presentacionesMap]);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        rows={items}
        columns={columns}
        components={{ Toolbar }}
        onRowSelectionModelChange={(sel) => {
          const ids = new Set(sel);
          const found = (items || []).find(r => ids.has(r.id));
          setSelectedRow(found || {});
        }}
        autoHeight
        sx={{ minWidth: 600 }}
      />
    </Box>
  );
}

GridArticuloOrdenCompra.propTypes = {
  items: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  presentacionesMap: PropTypes.object,
};
