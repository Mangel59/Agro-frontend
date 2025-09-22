import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormSede({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  municipioId = "",        // puede venir del filtro o vacío
  grupos = [],             // [{id, nombre}]
  tiposSede = [],          // [{id, nombre}]
  reloadData = () => {},
  setMessage = () => {},
  authHeaders = {},
}) {
  const initialData = {
    id: null,
    grupoId: "",
    tipoSedeId: "",
    nombre: "",
    municipioId: municipioId || "",
    geolocalizacion: "",
    coordenadas: "",
    area: "",
    comuna: "",
    descripcion: "",
    estadoId: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [municipiosOpts, setMunicipiosOpts] = useState([]); // [{id, nombre}]

  // --- Reglas de saneo / validación ---
  // Bloqueo de caracteres típicos XSS/SQLi
  const invalidCharsRegex = /[<>/"'`;(){}\[\]\\]/g;
  // Palabras/operadores típicos de SQLi (muy conservador)
  const sqliWordsRegex = /\b(select|insert|update|delete|drop|union|exec|xp_|information_schema)\b|--|\/\*|\*\//i;
  // Solo números, punto, coma, guion y espacios (p.ej. "2.9304, -75.2819")
  const numericLikeRegex = /^[0-9.,\-\s]+$/;
  // Sanea texto eliminando caracteres peligrosos
  const cleanText = (v = "") => v.replace(invalidCharsRegex, "");
  // Sanea coord/geo dejando solo números y separadores
  const cleanNumericLike = (v = "") => v.replace(/[^0-9.,\-\s]/g, "");
  // helper numérico
  const toNum = (v) => (v === null || v === undefined || v === "" ? "" : Number(v));
  // primer id válido
  const getSafeId = (...candidates) => {
    for (const c of candidates) {
      const n = Number(c);
      if (!Number.isNaN(n) && n > 0) return n;
    }
    return "";
  };

  // Cargar MUNICIPIOS (items públicos) y mapear a {id, nombre}
  useEffect(() => {
    if (!open) return;
    axios
      .get("/v1/items/municipio/0", { ...authHeaders })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        setMunicipiosOpts(
          arr.map((m) => ({
            id: Number(m.id),
            nombre: m.nombre ?? m.name ?? String(m.id),
          }))
        );
      })
      .catch(() => setMunicipiosOpts([]));
  }, [open]); // solo al abrir

  // Normaliza datos al abrir/editar
  useEffect(() => {
    if (!open) return;

    if (formMode === "edit" && selectedRow) {
      const muniId = getSafeId(
        selectedRow.municipioId,
        selectedRow?.municipio?.id,
        municipioId
      );
      const grpId = getSafeId(
        selectedRow.grupoId,
        selectedRow?.grupo?.id,
        selectedRow?.grupo_id
      );
      const tipId = getSafeId(
        selectedRow.tipoSedeId,
        selectedRow?.tipoSede?.id,
        selectedRow?.tipo_sede_id
      );

      setFormData({
        id: toNum(selectedRow.id),
        nombre: selectedRow.nombre ?? "",
        grupoId: grpId,
        tipoSedeId: tipId,
        municipioId: muniId,
        geolocalizacion: selectedRow.geolocalizacion ?? "",
        coordenadas: selectedRow.coordenadas ?? "",
        area: selectedRow.area ?? "",
        comuna: selectedRow.comuna ?? "",
        descripcion: selectedRow.descripcion ?? "",
        estadoId: toNum(selectedRow.estadoId) || 1,
      });
    } else {
      setFormData({
        ...initialData,
        municipioId: getSafeId(municipioId),
      });
    }
    setErrors({});
  }, [open, formMode, selectedRow, municipioId, municipiosOpts, grupos, tiposSede]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;

    // Saneo por campo
    if (["nombre", "descripcion", "comuna"].includes(name)) {
      v = cleanText(v);
    }
    if (["coordenadas", "geolocalizacion"].includes(name)) {
      v = cleanNumericLike(v);
    }
    if (name === "area") {
      // mantener solo dígitos, punto y guion (luego validamos número)
      v = value.replace(/[^0-9.\-]/g, "");
    }

    const newValue =
      ["estadoId", "grupoId", "tipoSedeId", "municipioId"].includes(name)
        ? toNum(v)
        : name === "area"
        ? String(v).replace(",", ".")
        : v;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const e = {};

    // Campos de texto: requeridos + anti XSS/SQLi
    const checkText = (field, label, required = false) => {
      const val = (formData[field] ?? "").trim();
      if (required && !val) {
        e[field] = `${label} es obligatorio.`;
        return;
      }
      if (invalidCharsRegex.test(val) || sqliWordsRegex.test(val)) {
        e[field] = `${label} contiene caracteres o patrones no permitidos.`;
      }
    };

    checkText("nombre", "El nombre", true);
    checkText("comuna", "La comuna", false);
    checkText("descripcion", "La descripción", false);

    // Selects requeridos
    if (!Number(formData.grupoId)) e.grupoId = "Debe seleccionar un grupo.";
    if (!Number(formData.tipoSedeId)) e.tipoSedeId = "Debe seleccionar un tipo de sede.";
    if (!Number(formData.municipioId)) e.municipioId = "Municipio no asignado.";

    // Área: numérico válido (si viene)
    if (formData.area !== "") {
      const n = Number(String(formData.area));
      if (Number.isNaN(n)) e.area = "Área debe ser numérica.";
    }

    // Coordenadas / Geolocalización: solo caracteres numéricos permitidos
    const checkNumericLike = (field, label) => {
      const val = (formData[field] ?? "").trim();
      if (val && !numericLikeRegex.test(val)) {
        e[field] = `${label} solo permite números, punto, coma, guion y espacios.`;
      }
      if (sqliWordsRegex.test(val)) {
        e[field] = `${label} contiene patrones no permitidos.`;
      }
    };
    checkNumericLike("coordenadas", "Coordenadas");
    checkNumericLike("geolocalizacion", "Geolocalización");

    // Estado
    if (![1, 2].includes(Number(formData.estadoId)))
      e.estadoId = "Debe seleccionar estado.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      grupoId: Number(formData.grupoId),
      tipoSedeId: Number(formData.tipoSedeId),
      nombre: formData.nombre.trim(),
      municipioId: Number(formData.municipioId),
      geolocalizacion: formData.geolocalizacion?.trim() || null,
      coordenadas: formData.coordenadas?.trim() || null,
      area: formData.area === "" ? null : Number(formData.area),
      comuna: formData.comuna?.trim() || null,
      descripcion: formData.descripcion?.trim() || null,
      estadoId: Number(formData.estadoId),
    };

    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/sede/${formData.id}`, { id: Number(formData.id), ...payload }, authHeaders);
        setMessage({ open: true, severity: "success", text: "Sede actualizada correctamente." });
      } else {
        await axios.post("/v1/sede", payload, authHeaders);
        setMessage({ open: true, severity: "success", text: "Sede creada correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      console.error("SEDE SAVE ERR:", err.response?.status, err.response?.data || err.message);
      const api = err.response?.data || {};
      const txt =
        api.message ||
        api.error ||
        (err.response?.status === 409
          ? "Datos duplicados o restricción de base de datos."
          : "Error al guardar sede.");
      setMessage({ open: true, severity: "error", text: txt });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Sede" : "Nueva Sede"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth margin="normal" label="Nombre" name="nombre"
          value={formData.nombre} onChange={handleChange}
          error={!!errors.nombre} helperText={errors.nombre}
          inputProps={{ maxLength: 120 }}
        />

        <FormControl fullWidth margin="normal" error={!!errors.grupoId}>
          <InputLabel>Grupo</InputLabel>
          <Select
            name="grupoId"
            value={formData.grupoId === "" ? "" : Number(formData.grupoId)}
            onChange={handleChange}
            label="Grupo"
          >
            {grupos.map((g) => (
              <MenuItem key={g.id} value={Number(g.id)}>{g.nombre}</MenuItem>
            ))}
          </Select>
          {errors.grupoId && <FormHelperText>{errors.grupoId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.tipoSedeId}>
          <InputLabel>Tipo de Sede</InputLabel>
          <Select
            name="tipoSedeId"
            value={formData.tipoSedeId === "" ? "" : Number(formData.tipoSedeId)}
            onChange={handleChange}
            label="Tipo de Sede"
          >
            {tiposSede.map((t) => (
              <MenuItem key={t.id} value={Number(t.id)}>{t.nombre}</MenuItem>
            ))}
          </Select>
          {errors.tipoSedeId && <FormHelperText>{errors.tipoSedeId}</FormHelperText>}
        </FormControl>

        {/* Selector de Municipio (items públicos) */}
        <FormControl fullWidth margin="normal" error={!!errors.municipioId}>
          <InputLabel>Municipio</InputLabel>
          <Select
            name="municipioId"
            value={formData.municipioId === "" ? "" : Number(formData.municipioId)}
            onChange={handleChange}
            label="Municipio"
          >
            {municipiosOpts.map((m) => (
              <MenuItem key={m.id} value={Number(m.id)}>{m.nombre}</MenuItem>
            ))}
          </Select>
          {errors.municipioId && <FormHelperText>{errors.municipioId}</FormHelperText>}
        </FormControl>

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
          fullWidth margin="normal" label="Área" name="area"
          value={formData.area} onChange={handleChange}
          error={!!errors.area} helperText={errors.area}
          placeholder="Ej: 1234.5"
        />
        <TextField
          fullWidth margin="normal" label="Comuna" name="comuna"
          value={formData.comuna} onChange={handleChange}
          error={!!errors.comuna} helperText={errors.comuna}
        />
        <TextField
          fullWidth margin="normal" label="Descripción" name="descripcion"
          value={formData.descripcion} onChange={handleChange}
          error={!!errors.descripcion} helperText={errors.descripcion}
          multiline minRows={2}
        />

        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId === "" ? "" : Number(formData.estadoId)}
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
