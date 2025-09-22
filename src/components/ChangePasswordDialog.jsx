import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, InputAdornment, IconButton, Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const decodeJwt = (jwt) => {
  try {
    const [, payload] = jwt.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch { return {}; }
};

// helper para respetar /coagronet
const go = (path = "") => {
  const base = import.meta.env.BASE_URL || "/";
  const sep = base.endsWith("/") ? "" : "/";
  window.location.replace(`${base}${sep}${path}`);
};

export default function ChangePasswordDialog({ open, setOpen, setMessage }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleVisibility = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));

  const validarContraseñaSegura = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

  const clearAuth = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiration");
      localStorage.removeItem("tver");
      localStorage.removeItem("empresaId");
      localStorage.removeItem("rolId");
      localStorage.removeItem("empresaNombre");
      localStorage.removeItem("rolNombre");
    } catch {}
  };

  const saveToken = (token) => {
    const { exp, tver } = decodeJwt(token);
    const expiration = exp ? exp * 1000 : Date.now() + 3 * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiration", String(expiration));
    if (typeof tver !== "undefined") localStorage.setItem("tver", String(tver));
  };

  const handleSubmit = async () => {
    setError(""); setSuccessMessage("");

    const { oldPassword, newPassword, confirmPassword } = formData;
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Debes completar todos los campos."); return;
    }
    if (oldPassword === newPassword) {
      setError("La nueva contraseña no puede ser igual a la anterior."); return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden."); return;
    }
    if (!validarContraseñaSegura(newPassword)) {
      setError("La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo."); return;
    }

    const token = localStorage.getItem("token");
    if (!token) { setError("Tu sesión expiró. Inicia sesión nuevamente."); setTimeout(() => go("login"), 800); return; }

    try {
      setSubmitting(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/auth/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Si el backend DEVUELVE un nuevo token -> lo guardamos y quedas logueado
      if (data?.token) {
        saveToken(data.token);
        setSuccessMessage("Contraseña actualizada correctamente.");
        setMessage?.({ open: true, severity: "success", text: "Contraseña actualizada." });
        // Opcional: cerrar el diálogo
        setTimeout(() => setOpen(false), 1000);
        return;
      }

      // Si NO devuelve token -> flujo del documento (token anterior revocado)
      clearAuth();
      setSuccessMessage("Contraseña actualizada. Por seguridad, vuelve a iniciar sesión…");
      setMessage?.({ open: true, severity: "success", text: "Contraseña actualizada." });
      setTimeout(() => go("login"), 800);

    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 401 || status === 403
          ? "Sesión inválida o expirada. Vuelve a iniciar sesión."
          : "No se pudo cambiar la contraseña. Verifica los datos.");
      setError(msg);
      setMessage?.({ open: true, severity: "error", text: "Error al cambiar la contraseña" });

      // Si ya quedó inválido -> forzar logout
      if (status === 401 || status === 403) {
        clearAuth();
        setTimeout(() => go("/coagronet"), 800);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setError(""); setSuccessMessage(""); setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cambiar Contraseña</DialogTitle>

      {error && <Alert severity="error" sx={{ mx: 3, mt: 1 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mx: 3, mt: 1 }}>{successMessage}</Alert>}

      <DialogContent>
        <TextField
          label="Contraseña actual"
          type={showPassword.old ? "text" : "password"}
          fullWidth margin="normal" name="oldPassword"
          value={formData.oldPassword} onChange={handleChange} disabled={submitting}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleVisibility("old")} edge="end">
                  {showPassword.old ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Nueva contraseña"
          type={showPassword.new ? "text" : "password"}
          fullWidth margin="normal" name="newPassword"
          value={formData.newPassword} onChange={handleChange} disabled={submitting}
          helperText="Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleVisibility("new")} edge="end">
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Confirmar nueva contraseña"
          type={showPassword.confirm ? "text" : "password"}
          fullWidth margin="normal" name="confirmPassword"
          value={formData.confirmPassword} onChange={handleChange} disabled={submitting}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleVisibility("confirm")} edge="end">
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Guardando…" : "Cambiar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
