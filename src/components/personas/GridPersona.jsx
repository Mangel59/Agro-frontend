import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import axios from 'axios';

export default function GridPersona(props) {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(5); // Tamaño de página inicial
    const [page, setPage] = React.useState(0); // Página inicial
    const [rowCount, setRowCount] = React.useState(0); // Cantidad total de filas
    const [sortModel, setSortModel] = React.useState([]); // Estado del modelo de ordenamiento
    const [filterModel, setFilterModel] = React.useState({ items: [] }); // Estado del modelo de filtros

    // Función para obtener los datos del backend
    const fetchData = async (page, pageSize, sortModel, filterModel) => {
        setLoading(true);
        try {
            const baseURL = `${props.apiBaseUrl}/personas`;

            // Construir parámetros de filtro
            const filterParams = filterModel.items.length > 0 ? {
                [filterModel.items[0]?.columnField]: filterModel.items[0]?.value
            } : {};

            // Realizar la solicitud a la API con los parámetros de paginación, ordenamiento y filtros
            const response = await axios.get(baseURL, {
                params: {
                    page: page + 1, // Las APIs usualmente inician en página 1
                    size: pageSize,
                    sortBy: sortModel[0]?.field || '', // Campo de ordenamiento
                    sortDirection: sortModel[0]?.sort || 'asc', // Dirección de ordenamiento
                    ...filterParams // Añadir filtros
                },
            });

            setData(response.data.data); // Establecer los datos en el estado
            setRowCount(response.data.header.totalElements); // Establecer el número total de elementos
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setLoading(false); // Finalizar el estado de carga
        }
    };

    // Efecto para recargar los datos cuando cambian la página, el tamaño de página, el orden o los filtros
    React.useEffect(() => {
        fetchData(page, pageSize, sortModel, filterModel);
    }, [page, pageSize, sortModel, filterModel]);

    // Función para manejar el cambio en el modelo de paginación
    const handlePaginationModelChange = (model) => {
        setPage(model.page);
        setPageSize(model.pageSize);
    };

    // Componente personalizado de la barra de herramientas
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={[
                    { field: 'id', headerName: 'ID', width: 90 },
                    { field: 'tipoIdentificacionId', headerName: 'Tipo Identificación', width: 150,
                        valueGetter: (params) => params.row.tipoIdentificacionId === 1 ? 'Cédula' : 'Pasaporte'
                    },
                    { field: 'nombre', headerName: 'Nombre', width: 150 },
                    { field: 'apellido', headerName: 'Apellido', width: 200 },
                    { field: 'genero', headerName: 'Género', width: 100, 
                        valueGetter: (params) => params.row.genero ? 'Femenino' : 'Masculino' 
                    },
                    { field: 'fechaNacimiento', headerName: 'Fecha de Nacimiento', width: 200 },
                    { field: 'estrato', headerName: 'Estrato', width: 100 },
                    { field: 'direccion', headerName: 'Dirección', width: 250 },
                    { field: 'celular', headerName: 'Celular', width: 150 },
                    { field: 'estado', headerName: 'Estado', width: 100, 
                        valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo'
                    },
                ]}
                rowCount={rowCount}
                pageSize={pageSize}
                page={page}
                pageSizeOptions={[5, 10, 20, 50]} // Opciones de tamaño de página
                paginationMode="server"
                onPaginationModelChange={handlePaginationModelChange}
                loading={loading}
                sortingMode="server"
                onSortModelChange={(model) => setSortModel(model)}
                filterMode="server"
                onFilterModelChange={(model) => setFilterModel(model)}
                slots={{
                    toolbar: CustomToolbar,
                }}
            />
        </div>
    );
}

// import * as React from 'react';
// import { DataGrid } from '@mui/x-data-grid';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 90, type: 'number' },
//   { field: 'tipoIdentificacionId', headerName: 'Tipo Identificación', width: 150, type: 'number',
//     valueGetter: (params) => params.row.tipoIdentificacionId === 1 ? 'Cédula' : 'Pasaporte' },
//   { field: 'identificacion', headerName: 'Identificación', width: 150, type: 'string' },
//   { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
//   { field: 'apellido', headerName: 'Apellido', width: 200, type: 'string' },
//   { field: 'genero', headerName: 'Género', width: 100, type: 'string',
//     valueGetter: (params) => params.row.genero ? 'Femenino' : 'Masculino' },
//   { field: 'fechaNacimiento', headerName: 'Fecha de Nacimiento', width: 200, type: 'datetime' },
//   { field: 'estrato', headerName: 'Estrato', width: 100, type: 'number' },
//   { field: 'direccion', headerName: 'Dirección', width: 250, type: 'string' },
//   { field: 'celular', headerName: 'Celular', width: 150, type: 'string' },
//   { field: 'estado', headerName: 'Estado', width: 100, type: 'string',
//     valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo' },
// ];

// export default function GridPersona(props) {
//   return (
//     <DataGrid
//       rows={props.personas}
//       onRowSelectionModelChange={(id) => {
//         const selectedIDs = new Set(id);
//         const selectedRowData = props.personas.filter((row) =>
//           selectedIDs.has(row.id)
//         );
//         props.setSelectedRow(selectedRowData[0]);
//         console.log(props.selectedRow);
//       }}
//       columns={columns}
//       initialState={{
//         pagination: {
//           paginationModel: {
//             pageSize: 5,
//           },
//         },
//       }}
//       pageSizeOptions={[5, 10, 20, 50]}
//     />
//   );
// }