import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [state, setState] = useState({
    loading: true,
    success: null,
    message: "",
  });

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setState({
          loading: false,
          success: false,
          message: "Enlace inválido: falta el token.",
        });
        return;
      }
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/auth/verify`,
          { params: { token } }
        );
        setState({
          loading: false,
          success: data?.success ?? false,
          message: data?.message || "Cuenta verificada correctamente.",
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "No fue posible verificar tu cuenta.";
        setState({ loading: false, success: false, message: msg });
      }
    };
    verify();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      {state.loading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Verificando tu cuenta…</Typography>
        </Box>
      ) : (
        <Paper sx={{ p: 4, maxWidth: 480, textAlign: "center" }}>
          {state.success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {state.message}
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mb: 2 }}>
              {state.message}
            </Alert>
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Ir a iniciar sesión
          </Button>
        </Paper>
      )}
    </Box>
  );
}
