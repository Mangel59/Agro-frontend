import React, { useMemo, useState, useCallback } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Card, CardActionArea, CardMedia, CardContent,
  Grid, useTheme, Box, Paper
} from "@mui/material";
import axios from "axios";

// Imágenes por rol (ejemplo)
import img1 from "/images/cards/1.jpg";
import img2 from "/images/cards/2.jpg";
import img3 from "/images/cards/3.jpg";
const roleImages = { 1: img1, 2: img2, 3: img3 };

function getRolesFromStorage() {
  try {
    const raw = JSON.parse(localStorage.getItem("rolesByCompany") || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function RoleSwitcherModal({ open, onClose, onSwitched }) {
  const theme = useTheme();

  const roles = useMemo(() => {
    const raw = getRolesFromStorage();
    return raw.map(r => ({
      ...r,
      empresaId: Number(r.empresaId),
      rolId: Number(r.rolId),
    }));
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

  const handleConfirm = async () => {
    try {
      await doSwitch({ empresaId, rolId });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error cambiando empresa/rol";
      console.error("switch-context error:", err?.response || err);
      alert(msg);
    }
  };

  const handleEmpresaClick = (eId) => {
    setEmpresaId(eId);
    const rolesDeEmpresa = roles.filter(r => r.empresaId === eId);
    if (rolesDeEmpresa.length === 1) {
      setRolId(rolesDeEmpresa[0].rolId);
    } else {
      setRolId(null);
    }
  };

  const handleRolClick = (rId) => setRolId(rId);

  const isSingleCompany = empresas.length === 1;

  // Estilos reutilizables
  const roleCardSx = {
    width: 240,
    flex: "0 1 240px",
    border: (theme) => `1px solid ${theme.palette.divider}`,
    borderRadius: 3,
    boxShadow: 2,
    transition: "box-shadow .15s ease",
    "&:hover": { boxShadow: 4 },
    bgcolor: (theme) => theme.palette.background.paper,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cambiar empresa/rol</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {empresas.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                p: 4,
                bgcolor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">No hay empresas disponibles</Typography>
              <Typography variant="body2" color="text.secondary">
                No tienes empresas asignadas aún.
              </Typography>
            </Stack>
          ) : isSingleCompany ? (
            // ====== SOLO 1 EMPRESA: empresa + roles en horizontal ======
            empresas.map((e) => {
              const rolesDeEmpresa = roles.filter(r => r.empresaId === e.id);
              return (
                <Paper
                  key={e.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: theme.palette.background.default,
                  }}
                >
                  {/* Cabecera de empresa */}
                  <Box sx={{ mb: 2 }}>
                    <Card
                      sx={{
                        width: 260,
                        border: Number(empresaId) === e.id ? "2px solid #1976d2" : `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        boxShadow: Number(empresaId) === e.id ? 3 : 1,
                        bgcolor: theme.palette.background.paper,
                      }}
                    >
                      <CardActionArea onClick={() => handleEmpresaClick(e.id)}>
                        <CardContent sx={{ py: 1.5 }}>
                          <Typography align="center" color={theme.palette.text.primary}>
                            {e.nombre}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Box>

                  {/* Roles en fila */}
                  <Stack
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    spacing={2}
                  >
                    {rolesDeEmpresa.map((r) => (
                      <Card
                        key={`${r.empresaId}-${r.rolId}`}
                        sx={{
                          ...roleCardSx,
                          border:
                            Number(rolId) === r.rolId
                              ? "2px solid #1976d2"
                              : roleCardSx.border,
                        }}
                      >
                        <CardActionArea onClick={() => handleRolClick(r.rolId)}>
                          <CardMedia
                            component="img"
                            image={roleImages[r.rolId] || img1}
                            alt={r.rolNombre}
                            sx={{ width: "100%", height: 160, objectFit: "cover" }}
                          />
                          <CardContent sx={{ py: 1.5 }}>
                            <Typography align="center" variant="body2">
                              {r.rolNombre}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              );
            })
          ) : (
            // ====== VARIAS EMPRESAS: cada empresa en su bloque con espacio ======
            <Grid container direction="column" spacing={3}>
              {empresas.map((e) => {
                const rolesDeEmpresa = roles.filter(r => r.empresaId === e.id);
                return (
                  <Grid item xs={12} key={e.id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: theme.palette.background.default,
                      }}
                    >
                      {/* Cabecera de empresa */}
                      <Box sx={{ mb: 2 }}>
                        <Card
                          sx={{
                            width: 260,
                            border: Number(empresaId) === e.id ? "2px solid #1976d2" : `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            boxShadow: Number(empresaId) === e.id ? 3 : 1,
                            bgcolor: theme.palette.background.paper,
                          }}
                        >
                          <CardActionArea onClick={() => handleEmpresaClick(e.id)}>
                            <CardContent sx={{ py: 1.5 }}>
                              <Typography align="center" color={theme.palette.text.primary}>
                                {e.nombre}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Box>

                      {/* Roles de esa empresa (debajo) */}
                      <Stack
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                        spacing={2}
                      >
                        {rolesDeEmpresa.map((r) => (
                          <Card
                            key={`${r.empresaId}-${r.rolId}`}
                            sx={{
                              ...roleCardSx,
                              border:
                                Number(rolId) === r.rolId
                                  ? "2px solid #1976d2"
                                  : roleCardSx.border,
                            }}
                          >
                            <CardActionArea onClick={() => handleRolClick(r.rolId)}>
                              <CardMedia
                                component="img"
                                image={roleImages[r.rolId] || img1}
                                alt={r.rolNombre}
                                sx={{ width: "100%", height: 160, objectFit: "cover" }}
                              />
                              <CardContent sx={{ py: 1.5 }}>
                                <Typography align="center" variant="body2">
                                  {r.rolNombre}
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        ))}
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
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
