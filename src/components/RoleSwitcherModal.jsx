import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Card, CardActionArea, CardMedia, CardContent
} from "@mui/material";
import axios from "axios";

// Imágenes por rol (ejemplo)
import img1 from "/images/cards/1.jpg";
import img2 from "/images/cards/2.jpg";
import img3 from "/images/cards/3.jpg";
const roleImages = { 1: img1, 2: img2, 3: img3 };

function getRolesFromStorage() {
  try { return JSON.parse(localStorage.getItem("rolesByCompany") || "[]"); }
  catch { return []; }
}

export default function RoleSwitcherModal({ open, onClose, onSwitched }) {
  const roles = useMemo(() => {
    const raw = getRolesFromStorage();
    return Array.isArray(raw)
      ? raw.map(r => ({
          ...r,
          empresaId: Number(r.empresaId),
          rolId: Number(r.rolId),
        }))
      : [];
  }, []);

  const empresas = useMemo(() => {
    const map = new Map();
    for (const r of roles) {
      if (!map.has(r.empresaId)) {
        map.set(r.empresaId, { id: r.empresaId, nombre: r.empresaNombre });
      }
    }
    return [...map.values()];
  }, [roles]);

  const [empresaId, setEmpresaId] = useState(null);
  const [rolId, setRolId] = useState(null);

  // Filtramos los roles por la empresa seleccionada
  const filteredRoles = useMemo(
    () => roles.filter(r => empresaId == null || r.empresaId === Number(empresaId)),
    [roles, empresaId]
  );

  const doSwitch = useCallback(
    async ({ empresaId: empId, rolId: rId }) => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
        return;
      }

      const payload = { empresaId: Number(empId), rolId: Number(rId) };

      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URI + "/auth/switch-context",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("empresaId", String(payload.empresaId));
      localStorage.setItem("rolId", String(payload.rolId));

      const emp = empresas.find(e => e.id === payload.empresaId);
      if (emp) localStorage.setItem("empresaNombre", emp.nombre);

      const rol = roles.find(r => r.empresaId === payload.empresaId && r.rolId === payload.rolId);
      if (rol?.rolNombre) localStorage.setItem("rolNombre", rol.rolNombre);

      if (onSwitched) onSwitched();
      onClose();
    },
    [empresas, roles, onSwitched, onClose]
  );

  // Cargar automáticamente la primera empresa y rol si solo hay 1
  useEffect(() => {
    if (!open) return;
    if (empresas.length === 1) {
      const unicaEmpresaId = empresas[0].id;
      const rolesDeUnica = roles.filter(r => r.empresaId === unicaEmpresaId);
      if (rolesDeUnica.length === 1) {
        setEmpresaId(unicaEmpresaId);
        setRolId(rolesDeUnica[0].rolId);
      }
    }
  }, [open, empresas, roles]);

  const handleCompanyClick = (eId) => {
    setEmpresaId(Number(eId));
    const rolesDeEmpresa = roles.filter(r => r.empresaId === Number(eId));
    if (rolesDeEmpresa.length === 1) {
      setRolId(rolesDeEmpresa[0].rolId);
    } else {
      setRolId(null);
    }
  };

  const handleConfirm = async () => {
    try {
      await doSwitch({ empresaId, rolId });
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
          {/* Mostrar todas las empresas y sus roles juntos */}
          <div>
            <Typography variant="subtitle2" gutterBottom>Empresa</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {empresas.map((e) => (
                <Card
                  key={e.id}
                  sx={{
                    width: 180,
                    border: Number(empresaId) === e.id ? "2px solid #1976d2" : "1px solid #555",
                    boxShadow: Number(empresaId) === e.id ? 4 : 1,
                    borderRadius: 2
                  }}
                >
                  <CardActionArea onClick={() => handleCompanyClick(e.id)}>
                    <CardContent>
                      <Typography align="center">{e.nombre}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          </div>

          {/* Mostrar los roles de las empresas seleccionadas */}
          {empresaId != null && (
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Rol en {empresas.find(e => e.id === Number(empresaId))?.nombre || "la empresa"}
              </Typography>

              <Stack
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)", // Mostrar roles en 2 columnas
                  gap: 2,
                  justifyItems: "center",
                }}
              >
                {filteredRoles.map((r) => (
                  <Card
                    key={`${r.empresaId}-${r.rolId}`}
                    sx={{
                      width: "100%",
                      maxWidth: 320,
                      border: Number(rolId) === r.rolId ? "3px solid #1976d2" : "1px solid #3b3b3b",
                      boxShadow: Number(rolId) === r.rolId ? 6 : 2,
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
                        sx={{ width: "100%", height: 160, objectFit: "cover" }}
                      />
                      <CardContent sx={{ bgcolor: "#222", py: 1.5 }}>
                        <Typography
                          align="center"
                          variant="body1"
                          sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
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
        <Button
          variant="contained"
          disabled={empresaId == null || rolId == null}
          onClick={handleConfirm}
        >
          Cambiar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
