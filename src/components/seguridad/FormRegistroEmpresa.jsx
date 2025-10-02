import Contenido from '../dashboard/Contenido.jsx';
import * as React from 'react';
import {
  Button, TextField, FormControl, InputLabel, MenuItem, Select,
  Typography, Container, Box, useTheme, Grid, Alert
} from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps.jsx';
import axios from '../axiosConfig.js';
import { useNavigate } from 'react-router-dom';

// helper para leer estado desde un JWT si te lo devuelven
const decodeJwt = (jwt) => {
  try {
    const [, payload] = jwt.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
};

export default function FormRegistroEmpresa(props) {
  const url = import.meta.env.VITE_BACKEND_URI + '/api/v1/empresas/empresa-usuario';
  const theme = useTheme();
  const navigate = useNavigate();

  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // ---- Tipos de identificación desde backend ----
  const [tiposIdent, setTiposIdent] = React.useState([]);
  const [loadingTipos, setLoadingTipos] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    setLoadingTipos(true);
    axios
      .get('/v1/items/tipo_identificacion/0')
      .then((res) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    formJson.tipoIdentificacionId = parseInt(formJson.tipoIdentificacionId);
    formJson.estadoId = parseInt(formJson.estadoId);
    formJson.personaId = props.personaId;

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(url, formJson, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setError('');
      setSuccess('Empresa creada con éxito');

      // === Determinar nuevo estado ===
      const {
        usuarioEstado,        // a veces viene así
        estado,               // o así
        token: newToken       // o devuelven un nuevo token con "estado"
      } = response.data || {};

      // si te regresan token nuevo, persístelo
      if (newToken) {
        const { exp } = decodeJwt(newToken);
        const expiration = exp ? exp * 1000 : Date.now() + 3 * 60 * 60 * 1000;
        localStorage.setItem('token', newToken);
        localStorage.setItem('token_expiration', String(expiration));
      }

      const estadoJwt = decodeJwt(newToken || token)?.estado;
      const candidatos = [estado, usuarioEstado, estadoJwt];
      const primeroValido = candidatos.find(v => Number.isFinite(Number(v)));
      const nextEstado = typeof primeroValido !== 'undefined' ? Number(primeroValido) : 4;

      if (nextEstado === 4) {
        // ✅ Onboarding completo → mostrar menú
        localStorage.removeItem('activeModule');
        props.setIsAuthenticated?.(true);
        // puedes navegar o montar Contenido
        navigate('/coagronet/', { replace: true });
        // o: props.setCurrentModule(<Contenido setCurrentModule={props.setCurrentModule} />);
        return;
      }

      // Si por alguna razón no quedó en 4, mantén onboarding de empresa
      localStorage.setItem('activeModule', 'form_registro_empresa');
      props.setIsAuthenticated?.(false);
      // Opcional: navigate('/coagronet/onboarding/empresa', { replace: true });
    } catch (e) {
      console.error('Error al crear la empresa:', e);
      const message = e.response?.data?.message || 'No se pudo crear la empresa.';
      setError(message);
      setSuccess('');
    }
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
        bgcolor: theme.palette.background.default,
        p: 3,
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
        {!!error && <Alert severity="error">{error}</Alert>}
        {!!success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Formulario Empresa
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="nombre"
                name="nombre"
                label="Nombre de la Empresa"
                fullWidth
                variant="outlined"
                placeholder="Ej: Inversiones ABC S.A.S."
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.nombre || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                id="contacto"
                name="contacto"
                label="Nombre de Encargado"
                fullWidth
                variant="outlined"
                placeholder="Ej: María Pérez"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.contacto || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                id="correo"
                name="correo"
                type="email"
                label="Correo"
                fullWidth
                variant="outlined"
                placeholder="empresa@dominio.com"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.correo || ''}
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
                placeholder="+57 3xx xxx xxxx"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.celular || ''}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="descripcion"
                name="descripcion"
                label="Descripción"
                fullWidth
                variant="outlined"
                multiline
                minRows={2}
                placeholder="Breve descripción de la empresa"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.descripcion || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                id="tipoIdentificacionId"
                name="tipoIdentificacionId"
                label="Tipo de Identificación"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.tipoIdentificacionId ?? ''}
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
                placeholder="Ej: 900123456-7"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.identificacion || ''}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                id="estadoId"
                name="estadoId"
                label="Estado"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                defaultValue={props.selectedRow?.estadoId || 1}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={2}>Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.25, fontWeight: 700 }}>
              Guardar Empresa
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
