// src/auth/Verify.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Paper, Stack, Typography, CircularProgress, Alert, Button, Chip
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "./api/verifyClient.js";

const persistTokens = (auth) => {
  const access = auth?.accessToken || auth?.access || auth?.token;
  const refresh = auth?.refreshToken || auth?.refresh;
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => (params.get("token") || "").trim(), [params]);

  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(null);
  const [msg, setMsg] = useState("");
  const [s, setS] = useState(6);
  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // "/" ó "/coagronet"
  const to = (p) => `${base}${p.startsWith("/") ? p : `/${p}`}`;


  // 👇 evita el doble-disparo del efecto (StrictMode)
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;        // ya corrí antes → no repetir
    ranRef.current = true;

    console.log("[VERIFY] raw search:", window.location.search);
    console.log("[VERIFY] token param:", token, "len:", token.length);

    if (!token) {
      setOk(false);
      setMsg("Token de verificación ausente o inválido.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await verifyEmail(token);
        console.log("[VERIFY] Response:", data);

        if (data?.success) {
          setOk(true);
          setMsg(data?.message || "Usuario verificado con éxito.");
          if (data?.auth) persistTokens(data.auth);
        } else {
          setOk(false);
          setMsg(data?.message || data?.code || "Invalid verification link");
        }
      } catch (e) {
        console.error("[VERIFY][ERROR]:", e?.response?.data || e?.message);
        setOk(false);
        setMsg(e?.response?.data?.message || e?.message || "No fue posible verificar la cuenta.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (ok !== true) return;
    const t = setTimeout(() => setS((x) => x - 1), 1000);
    if (s <= 0) navigate("/login", { replace: true });
    return () => clearTimeout(t);
  }, [ok, s, navigate]);

  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 560, width: "100%" }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h5" fontWeight={700}>Verificación de cuenta</Typography>

          {loading && (<>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">Verificando…</Typography>
          </>)}

          {!loading && ok === true && (<>
            <Alert severity="success" sx={{ width: "100%" }}>{msg}</Alert>
            <Chip label={`Redirigiendo en ${s}s…`} />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => navigate(to("/login"), { replace: true })}>
                Ir a Iniciar sesión
              </Button>
              <Button variant="text" onClick={() => navigate(to("/"), { replace: true })}>
                Inicio
              </Button>
            </Stack>
          </>)}

          {!loading && ok === false && (<>
            <Alert severity="error" sx={{ width: "100%" }}>{msg}</Alert>
            <Typography variant="body2" color="text.secondary">
              Verifica que el enlace no haya expirado o ya haya sido usado.
            </Typography>
            <Stack direction="row" spacing={1}>
             <Button variant="contained" onClick={() => navigate(to("/login"), { replace: true })}>
                Ir a Iniciar sesión
              </Button>
              <Button variant="text" onClick={() => navigate(to("/"), { replace: true })}>
                Inicio
              </Button>
            </Stack>
          </>)}
        </Stack>
      </Paper>
    </Box>
  );
}
