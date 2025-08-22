/**
 * @file Login.jsx
 * @module Login
 * @description Login con token inmediato desde /auth/v2/login.
 *              Sin selección en el login (el cambio de empresa/rol va en RoleSwitcherModal).
 */

import React, { useState } from "react";
import {
  Container, TextField, Button, Typography, Box,
  IconButton, InputAdornment, Alert, Link, useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import axios from "axios";
import ForgotPassword from "../ForgotPassword";

export default function Login(props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateEmail(username)) {
      setError(t("invalid_email"));
      return;
    }

    try {
      // <<< NUEVO ENDPOINT >>>
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URI + "/auth/v2/login",
        { username, password }
      );

      // Esperado: { token, empresaId, rolId, empresaNombre?, rolesByCompany: [] }
      const {
        token,
        empresaId,
        rolId,
        empresaNombre,
        rolesByCompany = [],
      } = data || {};

      if (!token) {
        setError(t("login_error"));
        return;
      }

      // >>> NO SE BORRA: cálculo de expiración (3h)
      const expiration = Date.now() + 3 * 60 * 60 * 1000; // 3 horas en milisegundos
      localStorage.setItem("token", token);
      localStorage.setItem("token_expiration", String(expiration));

      if (empresaId != null) localStorage.setItem("empresaId", String(empresaId));
      if (rolId != null) localStorage.setItem("rolId", String(rolId));

      localStorage.setItem("rolesByCompany", JSON.stringify(rolesByCompany || []));

      // Nombre visible en el menú (si viene), si no, intenta inferirlo
      const nombre =
        empresaNombre ||
        (rolesByCompany.find(
          (r) => String(r.empresaId) === String(empresaId) && String(r.rolId) === String(rolId)
        )?.empresaNombre) ||
        "";
      if (nombre) localStorage.setItem("empresaNombre", nombre);

      if (props.setIsAuthenticated) props.setIsAuthenticated(true);

      // Ir al Home (la app re-evalúa permisos/menú con el token actual)
      window.location.replace("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(t("login_error"));
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
        p: 3, mt: 15,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex", flexDirection: "column", gap: 3, p: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4, boxShadow: theme.shadows[4],
          width: "100%", maxWidth: 400,
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
          {t("login")}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          sx={{ py: "12px", borderRadius: 3, textTransform: "none", fontWeight: "bold" }}
        >
          {t("login")}
        </Button>

        <Button
          variant="text"
          onClick={() => props.setCurrentModule(<ForgotPassword setCurrentModule={props.setCurrentModule} />)}
          sx={{ color: theme.palette.primary.main }}
        >
          ¿Olvidaste tu contraseña?
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: theme.palette.text.secondary }}>
          {t("no_account")}{" "}
          <Link component={RouterLink} to="/register" sx={{ color: theme.palette.primary.main, textDecoration: "none", fontWeight: "bold" }}>
            {t("register_here")}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func,
  setCurrentModule: PropTypes.func,
};
