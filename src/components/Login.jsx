import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, IconButton,
  InputAdornment, Alert, Link,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import axios from "axios";


const decodeJwt = (jwt) => {
  try {
    const [, payload] = jwt.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
};

export default function Login(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const softBg = isDark ? alpha(theme.palette.primary.light, 0.08) : "#e7f6f7";
  const cardBg = isDark ? theme.palette.background.paper : "#fff";
  const inputBg = isDark ? alpha(theme.palette.common.white, 0.06) : "#fff";
  const inputText = isDark ? alpha("#FFFFFF", 0.92) : theme.palette.text.primary;
  const labelColor = isDark ? alpha("#FFFFFF", 0.75) : theme.palette.text.secondary;
  const borderBase = isDark ? alpha("#FFFFFF", 0.18) : alpha(theme.palette.primary.main, 0.35);
  const borderFocus = theme.palette.primary.main;
  const borderWrap = isDark ? alpha(theme.palette.primary.light, 0.45) : alpha(theme.palette.primary.main, 0.35);
  const titleColor = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

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

  const clearAuth = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiration");
      localStorage.removeItem("tver");
      localStorage.removeItem("empresaId");
      localStorage.removeItem("rolId");
      localStorage.removeItem("empresaNombre");
      localStorage.removeItem("rolesByCompany");
      localStorage.removeItem("activeModule");
    } catch {}
  };

  const persistAuth = (
    jwt,
    { empresaId, rolId, empresaNombre, rolesByCompany, decodeJwt }
  ) => {
    const { exp, tver } = decodeJwt(jwt || "");
    const expiration = exp ? exp * 1000 : Date.now() + 3 * 60 * 60 * 1000;

    localStorage.setItem("token", jwt);
    localStorage.setItem("token_expiration", String(expiration));
    if (typeof tver !== "undefined") localStorage.setItem("tver", String(tver));
    if (empresaId != null) localStorage.setItem("empresaId", String(empresaId));
    if (rolId != null) localStorage.setItem("rolId", String(rolId));
    localStorage.setItem("rolesByCompany", JSON.stringify(rolesByCompany || []));

    const inferredName =
      empresaNombre ||
      (rolesByCompany?.find(
        (r) => String(r.empresaId) === String(empresaId) && String(r.rolId) === String(rolId)
      )?.empresaNombre) ||
      "";
    if (inferredName) localStorage.setItem("empresaNombre", inferredName);
  };
const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateEmail(username)) {
      setError(t("invalid_email") || "Correo inválido");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URI + "/auth/v2/login",
        { username, password }
      );

      const {
        token,
        empresaId, rolId, empresaNombre,
        rolesByCompany = [],
        usuarioEstado,
        estadoUsuario,
        estado: estadoPlano,
      } = data || {};

      const { estado: estadoJwt } = decodeJwt(token || "");
      const candidatos = [estadoPlano, usuarioEstado, estadoUsuario, estadoJwt];
      const primeroValido = candidatos.find(v => Number.isFinite(Number(v)));
      const estado = typeof primeroValido !== "undefined" ? Number(primeroValido) : null;

      if (estado === null) {
        clearAuth();
        props.setIsAuthenticated?.(false);
        setError("No se recibió el estado del usuario desde el backend.");
        return;
      }

      switch (estado) {
        case 0: {
          clearAuth();
          props.setIsAuthenticated?.(false);
          setError("Tu usuario está desactivado. Contacta al administrador.");
          break;
        }
        case 1: {
          clearAuth();
          props.setIsAuthenticated?.(false);
          setError("Debes activar tu cuenta desde el email de verificación.");
          break;
        }
        case 2: {
  if (!token) { 
    clearAuth(); 
    setError("No se recibió token válido."); 
    break; 
  }
  persistAuth(token, { empresaId, rolId, empresaNombre, rolesByCompany, decodeJwt });
  localStorage.setItem("activeModule", "form_registro_persona");

  // 🚀 Ruta de onboarding persona (App la intercepta y muestra solo el formulario)
  navigate("/coagronet/onboarding/persona", { replace: true });
  break;
}

case 3: {
  if (!token) { 
    clearAuth(); 
    setError("No se recibió token válido."); 
    break; 
  }
  persistAuth(token, { empresaId, rolId, empresaNombre, rolesByCompany, decodeJwt });
  localStorage.setItem("activeModule", "form_registro_empresa");

  // 🚀 Ruta de onboarding empresa (App la intercepta y muestra solo el formulario)
  navigate("/coagronet/onboarding/empresa", { replace: true });
  break;
}

        case 4:
        default: { // Completo
          if (!token) { clearAuth(); setError("No se recibió token válido."); break; }
          persistAuth(token, { empresaId, rolId, empresaNombre, rolesByCompany, decodeJwt });
          localStorage.removeItem("activeModule");
          // ✅ Ahora sí, autenticado → mostrará menú en App
          props.setIsAuthenticated?.(true);
          navigate("/coagronet/", { replace: true });
          break;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.response?.status === 401
        ? (t("invalid_credentials") || "Usuario o contraseña inválidos")
        : (err?.response?.data?.message || t("login_error") || "Ocurrió un error iniciando sesión");
      setError(msg);
      clearAuth();
      props.setIsAuthenticated?.(false);
    } finally {
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
          bgcolor: cardBg,
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
        <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: titleColor, mb: 0.5, lineHeight: 1.05 }}>
          Inicia sesión
        </Typography>
        <Typography align="center" sx={{ color: textSecondary, mb: 3 }}>
          Bienvenido de vuelta a Inventario Usco
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
            sx: { color: labelColor, "&.Mui-focused": { color: borderFocus } },
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
            sx: { color: labelColor, "&.Mui-focused": { color: borderFocus } },
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
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
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
          <Link component={RouterLink} to="/forgot" underline="none">
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func,
  setCurrentModule: PropTypes.func,
};
