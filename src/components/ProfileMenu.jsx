import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChangePasswordDialog from "./ChangePasswordDialog";
import MessageSnackBar from "./MessageSnackBar";
import Login from "./Login";
import RoleSwitcherModal from "./RoleSwitcherModal"; 

const ProfileMenu = ({ setCurrentModule, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "", text: "" });
  const [nombreUsuario, setNombreUsuario] = useState("Mi Perfil");
  const [openRoleModal, setOpenRoleModal] = useState(false); 

  useEffect(() => {
    const empresaNombre = localStorage.getItem("empresaNombre");
    if (empresaNombre) setNombreUsuario(empresaNombre);
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("empresaNombre");
    localStorage.removeItem("empresaId");
    localStorage.removeItem("rolId");
    localStorage.removeItem("rolesByCompany");
    setIsAuthenticated(false);
    setCurrentModule(
      <Login
        setIsAuthenticated={setIsAuthenticated}
        setCurrentModule={setCurrentModule}
      />
    );
    handleClose();
  };

  const afterSwitch = () => {
    // recarga para re-evaluar permisos/menú con el nuevo token
    window.location.reload();
  };

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
        startIcon={<AccountCircle />}
      >
        {nombreUsuario}
      </Button>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { setPasswordDialogOpen(true); handleClose(); }}>
          Cambiar Contraseña
        </MenuItem>

        {/* NUEVO: Cambiar empresa/rol */}
        <MenuItem onClick={() => { setOpenRoleModal(true); handleClose(); }}>
          Cambiar empresa/rol
        </MenuItem>

        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        setOpen={setPasswordDialogOpen}
        setMessage={setMessage}
      />
      {message.open && <MessageSnackBar {...message} setMessage={setMessage} />}

      {/* Modal Cambiar empresa/rol */}
      <RoleSwitcherModal
        open={openRoleModal}
        onClose={() => setOpenRoleModal(false)}
        onSwitched={afterSwitch}
      />
    </>
  );
};

export default ProfileMenu;
