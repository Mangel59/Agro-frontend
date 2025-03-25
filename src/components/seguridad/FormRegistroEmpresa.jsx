/**
 * @file FormRegistroEmpresa.jsx
 * @module FormRegistroEmpresa
 * @description Formulario para registrar una empresa asociada a un usuario, con validación de campos y control de flujo del módulo mostrado.
 * @author Karla
 */

import Contenido from '../dashboard/Contenido.jsx';
import * as React from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
  Box
} from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import axios from '../axiosConfig';

/**
 * @typedef {Object} EmpresaRow
 * @property {string} nombre - Nombre de la empresa
 * @property {string} descripcion - Descripción de la empresa
 * @property {number} estado - Estado de la empresa (1 = activo, 0 = inactivo)
 * @property {string} celular - Teléfono de contacto
 * @property {string} correo - Correo electrónico de contacto
 * @property {string} contacto - Nombre del encargado
 * @property {number} tipoIdentificacionId - Tipo de identificación (1 = Cédula, 2 = Pasaporte)
 * @property {string} identificacion - Número de identificación
 * @property {number} personaId - ID de la persona asociada
 */

/**
 * @callback SetCurrentModuleCallback
 * @param {JSX.Element} component - Componente React que se desea renderizar
 */

/**
 * @typedef {Object} FormRegistroEmpresaProps
 * @property {EmpresaRow} [selectedRow] - Datos preseleccionados para la empresa
 * @property {SetCurrentModuleCallback} setCurrentModule - Función para cambiar el módulo actual mostrado
 */

/**
 * Componente de formulario para registrar una empresa.
 *
 * @param {FormRegistroEmpresaProps} props
 * @returns {JSX.Element}
 */
export default function FormRegistroEmpresa(props) {
  const url = `${SiteProps.urlbasev1}/empresas/empresa-usuario`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log('formJson __', formJson);

    axios
      .post(url, formJson)
      .then((response) => {
        console.log('Empresa creada con éxito:', response.data);

        const usuarioEstado = response.data.usuarioEstado;

        if (usuarioEstado === 4) {
          props.setCurrentModule(
            <Contenido setCurrentModule={props.setCurrentModule} />
          );
        }
      })
      .catch((error) => {
        console.error('Error al crear la empresa:', error);
      });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFF',
        padding: 3,
        mt: 45
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 400
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" component="h2" gutterBottom>
            Formulario Empresa
          </Typography>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="nombre"
              name="nombre"
              label="Nombre de la Empresa"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.nombre || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.descripcion || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel
              id="estado-label"
              sx={{
                backgroundColor: 'white',
                padding: '0 8px'
              }}
            >
              Estado
            </InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || 0}
              fullWidth
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="celular"
              name="celular"
              label="Celular"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.celular || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="correo"
              name="correo"
              label="Correo"
              type="email"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.correo || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="contacto"
              name="contacto"
              label="Nombre de Encargado"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.contacto || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel
              id="tipoIdentificacionId-label"
              sx={{
                backgroundColor: 'white',
                padding: '0 8px'
              }}
            >
              Tipo de Identificación
            </InputLabel>
            <Select
              labelId="tipoIdentificacionId-label"
              id="tipoIdentificacionId"
              name="tipoIdentificacionId"
              defaultValue={props.selectedRow?.tipoIdentificacionId || ''}
              fullWidth
            >
              <MenuItem value={1}>Cédula</MenuItem>
              <MenuItem value={2}>Pasaporte</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="identificacion"
              name="identificacion"
              label="Número de Identificación"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.identificacion || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="personaId"
              name="personaId"
              label="ID Persona"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.personaId || 0}
            />
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar Empresa
          </Button>
        </form>
      </Box>
    </Container>
  );
}
