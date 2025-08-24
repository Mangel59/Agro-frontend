import React, { useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Card, CardActionArea, CardMedia, CardContent
} from "@mui/material";
import axios from "axios";

// 📌 importa tus imágenes (puedes mapearlas a rolId o nombre)
import img1 from "/images/cards/1.jpg";
import img2 from "/images/cards/2.jpg";
import img3 from "/images/cards/3.jpg";

const roleImages = {
  1: img1,
  2: img2,
  3: img3,
};

function getRolesFromStorage() {
  try { return JSON.parse(localStorage.getItem("rolesByCompany") || "[]"); }
  catch { return []; }
}

export default function RoleSwitcherModal({ open, onClose, onSwitched }) {
  const roles = useMemo(() => getRolesFromStorage(), []);
  const empresas = useMemo(
    () => [...new Map(roles.map(r => [r.empresaId, { id: r.empresaId, nombre: r.empresaNombre }])).values()],
    [roles]
  );

  const [empresaId, setEmpresaId] = useState("");
  const [rolId, setRolId] = useState("");

  const filteredRoles = roles.filter(r => !empresaId || r.empresaId === empresaId);

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
        return;
      }

      const payload = { empresaId: Number(empresaId), rolId: Number(rolId) };

      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URI + "/auth/switch-context",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("empresaId", String(payload.empresaId));
      localStorage.setItem("rolId", String(payload.rolId));

      const emp = empresas.find((e) => e.id === payload.empresaId);
      if (emp) localStorage.setItem("empresaNombre", emp.nombre);

      if (onSwitched) onSwitched();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error cambiando empresa/rol";
      console.error("switch-context error:", err?.response || err);
      alert(msg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cambiar empresa/rol</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <div>
            <Typography variant="subtitle2" gutterBottom>Empresa</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {empresas.map((e) => (
                <Card
                  key={e.id}
                  sx={{
                    width: 150,
                    border: empresaId === e.id ? "2px solid #1976d2" : "1px solid #ccc",
                    boxShadow: empresaId === e.id ? 4 : 1,
                  }}
                >
                  <CardActionArea onClick={() => { setEmpresaId(e.id); setRolId(""); }}>
                    <CardContent>
                      <Typography align="center">{e.nombre}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          </div>

          {/* ROLES */}
            {empresaId && (
            <div>
                <Typography variant="subtitle2" gutterBottom>Rol en empresa</Typography>

                <Stack
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)", // 🔹 2 columnas siempre
                    gap: 2,
                    justifyItems: "center",
                }}
                >
                {filteredRoles.map((r) => (
                    <Card
                    key={r.rolId}
                    sx={{
                        width: "100%",               // 🔹 ocupa toda la columna
                        maxWidth: 300,               // 🔹 ancho máximo por tarjeta
                        border: rolId === r.rolId ? "3px solid #1976d2" : "1px solid #3b3b3b",
                        boxShadow: rolId === r.rolId ? 6 : 2,
                        borderRadius: 3,
                        transition: "all .15s ease",
                        "&:hover": { boxShadow: 8, transform: "translateY(-2px)" }
                    }}
                    >
                    <CardActionArea onClick={() => setRolId(r.rolId)}>
                        <CardMedia
                        component="img"
                        image={roleImages[r.rolId] || img1}
                        alt={r.rolNombre}
                        sx={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                        }}
                        />
                        <CardContent
                        sx={{
                            bgcolor: "#222",  // 🔹 fondo oscuro opcional
                            py: 1.5,
                        }}
                        >
                        <Typography
                            align="center"
                            variant="body1"
                            sx={{ whiteSpace: "normal", wordBreak: "break-word" }} // 🔹 permite salto de línea
                        >
                            {r.rolNombre}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    </Card>
                ))}
                </Stack>
            </div>
            )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!empresaId || !rolId} onClick={handleConfirm}>
          Cambiar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
