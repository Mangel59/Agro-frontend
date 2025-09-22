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
  const [isSingleCompanyAndRole, setIsSingleCompanyAndRole] = useState(false); // Nuevo estado

  useEffect(() => {
    const empresaNombre = localStorage.getItem("empresaNombre");
    const rolesByCompany = JSON.parse(localStorage.getItem("rolesByCompany") || "[]");

    if (empresaNombre) setNombreUsuario(empresaNombre);

    // Verificar si el usuario tiene solo una empresa y un rol
    const empresas = [...new Set(rolesByCompany.map(role => role.empresaId))]; // Empresas únicas
    if (empresas.length === 1 && rolesByCompany.length === 1) {
      setIsSingleCompanyAndRole(true); // Si hay solo una empresa y un rol, actualizar estado
    }
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

        {/* Solo mostrar el menú "Cambiar empresa/rol" si no hay solo una empresa y un rol */}
        {!isSingleCompanyAndRole && (
          <MenuItem onClick={() => { setOpenRoleModal(true); handleClose(); }}>
            Cambiar empresa/rol
          </MenuItem>
        )}

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
