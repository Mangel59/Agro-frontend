// src/auth/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Stack, Typography, CircularProgress, Alert, Button, Chip,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "./axiosConfig"; // asegúrate que la ruta es correcta

const persistTokens = (auth) => {
  const access = auth?.accessToken || auth?.access || auth?.token;
  const refresh = auth?.refreshToken || auth?.refresh;
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

const backendOrigin = (() => {
  const base = import.meta.env.VITE_BACKEND_URI || "";
  try {
    // ejemplo: https://dev.api.inmero.co/coagronet -> origin: https://dev.api.inmero.co
    return new URL(base).origin;
  } catch {
    // fallback: quita /api o cualquier path final
    return base.replace(/\/(api|coagronet)(\/.*)?$/, "");
  }
})();

const VERIFY_URL = `${backendOrigin}/auth/verify`;

const logAxiosError = (err) => {
  if (err?.response) {
    console.group("[VERIFY][AXIOS][RESPONSE ERROR]");
    console.log("status:", err.response.status);
    console.log("data:", err.response.data);
    console.groupEnd();
  } else if (err?.request) {
    console.group("[VERIFY][AXIOS][NO RESPONSE]");
    console.log("request:", err.request);
    console.groupEnd();
  } else {
    console.group("[VERIFY][AXIOS][SETUP ERROR]");
    console.log("message:", err?.message);
    console.groupEnd();
  }
};

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => (params.get("token") || "").trim(), [params]);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    if (!token) {
      setSuccess(false);
      setMessage("Token de verificación ausente o inválido.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        console.log("[VERIFY] raw search:", window.location.search);
      console.log("[VERIFY] token param:", token);
      console.log("[VERIFY] token length:", token.length);
        console.group("[VERIFY] Request");
        console.log("VITE_BACKEND_URI:", import.meta.env.VITE_BACKEND_URI);
        console.log("backendOrigin:", backendOrigin);
        console.log("url:", VERIFY_URL);
        console.log("token:", token);
        console.groupEnd();

        const { data, status } = await axios.get(VERIFY_URL, {
          params: { token },
          skipAuth: true,                      // evita Authorization
          headers: { Authorization: undefined }
        });

        console.group("[VERIFY] Response");
        console.log("status:", status);
        console.log("data:", data);
        console.groupEnd();

        if (cancelled) return;

        if (data?.success) {
          setSuccess(true);
          setMessage(data?.message || "Usuario verificado con éxito.");
          if (data?.auth) persistTokens(data.auth);
        } else {
          setSuccess(false);
          setMessage(data?.message || data?.code || "Invalid verification link");
        }
      } catch (err) {
        if (cancelled) return;
        logAxiosError(err);
        const apiMsg =
          err?.response?.data?.message ||
          err?.response?.data?.code ||
          err?.message ||
          "No fue posible verificar la cuenta.";
        setSuccess(false);
        setMessage(apiMsg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (success !== true) return;
    if (countdown <= 0) {
      navigate("/login", { replace: true });
      return;
    }
    const t = setTimeout(() => setCountdown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, navigate]);

  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 560, width: "100%" }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h5" fontWeight={700}>Verificación de cuenta</Typography>

          {loading && (
            <>
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary">Verificando tu cuenta…</Typography>
            </>
          )}

          {!loading && success === true && (
            <>
              <Alert severity="success" sx={{ width: "100%" }}>{message}</Alert>
              <Chip label={`Redirigiendo en ${countdown}s…`} />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={() => navigate("/login", { replace: true })}>Ir a Iniciar sesión</Button>
                <Button variant="text" onClick={() => navigate("/", { replace: true })}>Ir al inicio</Button>
              </Stack>
            </>
          )}

          {!loading && success === false && (
            <>
              <Alert severity="error" sx={{ width: "100%" }}>{message || "Invalid verification link"}</Alert>
              <Typography variant="body2" color="text.secondary">
                Verifica que el enlace no haya expirado o ya haya sido usado.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => navigate("/login")}>Ir a Iniciar sesión</Button>
                <Button variant="text" onClick={() => navigate("/")}>Volver al inicio</Button>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
