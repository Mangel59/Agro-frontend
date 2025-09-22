import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import axios from "./components/axiosConfig";
import Login from "./components/Login";

export default function ForgotPassword({ setCurrentModule }) {
  const theme = useTheme();

  // === MISMO FONDO QUE EL RESTO (claro y oscuro) ===
  const softBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.light, 0.08)
      : "#e7f6f7";

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isValidEmail(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    try {
      setSending(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/auth/forgot-password`,
        { email }
      );
      setMessage(
        "Listo. Si el correo existe en el sistema, te enviamos un enlace para restablecer tu contraseña."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Ocurrió un error al enviar el correo."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: softBg, // << usa el mismo fondo
        pt: { xs: 10, md: 12 },
        pb: 6,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 520,
          mx: "auto",
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          boxShadow: theme.shadows[3],
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1, mb: 1 }}>
            Recupera tu contraseña
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Te enviaremos un enlace a tu correo para restablecerla.
          </Typography>
        </Box>

        {message && <Alert severity="success" sx={{ borderRadius: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

        <TextField
          label="Correo electrónico"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineRoundedIcon sx={{ color: theme.palette.text.disabled }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<SendRoundedIcon />}
          disabled={sending}
          sx={{ py: "12px", borderRadius: 3, textTransform: "none", fontWeight: 700 }}
        >
          {sending ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>

        <Button
          variant="text"
          onClick={() => setCurrentModule?.(<Login setCurrentModule={setCurrentModule} />)}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mt: 0.5,
            mx: "auto",
            display: "inline-flex",
            textTransform: "none",
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          Volver a iniciar sesión
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1, color: theme.palette.text.secondary }}>
          Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
        </Typography>
      </Box>
    </Container>
  );
}
