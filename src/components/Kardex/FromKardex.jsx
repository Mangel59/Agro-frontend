import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";
import * as Yup from "yup";

// ======== Helpers Yup ========
const numberRequired = (msg, opts = {}) => {
  let y = Yup.number().typeError(msg).required(msg);
  if (opts.min !== undefined) y = y.min(opts.min, `${msg} (mín ${opts.min})`);
  if (opts.max !== undefined) y = y.max(opts.max, `${msg} (máx ${opts.max})`);
  return y;
};

// ======== Anti-inyección (cliente, best-effort) ========
const isSqlSuspicious = (val) => {
  if (val === null || val === undefined) return false;
  const s = String(val).toLowerCase();
  return [
    "--", ";", "/*", "*/", " xp_", " or ", " and ", " drop ", " delete ", " insert ",
    " update ", " select ", " union ", " cast(", " convert(", ">", "<", "=", "chr(", "char(",
    "nchar(", "varchar(", "nvarchar(", "alter ", "begin ", "cast ", "create ", "cursor ",
    "declare ", "exec ", "execute ", "fetch ", "kill ", "open ", "sysobjects", "syscolumns",
    "table ", "information_schema.", "pg_catalog.", "current_user", "session_user", "user()",
    "@@", "@", "0x", "0b"
  ].some(tok => s.includes(tok));
};

// ======== Schema Kardex ========
const kardexSchema = Yup.object({
  fechaHora: Yup.string().required("Fecha/Hora obligatoria."),
  almacenId: numberRequired("Almacén obligatorio.", { min: 1 }),
  produccionId: numberRequired("Producción obligatoria.", { min: 1 }),
  tipoMovimientoId: numberRequired("Tipo de movimiento obligatorio.", { min: 1 }),
  descripcion: Yup.string()
    .max(500, "Máx 500 caracteres.")
    .test("no-sql", "El texto contiene patrones no permitidos.", v => !isSqlSuspicious(v)),
  estadoId: Yup.number().oneOf([0, 1], "Estado inválido").required("Estado obligatorio."),
  empresaId: numberRequired("Empresa obligatoria.", { min: 1 }),
});

export default function FormKardex({
  open,
  setOpen,
  formMode = "create",
  selectedRow = null,
  reloadData,
  setMessage,
  setSelectedRow,
}) {
  const [formData, setFormData] = useState({
    fechaHora: "",
    almacenId: "",
    produccionId: "",
    tipoMovimientoId: "",
    descripcion: "",
    estadoId: 1,
    empresaId: null,
  });

  const [errors, setErrors] = useState({});

  const [almacenes, setAlmacenes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [tiposMovimiento, setTiposMovimiento] = useState([]);

  // --- token & headers
  const token = localStorage.getItem("token");
  const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const empresaId = (() => {
    try {
      return token ? JSON.parse(atob(token.split(".")[1]))?.empresaId ?? null : null;
    } catch {
      return null;
    }
  })();

  // Normalizador
  const pickList = (res) => {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.content)) return d.content;
    if (Array.isArray(d?.data?.content)) return d.data.content;
    return [];
  };

  // --- CARGAS INICIALES
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [movRes, prodRes, almRes] = await Promise.all([
          axios.get("/v1/items/tipo_movimiento/0", headers),
          axios.get("/v1/items/produccion/0", headers),
          axios.get("/v1/items/almacen/0", headers),
        ]);
        setTiposMovimiento(pickList(movRes));
        setProducciones(pickList(prodRes));
        setAlmacenes(pickList(almRes));
      } catch (e) {
        console.error("Error cargando listas:", e);
        setTiposMovimiento([]); setProducciones([]); setAlmacenes([]);
      }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- RESET / CARGA AL ABRIR
  useEffect(() => {
    if (open && formMode === "edit" && selectedRow) {
      setFormData({ ...selectedRow, empresaId });
      setErrors({});
    } else if (open) {
      setFormData({
        fechaHora: "",
        almacenId: "",
        produccionId: "",
        tipoMovimientoId: "",
        descripcion: "",
        estadoId: 1,
        empresaId,
      });
      setErrors({});
    }
  }, [open, formMode, selectedRow, empresaId]);

  // --- HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["almacenId", "produccionId", "tipoMovimientoId", "estadoId"];
    const parsed = numericFields.includes(name) && value !== "" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsed }));
    // Borrar error del campo al editar
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      // Validar
      await kardexSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const method = formMode === "edit" ? axios.put : axios.post;
      const url = formMode === "edit" ? `/v1/kardex/${formData.id}` : "/v1/kardex";
      await method(url, formData, headers);

      reloadData?.();
      setMessage?.({
        open: true,
        severity: "success",
        text: `Kardex ${formMode === "edit" ? "actualizado" : "creado"}`,
      });
      setOpen(false);
      setSelectedRow?.(null);
    } catch (err) {
      if (err.name === "ValidationError") {
        const map = {};
        err.inner.forEach((e) => {
          if (e.path && !map[e.path]) map[e.path] = e.message;
        });
        setErrors(map);
        setMessage?.({ open: true, severity: "warning", text: "Revisa los campos del formulario." });
      } else {
        console.error(err);
        setMessage?.({ open: true, severity: "error", text: "Error al guardar Kardex" });
      }
    }
  };

  const handleDelete = () => {
    if (!selectedRow?.id) return;
    axios
      .delete(`/v1/kardex/${selectedRow.id}`, headers)
      .then(() => {
        reloadData?.();
        setMessage?.({ open: true, severity: "success", text: "Kardex eliminado correctamente" });
        setSelectedRow?.(null);
      })
      .catch(() => {
        setMessage?.({ open: true, severity: "error", text: "Error al eliminar" });
      });
  };

  const renderName = (it) => it?.name ?? it?.nombre ?? it?.descripcion ?? `#${it?.id}`;

  return (
    <Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{formMode === "edit" ? "Editar Kardex" : "Crear Kardex"}</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Fecha/Hora */}
          <TextField
            label="Fecha/Hora"
            name="fechaHora"
            type="datetime-local"
            value={formData.fechaHora}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.fechaHora}
            helperText={errors.fechaHora}
          />

          {/* Almacén */}
          <FormControl fullWidth error={!!errors.almacenId}>
            <InputLabel>Almacén</InputLabel>
            <Select
              name="almacenId"
              value={formData.almacenId}
              onChange={handleChange}
              label="Almacén"
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccione...</em>
              </MenuItem>
              {almacenes.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {renderName(a)}
                </MenuItem>
              ))}
            </Select>
            {!!errors.almacenId && <FormHelperText>{errors.almacenId}</FormHelperText>}
          </FormControl>

          {/* Producción */}
          <FormControl fullWidth error={!!errors.produccionId}>
            <InputLabel>Producción</InputLabel>
            <Select
              name="produccionId"
              value={formData.produccionId}
              onChange={handleChange}
              label="Producción"
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccione...</em>
              </MenuItem>
              {producciones.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {renderName(p)}
                </MenuItem>
              ))}
            </Select>
            {!!errors.produccionId && <FormHelperText>{errors.produccionId}</FormHelperText>}
          </FormControl>

          {/* Tipo Movimiento */}
          <FormControl fullWidth error={!!errors.tipoMovimientoId}>
            <InputLabel>Tipo Movimiento</InputLabel>
            <Select
              name="tipoMovimientoId"
              value={formData.tipoMovimientoId}
              onChange={handleChange}
              label="Tipo Movimiento"
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccione...</em>
              </MenuItem>
              {tiposMovimiento.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {renderName(t)}
                </MenuItem>
              ))}
            </Select>
            {!!errors.tipoMovimientoId && <FormHelperText>{errors.tipoMovimientoId}</FormHelperText>}
          </FormControl>

          {/* Descripción */}
          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            multiline
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />

          {/* Estado */}
          <FormControl fullWidth error={!!errors.estadoId}>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estadoId"
              value={formData.estadoId}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
            {!!errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
          </FormControl>
        </DialogContent>

        <DialogActions>
          {/* {formMode === 'edit' && <Button color="error" onClick={handleDelete}>Eliminar</Button>} */}
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
