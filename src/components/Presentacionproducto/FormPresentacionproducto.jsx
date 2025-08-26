import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormPresentacionproducto({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const initialData = {
    productoId: "",
    nombre: "",                 // ← Nombre de la Presentación
    unidadId: "",
    descripcion: "",
    cantidad: "",
    marcaId: "",
    presentacionId: "",         // ← Tipo de Presentación
    estadoId: "",               // 1/2
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);

  // --- helpers ----
  const toList = (res) => {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.content)) return d.content;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  };

  // empresaId desde el token (ajusta si tu payload es distinto)
  let empresaId = null;
  try {
    const rawToken = localStorage.getItem("token");
    if (rawToken) {
      const payload = JSON.parse(atob(rawToken.split(".")[1]));
      empresaId = payload?.empresa?.id ?? payload?.empresaId ?? null;
    }
  } catch (e) {
    console.error("Error al leer empresaId desde el token", e);
  }

  useEffect(() => {
    axios.get("/v1/producto").then(r => setProductos(toList(r))).catch(() => setProductos([]));
    axios.get("/v1/unidad").then(r => setUnidades(toList(r))).catch(() => setUnidades([]));
    axios.get("/v1/marca").then(r => setMarcas(toList(r))).catch(() => setMarcas([]));
    axios.get("/v1/presentacion").then(r => setPresentaciones(toList(r))).catch(() => setPresentaciones([]));
  }, []);

  const create = () => {
    setFormData(initialData);
    setErrors({});
    setMethodName("Crear");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para editar." });
      return;
    }
    setFormData({
      productoId: selectedRow.productoId ?? "",
      nombre: selectedRow.nombre ?? "",
      unidadId: selectedRow.unidadId ?? "",
      descripcion: selectedRow.descripcion ?? "",
      cantidad: selectedRow.cantidad ?? "",
      marcaId: selectedRow.marcaId ?? "",
      presentacionId: selectedRow.presentacionId ?? "",
      estadoId: (selectedRow.estadoId ?? "").toString(),
    });
    setErrors({});
    setMethodName("Actualizar");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una presentación para eliminar." });
      return;
    }
    axios.delete(`/v1/producto_presentacion/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.productoId) e.productoId = "Campo requerido";
    if (!String(formData.nombre).trim()) e.nombre = "Campo requerido";
    if (!formData.unidadId) e.unidadId = "Campo requerido";
    if (!String(formData.descripcion).trim()) e.descripcion = "Campo requerido";
    if (formData.cantidad === "" || formData.cantidad === null) e.cantidad = "Campo requerido";
    if (!formData.marcaId) e.marcaId = "Campo requerido";
    if (!formData.presentacionId) e.presentacionId = "Campo requerido";
    if (!formData.estadoId) e.estadoId = "Campo requerido";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eVal = validate();
    if (Object.keys(eVal).length) {
      setErrors(eVal);
      return;
    }

    const payload = {
      ...formData,
      productoId: parseInt(formData.productoId),
      unidadId: parseInt(formData.unidadId),
      cantidad: parseFloat(formData.cantidad),
      marcaId: parseInt(formData.marcaId),
      presentacionId: parseInt(formData.presentacionId),
      estadoId: parseInt(formData.estadoId),
      empresaId,
    };

    const isCreate = methodName === "Crear";
    const method = isCreate ? axios.post : axios.put;
    const url = isCreate ? "/v1/producto_presentacion" : `/v1/producto_presentacion/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({ open: true, severity: "success", text: isCreate ? "Creado con éxito!" : "Actualizado con éxito!" });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
      });
  };

  // Para dibujar selects sin repetir JSX
  const selectFields = useMemo(() => ([
    { label: "Producto", name: "productoId", options: productos },
    { label: "Unidad", name: "unidadId", options: unidades },
    { label: "Marca", name: "marcaId", options: marcas },
    { label: "Tipo de Presentación", name: "presentacionId", options: presentaciones },
  ]), [productos, unidades, marcas, presentaciones]);

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Producto – Presentación</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              {/* 1) Producto, 3) Unidad, 6) Marca, 7) Tipo de Presentación */}
              {selectFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <FormControl fullWidth error={!!errors[field.name]}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      label={field.label}
                    >
                      <MenuItem value="">Seleccione...</MenuItem>
                      {(Array.isArray(field.options) ? field.options : []).map(opt => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.nombre ?? opt.name ?? `#${opt.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
                  </FormControl>
                </Grid>
              ))}

              {/* 2) Nombre de la Presentación */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth name="nombre" label="Nombre de la Presentación"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
              </Grid>

              {/* 4) Descripción */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth name="descripcion" label="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                />
              </Grid>

              {/* 5) Cantidad */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth type="number" inputProps={{ step: "any", min: 0 }}
                  name="cantidad" label="Cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad}
                />
              </Grid>

              {/* 8) Estado */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.estadoId}>
                  <InputLabel>Estado</InputLabel>
                  <Select name="estadoId" value={formData.estadoId} onChange={handleChange} label="Estado">
                    <MenuItem value="">Seleccione...</MenuItem>
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="2">Inactivo</MenuItem>
                  </Select>
                  {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormPresentacionproducto.propTypes = {
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};

FormPresentacionproducto.defaultProps = {
  selectedRow: null,
};
