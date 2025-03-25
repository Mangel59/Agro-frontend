/**
 * @file PerfilCard.jsx
 * @module PerfilCard
 * @description Componente de tarjeta visual sin imagen que muestra un título, una descripción
 *              y un botón para cambiar el módulo activo.
 * @component
 */

import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

/**
 * Componente `PerfilCard`.
 *
 * Representa una tarjeta sencilla sin imagen que muestra un título, una descripción
 * y un botón para activar un componente o módulo diferente. Ideal para menús visuales de navegación.
 *
 * @function
 * @memberof module:PerfilCard
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título a mostrar en la tarjeta.
 * @param {string} props.description - Texto descriptivo del módulo que representa la tarjeta.
 * @param {string} props.componentId - Identificador del módulo al que se desea cambiar.
 * @param {Function} props.setCurrentModule - Función que actualiza el módulo actual visible en pantalla.
 * @returns {JSX.Element} Elemento React que representa la tarjeta sin imagen.
 */
export default function PerfilCard(props) {
  const { title, description, componentId, setCurrentModule } = props;

  /**
   * Maneja el evento de clic del botón.
   * Cambia el módulo activo usando la función `setCurrentModule`.
   */
  const handleOpen = () => {
    setCurrentModule(componentId);
  };

  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      {/* Card sin imagen. Se eliminó CardMedia para evitar mostrar espacio vacío. */}

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description} - {componentId}
        </Typography>
      </CardContent>

      <CardActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Open
        </Button>
      </CardActions>
    </Card>
  );
}
