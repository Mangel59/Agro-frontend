/**
 * @file Copyright.jsx
 * @module Copyright
 * @description Muestra el pie de página con derechos de autor y nombre de la aplicación.
 * @component
 */

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { SiteProps } from './SiteProps';

/**
 * Componente Copyright.
 *
 * Muestra el texto de copyright en el pie de página, incluyendo el nombre de la app y el año actual.
 *
 * @param {Object} props - Propiedades adicionales que serán pasadas al componente Typography.
 * @returns {JSX.Element} El componente de copyright renderizado.
 */
export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://inmero.co/">
        {SiteProps.appName}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
