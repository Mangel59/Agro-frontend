/**
 * FormRegistroPersona componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import {
  Button, TextField, FormControl, InputLabel, MenuItem, Select,
  Typography, Box, Container
} from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import axios from '../axiosConfig';
import FormRegistroEmpresa from './FormRegistroEmpresa';

export default function FormRegistroPersona(props) {
  const url = `${SiteProps.urlbasev1}/personas/persona-usuario`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    formJson.tipoIdentificacion = parseInt(formJson.tipoIdentificacion);
    formJson.estrato = parseInt(formJson.estrato);
    formJson.estado = 1;
    formJson.genero = formJson.genero.toLowerCase();

    console.log('formJson limpio __', formJson);

    axios.post(url, formJson)
      .then((response) => {
        console.log('Persona creada con éxito:', response.data);
        if (response.data.usuarioEstado === 3) {
          props.setCurrentModule(
            <FormRegistroEmpresa setCurrentModule={props.setCurrentModule} />
          );
        }
      })
      .catch((error) => {
        console.error('Error al crear la persona:', error);
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
        mt: 55,
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

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel
              id="tipoIdentificacion-label"
              sx={{
                backgroundColor: 'white',
                padding: '0 8px',
              }}
            >
              Tipo de Identificación
            </InputLabel>
            <Select
              labelId="tipoIdentificacion-label"
              id="tipoIdentificacion"
              name="tipoIdentificacion"
              defaultValue={props.selectedRow?.tipoIdentificacion || ''}
              fullWidth
              label="Tipo de Identificación"
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

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel
              id="genero-label"
              sx={{
                backgroundColor: 'white',
                padding: '0 8px',
              }}
            >
              Género
            </InputLabel>
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