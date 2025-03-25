/**
 * @file ProfileMenu.jsx
 * @module ProfileMenu
 * @description Componente que muestra un menú desplegable de perfil con opciones de navegación y logout.
 * @component
 */

import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PerfilGroup from './PerfilGroup';
import Login from './Login';

/**
 * Componente ProfileMenu.
 *
 * Muestra un botón con un menú desplegable que permite acceder al módulo de perfiles
 * o cerrar sesión. Al cerrar sesión, elimina el token del localStorage y redirige al Login.
 *
 * @function
 * @memberof module:ProfileMenu
 * @param {Object} props - Props del componente.
 * @param {Function} props.setCurrentModule - Función para cambiar el módulo visible.
 * @param {Function} props.setIsAuthenticated - Función para actualizar el estado de autenticación.
 * @returns {JSX.Element} Elemento React del menú de perfil.
 */
const ProfileMenu = ({ setCurrentModule, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * Abre el menú anclado al botón de perfil.
   * @param {React.MouseEvent<HTMLButtonElement>} event - Evento de clic.
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Cierra el menú desplegable.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Cierra sesión eliminando el token, actualiza el estado de autenticación y redirige a Login.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
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
        <MenuItem onClick={() => setCurrentModule(<PerfilGroup setCurrentModule={setCurrentModule} />)}>
          Perfiles
        </MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
