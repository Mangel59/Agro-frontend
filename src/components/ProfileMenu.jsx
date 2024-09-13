import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Login from './Login'; 

const ProfileMenu = ({ setCurrentModule, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remover token del almacenamiento local
    localStorage.removeItem('token');
    
    // Actualizar estado de autenticación
    setIsAuthenticated(false);

    // Redirigir al componente Login
    setCurrentModule(<Login setIsAuthenticated={setIsAuthenticated} setCurrentModule={setCurrentModule} />);
    
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
        startIcon={<AccountCircle />}
      >
        Perfil
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setCurrentModule(<PerfilGroup setCurrentModule={setCurrentModule} />)}>Perfiles</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
