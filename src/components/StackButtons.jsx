/**
 * @file StackButtons.jsx
 * @module StackButtons
 * @description Componente que muestra un grupo de botones (Agregar, Editar, Eliminar) para gestionar acciones en una tabla o formulario.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Componente de botones de acción para crear, actualizar o eliminar registros.
 *
 * @function
 * @memberof module:StackButtons
 * @param {Object} props - Props del componente.
 * @param {Object} props.methods - Objeto con funciones para manejar las acciones: create, update, deleteRow.
 * @param {Function} props.methods.create - Función para crear un nuevo elemento.
 * @param {Function} props.methods.update - Función para actualizar un elemento existente.
 * @param {Function} props.methods.deleteRow - Función para eliminar un elemento.
 * @returns {JSX.Element} Conjunto de botones de acción con íconos.
 */
function StackButtons(props) {
  const handleClickCreate = () => {
    props.methods.create();
  };

  const handleClickUpdate = () => {
    props.methods.update();
  };

  const handleClickDelete = () => {
    props.methods.deleteRow();
  };

  return (
    <React.Fragment>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleClickCreate}>
          AGREGAR
        </Button>
        <Button startIcon={<EditIcon />} variant="outlined" onClick={handleClickUpdate}>
          ACTUALIZAR
        </Button>
        <Button startIcon={<DeleteIcon />} variant="outlined" onClick={handleClickDelete}>
          ELIMINAR
        </Button>
      </Stack>
      <br />
    </React.Fragment>
  );
}

export default StackButtons;
