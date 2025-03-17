
/**
 * StackButtons componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Componente StackButtons.
 * @module StackButtons.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function StackButtons(props) {
    // props.handleClickOpen
    const handleClickCreate = (event) => {
        props.methods.create();
        // props.create();
        // props.setOpen(true);
        // console.log("create() " + props.selectedRow);
        // //{props.handleClickOpen};
    };

    const handleClickUpdate = (event) => {
        props.methods.update();
        // props.setOpen(true);
        // console.log("update() " + props.selectedRow);
        //{props.handleClickOpen};
    };

    const handleClickDelete = (event) => {
        props.methods.deleteRow();
        // props.setOpen(true);
        // console.log("delete() " + props.selectedRow);
        //{props.handleClickOpen};
    };

    return (
        <React.Fragment>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                <Button startIcon={<AddIcon />} variant="outlined" onClick={handleClickCreate}>
                    Add
                </Button>
                <Button startIcon={<EditIcon />} variant="outlined" onClick={handleClickUpdate}>
                    Update
                </Button>
                <Button startIcon={<DeleteIcon />} variant="outlined" onClick={handleClickDelete}>
                    Delete
                </Button>
            </Stack>
            <br/>
        </React.Fragment>   
    );
}