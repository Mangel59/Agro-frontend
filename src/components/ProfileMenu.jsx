// creadora:MARIA CUELLAR
// CREADO EL 14/08/2024
// MENU DE PERFILES, CERRAR SECCION
/// AGREGAR
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logout from './Logout';
import PerfilGroup from './PerfilGroup';

const ProfileMenu = ({ setCurrentModule }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setCurrentModule(<PerfilGroup setCurrentModule={setCurrentModule} />);
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
        <MenuItem onClick={handleProfileClick}>Perfiles</MenuItem>
        <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
