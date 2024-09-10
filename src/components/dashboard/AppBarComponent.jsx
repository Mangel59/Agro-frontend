import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Switch } from '@mui/material';
import Login from '../Login';
import Register from '../Register';
import Logout from '../Logout';
import { useThemeToggle } from './ThemeToggleProvider';


export default function AppBarComponent(props) {
  const location = useLocation();
  const [showLogout, setShowLogout] = React.useState(false);
  const toggleTheme = useThemeToggle();

  const handleLogin = () => {
    props.setCurrentModule(<Login setShowLogout={setShowLogout} setCurrentModule={props.setCurrentModule} />);
  };

  const handleRegister = () => {
    props.setCurrentModule(<Register setCurrentModule={props.setCurrentModule} />);
  };

  const handleLogout = () => {
    props.setCurrentModule(<Logout setCurrentModule={props.setCurrentModule} />);
  };

  // Detectamos si la URL es '/login' para mostrar el módulo Login al cargar la página
  React.useEffect(() => {
    if (location.pathname === '/login') {
      handleLogin(); // Llama a tu lógica para cambiar el componente a Login
    }
    if (location.pathname === '/register') {
      handleRegister(); // Llama a tu lógica para cambiar el componente a Register
    }
  }, [location.pathname]);

  return (
    <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#114232' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Agro Application
        </Typography>
        <Switch onChange={toggleTheme} />
        <Button color="inherit" onClick={handleLogin} sx={{ mr: 2 }}>
          Login
        </Button>
        <Button color="inherit" onClick={handleRegister}>
          Register
        </Button>
        {showLogout && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}





// import React from 'react';
// import { Switch } from '@mui/material';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import { Link } from 'react-router-dom';
// import Register from '../Register';
// import Login from '../Login';
// import { useThemeToggle } from './ThemeToggleProvider';
// import Logout from '../Logout';

// export default function AppBarComponent( props) {

//   const [showLogout, setShowLogout] = React.useState(false);
//   const handleLogin = () => {
    
//     props.setCurrentModule (<Login setShowLogout={setShowLogout} setCurrentModule={props.setCurrentModule}/>)
//     //navigate('/login');
    
// };

// const handleRegister = () => {
//     // navigate('/register');
//     props.setCurrentModule (<Register setCurrentModule={props.setCurrentModule}/>)
// };

// const handleLogout = () => {
//   props.setCurrentModule (<Logout setCurrentModule={props.setCurrentModule}/>)
// };

// const buttonLabel="Register";
//     // onButtonClick={handleRegister}

// const secondaryButtonLabel="Login";
//       // onSecondaryButtonClick={handleLogin}

// const buttonLabelLogout="Logout";

// const toggleTheme = useThemeToggle();


//   return (
//     <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#114232' }}>
      
//       <Toolbar>
//         <Typography 
//           variant="h6" 
//           sx={{ flexGrow: 1 }} 
//           component={Link} // Usamos Link como el componente subyacente de Typography
//           to="/" // Dirección a la que queremos redirigir al hacer clic
//           style={{ textDecoration: 'none', color: 'inherit' }} // Sin subrayado y mantiene el color del texto
//         >
//           Agro Application
//         </Typography>
//         <Switch onChange={toggleTheme} />
//         {/* {switchComponent && (
//           <Box sx={{ marginRight: 2 }}>
//             {switchComponent}
//           </Box>
//         )} */}
//         {secondaryButtonLabel && (
//           <Button color="inherit" onClick={handleLogin} sx={{ mr: 2 }} >
//             {secondaryButtonLabel}
//           </Button>
//         )}
//         <Button color="inherit" onClick={handleRegister}>
//           {buttonLabel}
//         </Button>
//         {showLogout && (
//         <Button color="inherit" onClick={handleLogout} open={showLogout} >
//         {buttonLabelLogout}
//         </Button>
//         )}
        
//       </Toolbar>
//     </AppBar>
//   );
// }

