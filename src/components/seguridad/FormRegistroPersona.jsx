import * as React from 'react';
import {
  Button, TextField, FormControl, InputLabel, MenuItem, Select,
  Typography, Box, Container, useTheme
} from '@mui/material';
import FormRegistroEmpresa from './FormRegistroEmpresa';
import axios from "../axiosConfig";

export default function FormRegistroPersona(props) {
  const theme = useTheme();

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    formJson.tipoIdentificacion = parseInt(formJson.tipoIdentificacion);
    formJson.estrato = parseInt(formJson.estrato);
    formJson.estado = 1;
    formJson.genero = formJson.genero.toLowerCase();

    const token = localStorage.getItem('token');
    const url = import.meta.env.VITE_BACKEND_URI + '/api/v1/personas/persona-usuario';

    axios.post(url, formJson, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setError('');
        setSuccess('Persona creada con éxito');
        if (response.data.usuarioEstado === 3) {
          props.setCurrentModule(
            <FormRegistroEmpresa
              setCurrentModule={props.setCurrentModule}
              personaId={response.data.id}
            />
          );
        }
      })
      .catch((error) => {
        console.error('Error al crear la persona:', error);
        const message = error.response?.data?.message || 'No se pudo crear la persona.';
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
        mt: 55,
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
            Formulario Persona
          </Typography>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.nombre || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="apellido"
              name="apellido"
              label="Apellido"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.apellido || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="email"
              name="email"
              label="Correo electrónico"
              type="email"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.email || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="tipoIdentificacion-label">Tipo de Identificación</InputLabel>
            <Select
              labelId="tipoIdentificacion-label"
              id="tipoIdentificacion"
              name="tipoIdentificacion"
              defaultValue={props.selectedRow?.tipoIdentificacion || ''}
              fullWidth
            >
              <MenuItem value={1}>Cédula</MenuItem>
              <MenuItem value={2}>Pasaporte</MenuItem>
              <MenuItem value={8}>Otro</MenuItem>
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
            <InputLabel id="genero-label">Género</InputLabel>
            <Select
              labelId="genero-label"
              id="genero"
              name="genero"
              defaultValue={props.selectedRow?.genero || ''}
              fullWidth
            >
              <MenuItem value="m">Masculino</MenuItem>
              <MenuItem value="f">Femenino</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="fechaNacimiento"
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.fechaNacimiento || ''}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="estrato"
              name="estrato"
              label="Estrato"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.estrato || 0}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="direccion"
              name="direccion"
              label="Dirección"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.direccion || ''}
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

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
