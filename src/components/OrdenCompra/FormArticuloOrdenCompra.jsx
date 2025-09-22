// FormArticuloOrdenCompra.jsx
import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";
import * as Yup from "yup";

// ======== Validación ========
const numberRequired = (msg, { min = 0 } = {}) =>
  Yup.number()
    .transform((v, orig) => (orig === "" || orig === null ? undefined : Number(orig)))
    .typeError(msg)
    .required(msg)
    .min(min, `Debe ser ≥ ${min}`);

const schema = Yup.object({
  ordenCompraId: numberRequired("Orden de compra obligatoria."),
  presentacionProductoId: numberRequired("Presentación obligatoria.", { min: 1 }),
  cantidad: numberRequired("Cantidad obligatoria.", { min: 0 }),
  precio: numberRequired("Precio obligatorio.", { min: 0 }),
  estadoId: Yup.number().oneOf([0, 1], "Estado inválido").required("Estado obligatorio."),
});

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

export default function FormArticuloOrdenCompra({
  selectedRow,
  setSelectedRow,
  setMessage,
  reloadData,
  ordenCompraId,
}) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [presentaciones, setPresentaciones] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const initialData = {
    cantidad: "",
    precio: "",
    ordenCompraId: ordenCompraId || "",
    presentacionProductoId: "",
    estadoId: "1",
  };

  const [formData, setFormData] = useState(initialData);

  const loadData = () => {
    axios
      .get("/v1/items/producto_presentacion/0")
      .then((res) => setPresentaciones(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPresentaciones([]));
  };

  const create = () => {
    setFieldErrors({});
    setFormData({ ...initialData, ordenCompraId });
    setMethodName("Agregar");
    loadData();
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un artículo para editar." });
      return;
    }
    setFieldErrors({});
    setFormData({
      ordenCompraId: selectedRow.ordenCompraId ?? ordenCompraId ?? "",
      presentacionProductoId: String(selectedRow.presentacionProductoId ?? ""),
      estadoId: String(selectedRow.estadoId ?? "1"),
      cantidad: String(selectedRow.cantidad ?? ""),
      precio: String(selectedRow.precio ?? ""),
    });
    setMethodName("Actualizar");
    loadData();
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) return;
    axios.delete(`/v1/articulo-orden-compra/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Artículo eliminado correctamente." });
        reloadData();
        setSelectedRow({});
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al eliminar artículo" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const buildPayload = (fd, idForPut) => ({
    // algunos backends requieren el id en el body del PUT; no molesta si no lo usan
    ...(idForPut ? { id: idForPut } : {}),
    ordenCompraId: parseInt(fd.ordenCompraId, 10),
    presentacionProductoId: parseInt(fd.presentacionProductoId, 10),
    cantidad: parseFloat(fd.cantidad),
    precio: parseFloat(fd.precio),
    estadoId: parseInt(fd.estadoId, 10),
  });

  const validateNoInjection = (payload) => {
    const sus = Object.entries(payload)
      .filter(([_, v]) => typeof v === "string" || typeof v === "number")
      .filter(([_, v]) => isSqlSuspicious(v))
      .map(([k]) => k);
    if (sus.length) {
      setMessage({
        open: true,
        severity: "error",
        text: `Entrada inválida en: ${sus.join(", ")}.`,
      });
      return false;
    }
    return true;
  };

  // Guarda respetando el estado actual, o forzándolo (0 = inactivo, 1 = activo)
  const submitWithEstado = async (forceEstado = null) => {
    const id = selectedRow?.id || 0;

    // compón un objeto con el estado que corresponda
    const working = {
      ...formData,
      estadoId: forceEstado !== null ? String(forceEstado) : formData.estadoId,
    };

    try {
      // 1) Validar con Yup (tipos/valores)
      await schema.validate(buildPayload(working, id && methodName !== "Agregar" ? id : undefined), {
        abortEarly: false,
      });

      // 2) Armar payload final
      const payload = buildPayload(working, id && methodName !== "Agregar" ? id : undefined);

      // 3) Guardia anti-inyección en cliente
      if (!validateNoInjection(payload)) return;

      // 4) Llamada
      const method = methodName === "Agregar" ? axios.post : axios.put;
      const url =
        methodName === "Agregar"
          ? "/v1/articulo-orden-compra"
          : `/v1/articulo-orden-compra/${id}`;

      await method(url, payload);

      setMessage({
        open: true,
        severity: "success",
        text: `Artículo ${methodName === "Agregar" ? "creado" : "actualizado"} correctamente.`,
      });
      reloadData();
      setOpen(false);
    } catch (err) {
      if (err.name === "ValidationError") {
        const errs = {};
        err.inner.forEach((e) => {
          if (e.path) errs[e.path] = e.message;
        });
        setFieldErrors(errs);
        setMessage({ open: true, severity: "error", text: "Revisa los campos marcados." });
      } else {
        setMessage({ open: true, severity: "error", text: "Error al guardar artículo" });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitWithEstado(null); // respeta el estado elegido en el Select
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Artículo de Orden</DialogTitle>
          <DialogContent>

            <TextField
              fullWidth
              name="ordenCompraId"
              label="Orden Compra ID"
              value={formData.ordenCompraId}
              margin="dense"
              required
              disabled
              error={Boolean(fieldErrors.ordenCompraId)}
              helperText={fieldErrors.ordenCompraId}
            />

            <FormControl fullWidth margin="normal" required error={Boolean(fieldErrors.presentacionProductoId)}>
              <InputLabel id="presentacionProductoId-label">Producto Presentación</InputLabel>
              <Select
                labelId="presentacionProductoId-label"
                label="Producto Presentación"
                name="presentacionProductoId"
                value={formData.presentacionProductoId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Seleccione...</em>
                </MenuItem>
                {presentaciones.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name ?? p.nombre ?? p.descripcion ?? `#${p.id}`}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.presentacionProductoId && (
                <span style={{ color: "#f44336", fontSize: 12 }}>{fieldErrors.presentacionProductoId}</span>
              )}
            </FormControl>

            <TextField
              fullWidth
              name="cantidad"
              label="Cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              margin="dense"
              required
              type="number"
              inputProps={{ min: 0, step: "any" }}
              error={Boolean(fieldErrors.cantidad)}
              helperText={fieldErrors.cantidad}
            />

            <TextField
              fullWidth
              name="precio"
              label="Precio"
              value={formData.precio}
              onChange={handleChange}
              margin="dense"
              required
              type="number"
              inputProps={{ min: 0, step: "any" }}
              error={Boolean(fieldErrors.precio)}
              helperText={fieldErrors.precio}
            />

            <FormControl fullWidth margin="normal" required error={Boolean(fieldErrors.estadoId)}>
              <InputLabel id="estadoId-label">Estado</InputLabel>
              <Select
                labelId="estadoId-label"
                label="Estado"
                name="estadoId"
                value={formData.estadoId}
                onChange={handleChange}
              >
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="0">Inactivo</MenuItem>
              </Select>
              {fieldErrors.estadoId && (
                <span style={{ color: "#f44336", fontSize: 12 }}>{fieldErrors.estadoId}</span>
              )}
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>

            <Button type="submit" variant="contained">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
