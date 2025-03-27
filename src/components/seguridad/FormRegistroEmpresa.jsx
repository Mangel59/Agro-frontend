/**
 * FormRegistroEmpresa componente principal.
 * @component
 * @returns {JSX.Element}
 */
import Contenido from '../dashboard/Contenido.jsx';
import * as React from 'react';
import {
  Button, TextField, FormControl, InputLabel, MenuItem, Select,
  Typography, Container, Box
} from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import axios from '../axiosConfig';

export default function FormRegistroEmpresa(props) {
  const url = `${SiteProps.urlbasev1}/empresas/empresa-usuario`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Transformaciones y valores automáticos
    formJson.tipoIdentificacionId = parseInt(formJson.tipoIdentificacionId);
    formJson.estado = 1; // Siempre activa
    formJson.personaId = props.personaId; // Se inyecta desde FormRegistroPersona
    formJson.email = formJson.correo; // Se transforma para el backend
    delete formJson.correo;

    console.log('formJson limpio __', formJson);

    axios.post(url, formJson)
      .then((response) => {
        console.log('Empresa creada con éxito:', response.data);
        if (response.data.usuarioEstado === 4) {
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
        mt: 45,
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
          maxWidth: 400,
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
                padding: '0 8px',
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
              <MenuItem value={6}>NIT</MenuItem>
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

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar Empresa
          </Button>
        </form>
      </Box>
    </Container>
  );
}
