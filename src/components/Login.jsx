import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, InputAdornment, Alert, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import LoginIcon from '@mui/icons-material/Login';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import FormRegistroPersona from './seguridad/FormRegistroPersona';
import FormRegistroEmpresa from './seguridad/FormRegistroEmpresa';
import Contenido from '../components/dashboard/Contenido';
import PropTypes from "prop-types";


export default function Login(props) {
  const { t, i18n } = useTranslation(); // Hook de traducción
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario/correo electrónico
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [error, setError] = useState(''); // Estado para manejar errores de autenticación
  const toggleTheme = useThemeToggle(); // Hook para alternar entre temas

  /**
   * Alterna la visibilidad del campo de la contraseña.
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Previene la acción predeterminada cuando se presiona el botón del mouse en el icono para mostrar/ocultar contraseña.
   *
   * @param {Event} event - El evento de mouse down.
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * Valida si el correo electrónico introducido tiene un formato válido.
   *
   * @param {string} email - El correo electrónico a validar.
   * @returns {boolean} - Devuelve true si el correo es válido, de lo contrario false.
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Maneja el envío del formulario, valida los datos y envía la solicitud de inicio de sesión al servidor.
   * Dependiendo de la respuesta, redirige al usuario al módulo correspondiente.
   *
   * @param {Event} event - El evento de envío del formulario.
   */  
  const handleSubmit = (event) => {
    event.preventDefault(); // Previene la recarga de la página al enviar el formulario
    setError(''); // Reinicia cualquier mensaje de error

    if (!validateEmail(username)) {
      setError(t('invalid_email')); // Muestra mensaje de error si el correo no es válido
      return;
    }

    // Petición al backend para el login
    // axios.post('http://172.16.79.156:8080/auth/login', {
    axios.post('http://localhost:8080/auth/login', {
      username,
      password,
    })
    .then(response => {
      // Guardar el token en el almacenamiento local para manejar la sesión
      localStorage.setItem('token', response.data.token);

      // Verificar si props.setIsAuthenticated existe y es una función
      if (props.setIsAuthenticated && typeof props.setIsAuthenticated === 'function') {
        // Actualizar el estado de autenticación global
        props.setIsAuthenticated(true);
      } else {
        console.warn('setIsAuthenticated no está disponible o no es una función.');
      }

      const usuarioEstado = response.data.usuarioEstado;

      // Según el estado del usuario, redirigir a los módulos correspondientes
      if (usuarioEstado === 2) {
        props.setCurrentModule(<FormRegistroPersona setCurrentModule={props.setCurrentModule} />);
      } else if (usuarioEstado === 3) {
        props.setCurrentModule(<FormRegistroEmpresa setCurrentModule={props.setCurrentModule} />);
      } else if (usuarioEstado === 4) {
        props.setCurrentModule(<Contenido setCurrentModule={props.setCurrentModule} />);
      }
    })
    .catch(error => {
      setError(t('login_error')); // Mostrar error si la autenticación falla
      console.error('There was an error logging in!', error);
    });
  };

  /**
   * Cambia el idioma de la aplicación usando la biblioteca i18n.
   *
   * @param {string} lng - El código de idioma al que cambiar (por ejemplo, 'en' para inglés, 'es' para español).
   */
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };
// Validación de props
Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
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
        mt: 15,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
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
        <Typography 
          variant="h4"  
          component="h1" 
          align="center" 
          sx={{ 
            fontWeight: 'bold', 
            marginBottom: 3, 
            color: '#1a237e',
          }}
        >
          {t('login')}
        </Typography>
        {error && (
          <Alert severity="error">{error}</Alert>
        )}
        
        <TextField
          label={t("email")}
          variant="outlined"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                borderColor: '#1e88e5',
              },
              '&:hover fieldset': {
                borderColor: '#1565c0',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#1e88e5',
            },
          }}
        />
        <TextField
          label={t("password")}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                borderColor: '#1e88e5',
              },
              '&:hover fieldset': {
                borderColor: '#1565c0',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#1e88e5',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link
          component={RouterLink}
          to="/forgetpassword"  
          variant="body2"
          align="center"
          sx={{ 
            color: '#1e88e5',  
            textDecoration: 'none',
            marginBottom: 2,  
            fontWeight: 'bold',
            alignSelf: 'flex-end'  
          }}
        >
          {t('Forgot your password?')} 
        </Link>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<LoginIcon />}
          sx={{
            padding: '12px 0',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold',
            backgroundColor: '#1e88e5',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {t('login')}
        </Button>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ marginTop: 3, color: '#666' }}
        >
          {t("no_account")}{" "}
          <Link 
            component={RouterLink} 
            to="/register" 
            sx={{ 
              color: '#1e88e5',
              textDecoration: 'none', 
              fontWeight: 'bold' 
            }}
          >
            {t('register_here')}
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button onClick={() => handleLanguageChange('en')}>English</Button>
          <Button onClick={() => handleLanguageChange('es')}>Español</Button>
        </Box>
      </Box>
    </Container>
  );
}