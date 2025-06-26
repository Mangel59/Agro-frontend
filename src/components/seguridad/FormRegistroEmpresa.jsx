import Contenido from '../dashboard/Contenido.jsx';
import * as React from 'react';
import {
  Button, TextField, FormControl, InputLabel, MenuItem, Select,
  Typography, Container, Box, useTheme
} from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import axios from '../axiosConfig';

export default function FormRegistroEmpresa(props) {
  const url = import.meta.env.VITE_BACKEND_URI + '/api/v1/empresas/empresa-usuario';
  const theme = useTheme();

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    formJson.tipoIdentificacionId = parseInt(formJson.tipoIdentificacionId);
    formJson.estadoId = parseInt(formJson.estadoId);
    formJson.personaId = props.personaId;

    const token = localStorage.getItem('token');

    axios.post(url, formJson, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setError('');
        setSuccess('Empresa creada con éxito');
        if (response.data.usuarioEstado === 4) {
          props.setCurrentModule(
            <Contenido setCurrentModule={props.setCurrentModule} />
          );
        }
      })
      .catch((error) => {
        console.error('Error al crear la empresa:', error);
        const message = error.response?.data?.message || 'No se pudo crear la empresa.';
        setError(message);
        setSuccess('');
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
        backgroundColor: theme.palette.background.default,
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
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" variant="body2">
            {success}
          </Typography>
        )}

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
            <InputLabel id="tipoIdentificacionId-label">Tipo de Identificación</InputLabel>
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

          <FormControl fullWidth margin="normal">
            <InputLabel id="estadoId-label">Estado</InputLabel>
            <Select
              labelId="estadoId-label"
              id="estadoId"
              name="estadoId"
              defaultValue={props.selectedRow?.estadoId || 1}
              fullWidth
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={2}>Inactivo</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar Empresa
          </Button>
        </form>
      </Box>
    </Container>
  );
}
