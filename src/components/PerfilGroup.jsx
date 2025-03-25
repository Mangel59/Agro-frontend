/**
 * @file PerfilGroup.jsx
 * @module PerfilGroup
 * @description Componente que muestra tarjetas de navegación a los módulos de persona y empresa.
 * @component
 */

import React from "react";
import { Box, Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import Persona from "../components/personas/Persona";
import Empresa from "../components/empresas/Empresa";

/**
 * Componente PerfilGroup.
 *
 * Muestra dos tarjetas con botones que permiten navegar a los módulos de gestión de personas y empresas.
 *
 * @function
 * @memberof module:PerfilGroup
 * @param {Object} props - Props del componente.
 * @param {Function} props.setCurrentModule - Función para cambiar el módulo visible en la interfaz.
 * @returns {JSX.Element} Elemento React que contiene las tarjetas de navegación.
 */
const PerfilGroup = ({ setCurrentModule }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" p={2} gap={2}>
      {/* Tarjeta para Personas */}
      <Card sx={{ width: 300, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de personas
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" size="small" onClick={() => setCurrentModule(<Persona />)}>
            Ver
          </Button>
        </CardActions>
      </Card>

      {/* Tarjeta para Empresas */}
      <Card sx={{ width: 300, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Empresas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de empresas
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" size="small" onClick={() => setCurrentModule(<Empresa />)}>
            Ver
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default PerfilGroup;
