import * as React from 'react';
import {
  Button, TextField, FormControl, InputLabel, MenuItem, Select,
  Typography, Box, Container, useTheme
} from '@mui/material';
import FormRegistroEmpresa from './formRegistroEmpresa';
import { Grid, Alert } from '@mui/material';
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
      const [tiposIdent, setTiposIdent] = React.useState([]);
    const [loadingTipos, setLoadingTipos] = React.useState(false);

    React.useEffect(() => {
      let mounted = true;
      setLoadingTipos(true);
      axios
        .get('/v1/items/tipo_identificacion/0')
        .then(res => {
          const data = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.content)
            ? res.data.content
            : [];
          if (mounted) setTiposIdent(data);
        })
        .catch((e) => {
          console.error('Error cargando tipos de identificación', e);
          if (mounted) setTiposIdent([]);
        })
        .finally(() => mounted && setLoadingTipos(false));
      return () => { mounted = false; };
    }, []);

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
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          p: { xs: 3, sm: 4 },
          bgcolor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: 6,
          width: '100%',
          maxWidth: 990,         
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
  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
    Formulario Persona
  </Typography>

  {!!error && (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  )}
  {!!success && (
    <Alert severity="success" sx={{ mb: 2 }}>
      {success}
    </Alert>
  )}

  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <TextField
        required
        id="nombre"
        name="nombre"
        label="Nombre"
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Ej: María"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.nombre || ''}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="apellido"
        name="apellido"
        label="Apellido"
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Ej: Murillo"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.apellido || ''}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="email"
        name="email"
        label="Correo electrónico"
        type="email"
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="nombre@dominio.com"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.email || ''}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        select
        fullWidth
        id="tipoIdentificacion"
        name="tipoIdentificacion"
        label="Tipo de Identificación"
        variant="outlined"
        size="medium"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.tipoIdentificacion ?? ''}
      >
        <MenuItem value="" disabled>
          {loadingTipos ? 'Cargando...' : 'Seleccione'}
        </MenuItem>
        {tiposIdent.map((it) => {
          const value = it.id ?? it.code ?? '';
          const label = it.nombre ?? it.name ?? it.descripcion ?? value;
          return (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </TextField>
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="identificacion"
        name="identificacion"
        label="Número de Identificación"
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Ej: 1.234.567.890"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.identificacion || ''}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        select
        fullWidth
        id="genero"
        name="genero"
        label="Género"
        variant="outlined"
        size="medium"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.genero ?? ''}
      >
        <MenuItem value="" disabled>Seleccione</MenuItem>
        <MenuItem value="m">Masculino</MenuItem>
        <MenuItem value="f">Femenino</MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="fechaNacimiento"
        name="fechaNacimiento"
        label="Fecha de Nacimiento"
        type="date"
        fullWidth
        variant="outlined"
        size="medium"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.fechaNacimiento || ''}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="estrato"
        name="estrato"
        label="Estrato"
        type="number"
        inputProps={{ min: 0 }}
        fullWidth
        variant="outlined"
        size="medium"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.estrato ?? 0}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="direccion"
        name="direccion"
        label="Dirección"
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Calle 123 #45-67"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.direccion || ''}
      />
    </Grid>

    <Grid item xs={12} md={6}>
      <TextField
        required
        id="celular"
        name="celular"
        label="Celular"
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="+57 3xx xxx xxxx"
        InputLabelProps={{ shrink: true }}
        defaultValue={props.selectedRow?.celular || ''}
      />
    </Grid>
  </Grid>

  <Box sx={{ mt: 3 }}>
    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.25, fontWeight: 700 }}>
      GUARDAR
    </Button>
  </Box>
</form>

      </Box>
    </Container>
  );
}
