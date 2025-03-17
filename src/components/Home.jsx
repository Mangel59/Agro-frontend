
/**
 * Home componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TipoIdentificacion from './TipoIdentificacion';
import Persona from './personas/Persona.jsx';
import PerfilGroup from './PerfilGroup';

/**
 * Componente Home.
 * @module Home.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Home(props) {
  const [currentModule, setCurrentModule] = React.useState(props.currentModule);
//Tambien debe redirigir a empresa
  const components = {
    perfil_group: <PerfilGroup setCurrentModule={setCurrentModule} />,
    persona: <Persona />,
    tipo_identificacion: <TipoIdentificacion />
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Module: {currentModule}
        </Typography>
        {components[currentModule]}
      </Paper>
    </Box>
  );
}

