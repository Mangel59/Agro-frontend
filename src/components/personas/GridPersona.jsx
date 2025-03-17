import * as React from "react";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "tipoIdentificacion", headerName: "Tipo ID", width: 130 },
  { field: "identificacion", headerName: "Identificación", width: 150 },
  { field: "nombre", headerName: "Nombre", width: 130 },
  { field: "apellido", headerName: "Apellido", width: 130 },
  { field: "genero", headerName: "Género", width: 100 },
  { field: "fechaNacimiento", headerName: "Fecha Nac.", width: 130 },
  { field: "estrato", headerName: "Estrato", width: 90 },
  { field: "direccion", headerName: "Dirección", width: 180 },
  { field: "email", headerName: "Email", width: 180 },
  { field: "celular", headerName: "Celular", width: 130 },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridPersona({
  personas,
  selectedRow,
  setSelectedRow,
  pagination,
  onPageChange,
}) {
  const handlePageChange = (newPage, newPageSize) => {
    onPageChange(newPage, newPageSize);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={personas}
        columns={columns}
        paginationMode="server"
        rowCount={pagination.total}
        paginationModel={{
          page: pagination.page,
          pageSize: pagination.pageSize,
        }}
        onPaginationModelChange={(model) => {
          handlePageChange(model.page, model.pageSize);
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        components={{ Toolbar: CustomToolbar }}
        onRowSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRowData = personas.find((row) => selectedIDs.has(row.id));
          setSelectedRow(selectedRowData || {});
        }}
      />
    </div>
  );
}
