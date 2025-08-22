import React, { useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem, Stack
} from "@mui/material";
import axios from "axios";

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

    // Asegura enteros (muchos backends rompen si llega string)
    const payload = {
      empresaId: Number(empresaId),
      rolId: Number(rolId),
    };

    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URI + "/auth/switch-context",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // data: { token, empresaId, rolId } (según diseño)
    localStorage.setItem("token", data.token);
    localStorage.setItem("empresaId", String(payload.empresaId));
    localStorage.setItem("rolId", String(payload.rolId));

    const emp = empresas.find((e) => e.id === payload.empresaId);
    if (emp) localStorage.setItem("empresaNombre", emp.nombre);

    if (onSwitched) onSwitched();
    onClose();
    // Si quieres refrescar permisos sin recargar, emite un evento o usa tu store/context.
    // window.location.reload();
  } catch (err) {
    // Muestra mensaje del backend para diagnosticar 500
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Error cambiando empresa/rol";
    console.error("switch-context error:", err?.response || err);
    alert(msg);
  }
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cambiar empresa/rol</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Empresa</InputLabel>
            <Select
              label="Empresa"
              value={empresaId}
              onChange={(e) => { setEmpresaId(e.target.value); setRolId(""); }}
            >
              {empresas.map(e => (
                <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!empresaId}>
            <InputLabel>Rol</InputLabel>
            <Select
              label="Rol"
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
            >
              {filteredRoles.map((r, i) => (
                <MenuItem key={`${r.empresaId}-${r.rolId}-${i}`} value={r.rolId}>
                  {r.rolNombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
