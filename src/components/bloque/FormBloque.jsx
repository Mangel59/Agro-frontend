import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormBloque({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  sedeId = "",                   // puede venir del filtro
  sedes = [],                    // [{id, nombre}]
  tiposBloque = [],              // [{id, nombre}]
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {},
}) {
  const initialData = {
    id: null,
    sedeId: sedeId || "",
    tipoBloqueId: "",
    nombre: "",
    numeroPisos: 1,
    descripcion: "",
    estadoId: 1,
    geolocalizacion: "",
    coordenadas: "",
    direccion: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // --- helpers / saneo ---
  const toNum = (v, def = 0) => (v === null || v === undefined || v === "" ? def : Number(v));
  const pick = (a, b, c) => (a ?? b ?? c); // nullish-only

  // Bloqueo de caracteres y patrones típicos (XSS/SQLi)
  const invalidCharsRegex = /[<>/"'`;(){}\[\]\\]/g;
  const sqliWordsRegex = /\b(select|insert|update|delete|drop|union|exec|xp_|information_schema)\b|--|\/\*|\*\//i;
  const numericLikeRegex = /^[0-9.,\-\s]+$/;             // coord/geo
  const cleanText = (v = "") => v.replace(invalidCharsRegex, "");
  const cleanNumericLike = (v = "") => v.replace(/[^0-9.,\-\s]/g, "");

  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      setFormData({
        id: toNum(selectedRow.id),
        sedeId: toNum(pick(selectedRow.sedeId, selectedRow?.sede?.id, sedeId), 0),
        tipoBloqueId: toNum(pick(selectedRow.tipoBloqueId, selectedRow?.tipoBloque?.id), 0),
        nombre: selectedRow.nombre ?? "",
        numeroPisos: toNum(selectedRow.numeroPisos, 1),
        descripcion: selectedRow.descripcion ?? "",
        estadoId: toNum(selectedRow.estadoId, 1),
        geolocalizacion: selectedRow.geolocalizacion ?? "",
        coordenadas: selectedRow.coordenadas ?? "",
        direccion: selectedRow.direccion ?? "",
      });
    } else {
      setFormData({
        ...initialData,
        sedeId: toNum(sedeId, ""), // si no hay filtro, obligar a elegir
      });
    }

    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formMode, selectedRow, sedeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    // saneo por campo
    if (["nombre", "descripcion", "direccion"].includes(name)) {
      v = cleanText(v);
    }
    if (["geolocalizacion", "coordenadas"].includes(name)) {
      v = cleanNumericLike(v);
    }

    if (["estadoId", "tipoBloqueId", "sedeId"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: toNum(v, "") }));
      return;
    }
    if (name === "numeroPisos") {
      // permitir solo enteros positivos en el input
      const onlyDigits = String(v).replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, numeroPisos: onlyDigits === "" ? "" : Number(onlyDigits) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const validate = () => {
    const e = {};

    const checkText = (field, label, required = false) => {
      const val = (formData[field] ?? "").trim();
      if (required && !val) { e[field] = `${label} es obligatorio.`; return; }
      if (invalidCharsRegex.test(val) || sqliWordsRegex.test(val)) {
        e[field] = `${label} contiene caracteres o patrones no permitidos.`;
      }
    };

    checkText("nombre", "El nombre", true);
    checkText("descripcion", "La descripción", true);
    checkText("direccion", "La dirección", true);

    const checkNumericLike = (field, label, required = false) => {
      const val = (formData[field] ?? "").trim();
      if (required && !val) { e[field] = `${label} es obligatorio.`; return; }
      if (val && !numericLikeRegex.test(val)) {
        e[field] = `${label} solo permite números, punto, coma, guion y espacios.`;
      }
      if (sqliWordsRegex.test(val)) {
        e[field] = `${label} contiene patrones no permitidos.`;
      }
    };

    checkNumericLike("geolocalizacion", "La geolocalización", true);
    checkNumericLike("coordenadas", "Las coordenadas", true);

    if (!Number.isFinite(Number(formData.numeroPisos)) || Number(formData.numeroPisos) < 1) {
      e.numeroPisos = "Número de pisos debe ser un entero mayor o igual a 1.";
    }

    if (![1, 2].includes(Number(formData.estadoId))) e.estadoId = "Debe seleccionar un estado válido.";
    if (!Number(formData.tipoBloqueId)) e.tipoBloqueId = "Debe seleccionar un tipo de bloque.";
    if (!Number(formData.sedeId)) e.sedeId = "Debe seleccionar una sede.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => ({
    sedeId: Number(formData.sedeId),
    tipoBloqueId: Number(formData.tipoBloqueId),
    nombre: formData.nombre.trim(),
    numeroPisos: Number(formData.numeroPisos),
    descripcion: formData.descripcion.trim(),
    estadoId: Number(formData.estadoId),
    geolocalizacion: formData.geolocalizacion.trim(),
    coordenadas: formData.coordenadas.trim(),
    direccion: formData.direccion.trim(),
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = buildPayload();

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/bloque/${formData.id}`, { id: Number(formData.id), ...payload }, authHeaders);
        setMessage({ open: true, severity: "success", text: "Bloque actualizado correctamente." });
      } else {
        await axios.post("/v1/bloque", payload, authHeaders);
        setMessage({ open: true, severity: "success", text: "Bloque creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      const api = err.response?.data || {};
      setMessage({
        open: true,
        severity: "error",
        text: api.message || api.error || "Error al guardar bloque.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Bloque" : "Nuevo Bloque"}</DialogTitle>
      <DialogContent>
        {/* Sede */}
        <FormControl fullWidth margin="normal" error={!!errors.tipoBloqueId}>
          <InputLabel>Tipo de Bloque</InputLabel>
          <Select
            name="tipoBloqueId"
            value={formData.tipoBloqueId || ""}
            onChange={handleChange}
            label="Tipo de Bloque"
          >
            {Array.isArray(tiposBloque) && tiposBloque.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
            ))}
          </Select>
          {errors.tipoBloqueId && <FormHelperText>{errors.tipoBloqueId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.sedeId}>
          <InputLabel>Sede</InputLabel>
          <Select
            name="sedeId"
            value={formData.sedeId || ""}
            onChange={handleChange}
            label="Sede"
          >
            {Array.isArray(sedes) && sedes.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
            ))}
          </Select>
          {errors.sedeId && <FormHelperText>{errors.sedeId}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
          inputProps={{ maxLength: 120 }}
        />

        <TextField
          fullWidth margin="normal" type="number" inputProps={{ min: 1, step: 1 }}
          label="Número de Pisos" name="numeroPisos"
          value={formData.numeroPisos} onChange={handleChange}
          error={!!errors.numeroPisos} helperText={errors.numeroPisos}
        />

        <TextField
          fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          error={!!errors.descripcion} helperText={errors.descripcion}
          multiline minRows={2}
        />

        <TextField
          fullWidth margin="normal" label="Geolocalización" name="geolocalizacion"
          value={formData.geolocalizacion} onChange={handleChange}
          error={!!errors.geolocalizacion} helperText={errors.geolocalizacion}
          placeholder="Ej: 2.9304, -75.2819"
        />

        <TextField
          fullWidth margin="normal" label="Coordenadas" name="coordenadas"
          value={formData.coordenadas} onChange={handleChange}
          error={!!errors.coordenadas} helperText={errors.coordenadas}
          placeholder="Ej: 2.9304, -75.2819"
        />

        <TextField
          fullWidth margin="normal" label="Dirección" name="direccion"
          value={formData.direccion} onChange={handleChange}
          error={!!errors.direccion} helperText={errors.direccion}
        />
        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={2}>Inactivo</MenuItem>
          </Select>
          {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
