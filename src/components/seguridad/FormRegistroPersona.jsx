import * as React from 'react';
import { Button, TextField, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import axios from '../axiosConfig';
// import axios from 'axios'
import FormRegistroEmpresa from './FormRegistroEmpresa';




export default function FormRegistroPersona(props) {
  // Definimos la URL del endpoint
  const url = `${SiteProps.urlbasev1}/personas/persona-usuario`;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log('formJson __', formJson);

    // Aquí hacemos la solicitud POST a la API usando axios
    axios.post(url, formJson)
      .then((response) => {
        console.log('Persona creada con éxito:', response.data);


        const usuarioEstado = response.data.usuarioEstado;

        if ( usuarioEstado  == 3 ) {
          props.setCurrentModule( <FormRegistroEmpresa setCurrentModule={props.setCurrentModule}/>)
        }
       
      })
      .catch((error) => {
        console.error('Error al crear la persona:', error);
      });
  };

  return (
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
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <TextField
          required
          id="identificacion"
          name="identificacion"
          label="Identificación"
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
          defaultValue={props.selectedRow?.genero ? 'f' : 'm'}
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
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="estado-label">Estado</InputLabel>
        <Select
          labelId="estado-label"
          id="estado"
          name="estado"
          defaultValue={props.selectedRow?.estado || 0}
          fullWidth
        >
          <MenuItem value={0}>Inactivo</MenuItem>
          <MenuItem value={1}>Activo</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Guardar
      </Button>
    </form>
  );
}