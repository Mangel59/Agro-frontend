import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridArticuloPedido({
  items = [],
  setSelectedRow = () => {},     // selección simple (para editar)
  setSelectedRows = () => {},    // selección múltiple (para imprimir)
  presentaciones = [],

  // NUEVOS props para paginación en servidor
  loading = false,
  rowCount,                      // total de registros en el servidor
  paginationModel,               // { page, pageSize }
  onPaginationModelChange,       // setter del padre

  // (opcional) selección controlada desde el padre
  rowSelectionModel,             // array de ids seleccionados
  onRowSelectionModelChange,     // callback controlado del padre
}) {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "cantidad", headerName: "Cantidad", width: 120 },
    { field: "pedidoId", headerName: "Pedido", width: 150 },
    {
      field: "presentacionProductoId",
      headerName: "Presentación de producto",
      width: 220,
      valueGetter: (params) => {
        const match = presentaciones.find((p) => p.id === params.row.presentacionProductoId);
        return match ? match.nombre : params.row.presentacionProductoId;
      },
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
    },
  ];

  // ¿Se activó paginación en servidor?
  const isServerPaging =
    typeof rowCount === "number" &&
    paginationModel &&
    typeof paginationModel.page === "number" &&
    typeof paginationModel.pageSize === "number" &&
    typeof onPaginationModelChange === "function";

  // Handler de selección (si no está controlada por el padre)
  const handleSelection = (ids) => {
    // items contiene SOLO la página actual
    const selectedMultiple = items.filter((row) => ids.includes(row.id));
    const selectedOne = selectedMultiple[0] || null;
    setSelectedRows(selectedMultiple);
    setSelectedRow(selectedOne);
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection
        loading={loading}

        // Selección múltiple / simple
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={
          onRowSelectionModelChange
            ? onRowSelectionModelChange
            : handleSelection
        }

        // Paginación en servidor si hay props, sino cliente
        pagination
        paginationMode={isServerPaging ? "server" : "client"}
        rowCount={isServerPaging ? rowCount : undefined}
        paginationModel={isServerPaging ? paginationModel : undefined}
        onPaginationModelChange={isServerPaging ? onPaginationModelChange : undefined}

        // Tamaños de página
        pageSizeOptions={[5, 10, 15, 20, 50]}
      />
    </Box>
  );
}

GridArticuloPedido.propTypes = {
  items: PropTypes.array,
  setSelectedRow: PropTypes.func,
  setSelectedRows: PropTypes.func,
  presentaciones: PropTypes.array,

  loading: PropTypes.bool,
  rowCount: PropTypes.number,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
  }),
  onPaginationModelChange: PropTypes.func,

  rowSelectionModel: PropTypes.array,
  onRowSelectionModelChange: PropTypes.func,
};
