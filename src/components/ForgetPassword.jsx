
// /**
//  * ForgetPassword componente principal.
//  * @component
//  * @returns {JSX.Element}
//  */
// // CREADO POR KARLA
// // MODIFICADO POR MARIA

// import React, { useState } from 'react';
// import { Container, TextField, Button, Typography, Box, Alert, Switch } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import axios from './axiosConfig';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useTranslation } from 'react-i18next';
// import { useThemeToggle } from './dashboard/ThemeToggleProvider';
// import AppBarComponent from './dashboard/AppBarComponent'; 


// function ForgetPassword() {
//   const { t, i18n } = useTranslation(); // Integrar i18n para la traducción
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const toggleTheme = useThemeToggle();

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setError('');
//     setSuccess('');

//     // Validación del correo electrónico
//     if (!email) {
//       setError(t('invalid_email'));
//       return;
//     }

//     axios.post('http://tu-api.com/auth/forgot-password', { email })
//       .then(response => {
//         setSuccess(t('registration_success'));
//       })
//       .catch(error => {
//         setError(t('login_error'));
//         console.error('There was an error!', error);
//       });
//   };

//   const handleLanguageChange = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <Container 
//       maxWidth={false}
//       disableGutters
//       sx={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         minHeight: '100vh', 
//         backgroundColor: '#FFF', 
//         padding: 3,
//         mt: 5,
//       }}
//     >
//       <AppBarComponent
//         switchComponent={<Switch onChange={toggleTheme} />} 
//       />
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 3,
//           padding: 4,
//           backgroundColor: 'white',
//           borderRadius: 4,
//           boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
//           width: '100%',
//           maxWidth: 400,
//         }}
//       >
//         {/* cambio hecho por maria 20/08/24*/}
//         {/* Botón para volver a la página de Login */}
//         <Button
//           component={RouterLink}
//           to="/login"
//           variant="contained"
//           color="primary"
//           sx={{
//             padding: '6px',       // Reduce el padding
//             borderRadius: 3,
//             minWidth: 'auto',      // Asegúrate de que el ancho mínimo no se imponga
//             width: '36px',         // Establece un ancho específico para el botón
//             height: '36px',        // Ajusta la altura del botón
//           }}
//         >
//         <ArrowBackIcon fontSize="small" />  {/* Ajusta el tamaño del icono si es necesario */}
//         </Button>
//         <Typography 
//           variant="h4"
//           component="h1" 
//           align="center" 
//           sx={{ 
//             fontWeight: 'bold', 
//             marginBottom: 3, 
//             color: '#1a237e',
//           }}
//         >
//           {t('Recover Password')}
//         </Typography>
//         {error && (
//           <Alert severity="error">{error}</Alert>
//         )}
//         {success && (
//           <Alert severity="success">{success}</Alert>
//         )}
        
//         <TextField
//           label={t('email')}
//           variant="outlined"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           fullWidth
//           sx={{
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 3,
//               '& fieldset': {
//                 borderColor: '#1e88e5',
//               },
//               '&:hover fieldset': {
//                 borderColor: '#1565c0',
//               },
//             },
//             '& .MuiInputLabel-root': {
//               color: '#1e88e5',
//             },
//           }}
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{
//             padding: '12px 0',
//             borderRadius: 3,
//             textTransform: 'none',
//             fontWeight: 'bold',
//             backgroundColor: '#1e88e5',
//             '&:hover': {
//               backgroundColor: '#1565c0',
//             },
//           }}
//         >
//           {t('Send recovery link')}
//         </Button>
//         {/* cambio hecho por maria 21/08/24*/}
//         {/* Botones de cambio de idioma */}
//         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
//           <Button onClick={() => handleLanguageChange('en')}>English</Button>
//           <Button onClick={() => handleLanguageChange('es')}>Español</Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// }

// export default ForgetPassword;

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import AppBarComponent from './dashboard/AppBarComponent';
import axios from './axiosConfig';
import Login from './Login';

const ForgetPassword = ({ setCurrentModule }) => {
  const { t, i18n } = useTranslation();
  const toggleTheme = useThemeToggle();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Correo inválido.' });
      return;
    }

    try {
      setLoading(true);

      // 💥 Formato EXACTO como Postman: x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('email', email);

      await axios.post('/auth/forgot-password', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      setStatus({
        type: 'success',
        message: 'Se ha enviado un enlace de recuperación a tu correo.'
      });
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      setStatus({
        type: 'error',
        message: 'No se pudo enviar el enlace. Intenta más tarde.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
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
        mt: 5
      }}
    >
      <AppBarComponent switchComponent={<Switch onChange={toggleTheme} />} />

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
          maxWidth: 400
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentModule(<Login setCurrentModule={setCurrentModule} />)}
          sx={{
            padding: '6px',
            borderRadius: 3,
            minWidth: 'auto',
            width: '36px',
            height: '36px'
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>

        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{
            fontWeight: 'bold',
            marginBottom: 3,
            color: '#1a237e'
          }}
        >
          Recuperar contraseña
        </Typography>

        {status.message && (
          <Alert severity={status.type}>{status.message}</Alert>
        )}

        <TextField
          label="Correo electrónico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                borderColor: '#1e88e5'
              },
              '&:hover fieldset': {
                borderColor: '#1565c0'
              }
            },
            '& .MuiInputLabel-root': {
              color: '#1e88e5'
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{
            padding: '12px 0',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold',
            backgroundColor: '#1e88e5',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button onClick={() => handleLanguageChange('en')}>English</Button>
          <Button onClick={() => handleLanguageChange('es')}>Español</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgetPassword;
