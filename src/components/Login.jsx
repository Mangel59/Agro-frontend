/**
 * @file Login.jsx
 * @module Login
 * @description Componente de inicio de sesión con soporte para selección de empresa automática o manual.
 */

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeToggle } from "./dashboard/ThemeToggleProvider";
import FormRegistroPersona from "./seguridad/FormRegistroPersona";
import FormRegistroEmpresa from "./seguridad/FormRegistroEmpresa";
import Contenido from "../components/dashboard/Contenido";
import PropTypes from "prop-types";
import ForgotPassword from '../ForgotPassword';

export default function Login(props) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedRol, setSelectedRol] = useState("");
  const toggleTheme = useThemeToggle();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

 const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  if (!validateEmail(username)) {
    setError(t("invalid_email"));
    return;
  }

  try {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URI + '/auth/login', {
      username,
      password,
    });

    const rolesPorEmpresa = response.data.rolesByCompany;

    if (rolesPorEmpresa.length === 1) {
      const { empresaId, rolId, empresaNombre } = rolesPorEmpresa[0];

      // Guardamos nombre de empresa directamente
      localStorage.setItem("empresaNombre", empresaNombre);

      await seleccionarEmpresa(empresaId, rolId);
    } else {
      setRoles(rolesPorEmpresa);
      setShowSelection(true);
    }
  } catch (error) {
    setError(t("login_error"));
    console.error("There was an error logging in!", error);
  }
};

const seleccionarEmpresa = async (empresaId, rolId) => {
  try {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URI + '/auth/login/seleccion', {
      username,
      empresaId,
      rolId,
    });

    const token = response.data.token;
    const expiration = Date.now() + 24 * 60 * 60 * 1000;

    localStorage.setItem("token", token);
    localStorage.setItem("token_expiration", expiration.toString());
    localStorage.setItem("empresaId", empresaId); 


    // buscar empresaNombre en roles para almacenarla
    const empresaSeleccionada = roles.find(
      (r) => r.empresaId === empresaId && r.rolId === rolId
    );

    if (empresaSeleccionada) {
      localStorage.setItem("empresaNombre", empresaSeleccionada.empresaNombre);
    }

    if (props.setIsAuthenticated) props.setIsAuthenticated(true);

    // fuerza recarga para que ProfileMenu lea localStorage actualizado
    window.location.reload();
  } catch (e) {
    console.error("Error seleccionando empresa", e);
  }
};

const handleSeleccionSubmit = async (e) => {
  e.preventDefault();

  if (!selectedEmpresa || !selectedRol) {
    setError("Debes seleccionar una empresa y un rol antes de continuar.");
    return;
  }

  try {
    await seleccionarEmpresa(selectedEmpresa, selectedRol);
  } catch (err) {
    setError("Hubo un error al seleccionar la empresa.");
    console.error("Error en selección:", err);
  }
};



  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 3,
        mt: 15,
      }}
    >
      <Box
        component="form"
        onSubmit={showSelection ? handleSeleccionSubmit : handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: theme.shadows[4],
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
          {t("login")}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!showSelection && <>
          <TextField
            label={t("email")}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label={t("password")}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </>}

        {showSelection && (
          <>
            <FormControl fullWidth>
              <InputLabel>{t("empresa")}</InputLabel>
              <Select value={selectedEmpresa} onChange={(e) => setSelectedEmpresa(e.target.value)}>
                {roles.map((r, i) => (
                  <MenuItem key={i} value={r.empresaId}>{r.empresaNombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t("rol")}</InputLabel>
              <Select value={selectedRol} onChange={(e) => setSelectedRol(e.target.value)}>
                {roles
                  .filter((r) => r.empresaId === selectedEmpresa)
                  .map((r, i) => (
                    <MenuItem key={i} value={r.rolId}>{r.rolNombre}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          sx={{ padding: "12px 0", borderRadius: 3, textTransform: "none", fontWeight: "bold" }}
        >
          {t("login")}
        </Button>

        {!showSelection && (
          <Button variant="text" onClick={() => props.setCurrentModule(<ForgotPassword setCurrentModule={props.setCurrentModule} />)} sx={{ color: theme.palette.primary.main }}>
            ¿Olvidaste tu contraseña?
          </Button>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 3, color: theme.palette.text.secondary }}>
          {t("no_account")} {" "}
          <Link component={RouterLink} to="/register" sx={{ color: theme.palette.primary.main, textDecoration: "none", fontWeight: "bold" }}>
            {t("register_here")}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
