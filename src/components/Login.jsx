// src/components/Login.jsx
import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, IconButton,
  InputAdornment, Alert, Link,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
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
  const isDark = theme.palette.mode === "dark";

  // Fondo de página (mantenemos tu “suave”)
  const softBg = isDark ? alpha(theme.palette.primary.light, 0.08) : "#e7f6f7";

  // --- Tokens fuertes para oscuro ---
  const cardBg       = isDark ? theme.palette.background.paper : "#fff";                 // card oscuro vs blanco
  const inputBg      = isDark ? alpha(theme.palette.common.white, 0.06) : "#fff";        // fondo input
  const inputText    = isDark ? alpha("#FFFFFF", 0.92) : theme.palette.text.primary;     // texto input
  const labelColor   = isDark ? alpha("#FFFFFF", 0.75) : theme.palette.text.secondary;   // label
  const borderBase   = isDark ? alpha("#FFFFFF", 0.18) : alpha(theme.palette.primary.main, 0.35);
  const borderFocus  = theme.palette.primary.main;
  const borderWrap   = isDark ? alpha(theme.palette.primary.light, 0.45)
                              : alpha(theme.palette.primary.main, 0.35);

  const titleColor   = theme.palette.text.primary;
  const textSecondary= theme.palette.text.secondary;

  // Fix autofill (para que no ponga azul en oscuro)
  const autofillStyles = {
    WebkitBoxShadow: `0 0 0 1000px ${inputBg} inset`,
    WebkitTextFillColor: inputText,
    caretColor: inputText,
    transition: "background-color 9999s ease-out 0s",
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
      setSubmitting(true);
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URI + "/auth/v2/login",
        { username, password }
      );

      const { token, empresaId, rolId, empresaNombre, rolesByCompany = [] } = data || {};
      if (!token) {
        setError(t("login_error"));
        setSubmitting(false);
        return;
      }

      const expiration = Date.now() + 3 * 60 * 60 * 1000;
      localStorage.setItem("token", token);
      localStorage.setItem("token_expiration", String(expiration));
      if (empresaId != null) localStorage.setItem("empresaId", String(empresaId));
      if (rolId != null) localStorage.setItem("rolId", String(rolId));
      localStorage.setItem("rolesByCompany", JSON.stringify(rolesByCompany || []));

      const inferredName =
        empresaNombre ||
        (rolesByCompany.find(
          (r) =>
            String(r.empresaId) === String(empresaId) &&
            String(r.rolId) === String(rolId)
        )?.empresaNombre) ||
        "";
      if (inferredName) localStorage.setItem("empresaNombre", inferredName);

      props.setIsAuthenticated?.(true);
      window.location.replace("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(t("login_error"));
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100svw",
        ml: "calc(50% - 50svw)",
        mr: "calc(50% - 50svw)",
        "@supports not (width: 100svw)": {
          width: "100vw",
          ml: "calc(50% - 50vw)",
          mr: "calc(50% - 50vw)",
        },
        bgcolor: softBg,
        pt: { xs: 10, md: 12 },
        pb: { xs: 8, md: 10 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          bgcolor: cardBg,           // oscuro/white
          boxShadow: "none",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: 3,
            border: `2px solid ${borderWrap}`,
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 800, color: titleColor, mb: 0.5, lineHeight: 1.05 }}
        >
          Inicia sesión
        </Typography>
        <Typography align="center" sx={{ color: textSecondary, mb: 3 }}>
          Bienvenido de vuelta a InmeroStock
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label={t("email")}
          type="email"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          autoFocus
          InputLabelProps={{
            sx: {
              color: labelColor,
              "&.Mui-focused": { color: borderFocus },
            },
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: inputBg,
              color: inputText,
              "& fieldset": { borderColor: borderBase },
              "&:hover fieldset": { borderColor: alpha(borderFocus, 0.8) },
              "&.Mui-focused fieldset": { borderColor: borderFocus },
            },
            "& input:-webkit-autofill": autofillStyles,
            "& input:-webkit-autofill:hover": autofillStyles,
            "& input:-webkit-autofill:focus": autofillStyles,
            "& input:-webkit-autofill:active": autofillStyles,
          }}
        />

        <TextField
          label={t("password")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          InputLabelProps={{
            sx: {
              color: labelColor,
              "&.Mui-focused": { color: borderFocus },
            },
          }}
          sx={{
            mb: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: inputBg,
              color: inputText,
              "& fieldset": { borderColor: borderBase },
              "&:hover fieldset": { borderColor: alpha(borderFocus, 0.8) },
              "&.Mui-focused fieldset": { borderColor: borderFocus },
            },
            "& input:-webkit-autofill": autofillStyles,
            "& input:-webkit-autofill:hover": autofillStyles,
            "& input:-webkit-autofill:focus": autofillStyles,
            "& input:-webkit-autofill:active": autofillStyles,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
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
          disabled={submitting}
          sx={{
            py: "12px",
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          {submitting ? t("loading") : t("login")}
        </Button>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            variant="text"
            onClick={() =>
              props.setCurrentModule?.(
                <ForgotPassword setCurrentModule={props.setCurrentModule} />
              )
            }
            sx={{ color: theme.palette.primary.main, textTransform: "none" }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2, color: textSecondary }}>
          {t("no_account")}{" "}
          <Link
            component={RouterLink}
            to="/register"
            sx={{ color: theme.palette.primary.main, textDecoration: "none", fontWeight: 700 }}
          >
            {t("register_here")}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func,
  setCurrentModule: PropTypes.func,
};
