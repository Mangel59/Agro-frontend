import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, InputAdornment, IconButton, Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

export default function ChangePasswordDialog({ open, setOpen, setMessage }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    const { oldPassword, newPassword } = formData;

    if (!oldPassword || !newPassword) {
      setError("Debes completar ambos campos.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("La nueva contraseña no puede ser igual a la anterior.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado. Por favor inicia sesión nuevamente.");
      return;
    }

    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_URI}/auth/change-password`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          oldPassword,
          newPassword
        }
      });

      const msg = response.data?.message || "Contraseña actualizada correctamente";
      setSuccessMessage(msg);

      setMessage({
        open: true,
        severity: "success",
        text: msg
      });

      setFormData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      if (err.response?.status === 403) {
        setError("No tienes permisos para cambiar la contraseña o el token es inválido.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("No se pudo cambiar la contraseña. Verifica los datos.");
      }

      setMessage({
        open: true,
        severity: "error",
        text: "Error al cambiar la contraseña"
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Cambiar Contraseña</DialogTitle>

      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 1 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mx: 3, mt: 1 }}>
          {successMessage}
        </Alert>
      )}

      <DialogContent>
        <TextField
          label="Contraseña actual"
          type={showPassword.old ? "text" : "password"}
          fullWidth
          margin="normal"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
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
          fullWidth
          margin="normal"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Cambiar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
