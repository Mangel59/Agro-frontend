import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChangePasswordDialog from "./ChangePasswordDialog";
import MessageSnackBar from "./MessageSnackBar";
import Login from "./Login";

const ProfileMenu = ({ setCurrentModule, setIsAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "", text: "" });
  const [nombreUsuario, setNombreUsuario] = useState("Mi Perfil");

useEffect(() => {
  const empresaNombre = localStorage.getItem("empresaNombre");
  if (empresaNombre) {
    setNombreUsuario(empresaNombre);
  }
}, []);


  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("empresaNombre");
    setIsAuthenticated(false);
    setCurrentModule(
      <Login
        setIsAuthenticated={setIsAuthenticated}
        setCurrentModule={setCurrentModule}
      />
    );
    handleClose();
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
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        setOpen={setPasswordDialogOpen}
        setMessage={setMessage}
      />
      {message.open && (
        <MessageSnackBar {...message} setMessage={setMessage} />
      )}
    </>
  );
};

export default ProfileMenu;
