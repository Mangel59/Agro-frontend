import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
        field: 'id', 
        headerName: 'ID', 
        width: 90,
        type: 'number',
    },
    {
        field: 'departamento',
        headerName: 'Departamento',
        width: 150,
        type: 'string',    
    },
    {
        field: 'nombre',
        headerName: 'Nombre',
        width: 350,
        type:'string',
    },
    {
        field: 'acronimo',
        headerName: 'Acronimo',
        width: 110,
        type: 'string',
        
    }
];

const rowsData = [
  { id: 1, title: 'Snow', description: 'Jon', published: true },
  { id: 2, title: 'Lannister', description: 'Cersei', published: true },
  { id: 3, title: 'Lannister', description: 'Jaime', published: true },
  { id: 4, title: 'Stark', description: 'Arya', published: false },
  { id: 5, title: 'Targaryen', description: 'Daenerys', published: false },
  { id: 6, title: 'Melisandre', description: null, published: true },
  { id: 7, title: 'Clifford', description: 'Ferrara', published: true },
  { id: 8, title: 'Frances', description: 'Rossini', published: false },
  { id: 9, title: 'Roxie', description: 'Harvey', published: true },
];

export default function GridTutorial(props) {
    //const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    // const [selectedRow, setSelectedRow] = React.useState([]);
    
    return (       
        <DataGrid
            rows={rowsData}
            onRowSelectionModelChange={(id) => {
                const selectedIDs = new Set(id);
                const selectedRowData = rowsData.filter((row) =>
                    selectedIDs.has(row.id)
                );
                props.setSelectedRow(selectedRowData[0]);
                // selectedRowData.forEach((eachItem)=> {
                //     console.log(eachItem.id);
                // });
                console.log(props.selectedRow); //prints object
                }
            }
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            pageSizeOptions={[5,10,20,50]}
        />
    );
}