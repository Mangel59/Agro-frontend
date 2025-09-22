import React from "react";
import {
  Box, Grid, Dialog, DialogTitle, DialogContent, IconButton,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  Stack, Typography, FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Filtros combinados: Producto/Categoría/Fechas + Ubicación
 *
 * Props:
 * - variant: "dialog" | "inline"
 * - title, open, onClose
 * - onApply: fn()  // se ejecuta al dar clic en Aplicar
 *
 * Reporte:
 * - formReporte, setFormReporte
 * - productos, categorias
 * - fechasError, tried
 *
 * Ubicación (hook):
 * - ubiForm, ubiData, handleUbiChange, onUbiReset
 */
export default function UbicacionProductoVencimientoFilters({
  variant = "dialog",
  title = "Filtros (producto + ubicación)",
  open = false,
  onClose = () => {},
  onApply = () => {},

  // Reporte
  formReporte,
  setFormReporte,
  productos = [],
  categorias = [],
  fechasError = false,
  tried = false,

  // Ubicación
  ubiForm,
  ubiData,
  handleUbiChange,
  onUbiReset,
}) {
  const isEmpty = (v) => v === "" || v === null || v === undefined;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isId = name === "producto_id" || name === "producto_categoria_id";
    setFormReporte((prev) => ({ ...prev, [name]: isId ? (value === "" ? "" : Number(value)) : value }));
  };

  const getNameById = (arr, id) => {
    if (isEmpty(id)) return "";
    const it = arr.find((x) => Number(x.id) === Number(id));
    return it?.name ?? "";
  };

  const disabled = {
    departamento: !ubiForm?.pais_id,
    municipio: !ubiForm?.departamento_id,
    sede: !ubiForm?.municipio_id,
    bloque: !ubiForm?.sede_id,
    espacio: !ubiForm?.bloque_id,
    almacen: !ubiForm?.espacio_id,
  };

  const Content = (
    <Box sx={{ pt: variant === "dialog" ? 1 : 0 }}>
      {variant !== "dialog" && <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>}

      {/* === Producto / Categoría / Fechas === */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Filtros del reporte
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={tried && isEmpty(formReporte.producto_id)}>
            <InputLabel>Producto</InputLabel>
            <Select
              label="Producto"
              name="producto_id"
              value={formReporte.producto_id}
              onChange={handleChange}
              displayEmpty
              renderValue={(val) =>
                isEmpty(val) ? <em>Seleccione un producto</em> : getNameById(productos, val)
              }
            >
              <MenuItem value=""><em>Seleccione…</em></MenuItem>
              {productos.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
            {tried && isEmpty(formReporte.producto_id) && (
              <FormHelperText>Debes seleccionar un producto.</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={tried && isEmpty(formReporte.producto_categoria_id)}>
            <InputLabel>Categoría Producto</InputLabel>
            <Select
              label="Categoría Producto"
              name="producto_categoria_id"
              value={formReporte.producto_categoria_id}
              onChange={handleChange}
              displayEmpty
              renderValue={(val) =>
                isEmpty(val) ? <em>Seleccione una categoría</em> : getNameById(categorias, val)
              }
            >
              <MenuItem value=""><em>Seleccione…</em></MenuItem>
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
            {tried && isEmpty(formReporte.producto_categoria_id) && (
              <FormHelperText>Debes seleccionar una categoría.</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={formReporte.fecha_inicio || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={fechasError || (tried && isEmpty(formReporte.fecha_inicio))}
            helperText={
              fechasError ? "Inicio no puede ser mayor que fin." :
              (tried && isEmpty(formReporte.fecha_inicio)) ? "Selecciona la fecha de inicio." : ""
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Fin"
            name="fecha_fin"
            type="datetime-local"
            fullWidth
            value={formReporte.fecha_fin || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={fechasError || (tried && isEmpty(formReporte.fecha_fin))}
            helperText={
              fechasError ? "Fin debe ser >= Inicio." :
              (tried && isEmpty(formReporte.fecha_fin)) ? "Selecciona la fecha de fin." : ""
            }
          />
        </Grid>
      </Grid>

      {/* === Ubicación === */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Filtros de ubicación
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>País</InputLabel>
            <Select value={ubiForm.pais_id || ""} label="País" onChange={handleUbiChange("pais_id")}>
              {ubiData.paises.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.departamento}>
            <InputLabel>Departamento</InputLabel>
            <Select value={ubiForm.departamento_id || ""} label="Departamento" onChange={handleUbiChange("departamento_id")}>
              {ubiData.departamentos.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.municipio}>
            <InputLabel>Municipio</InputLabel>
            <Select value={ubiForm.municipio_id || ""} label="Municipio" onChange={handleUbiChange("municipio_id")}>
              {ubiData.municipios.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.sede}>
            <InputLabel>Sede</InputLabel>
            <Select value={ubiForm.sede_id || ""} label="Sede" onChange={handleUbiChange("sede_id")}>
              {ubiData.sedes.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.bloque}>
            <InputLabel>Bloque</InputLabel>
            <Select value={ubiForm.bloque_id || ""} label="Bloque" onChange={handleUbiChange("bloque_id")}>
              {ubiData.bloques.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.espacio}>
            <InputLabel>Espacio</InputLabel>
            <Select value={ubiForm.espacio_id || ""} label="Espacio" onChange={handleUbiChange("espacio_id")}>
              {ubiData.espacios.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.almacen}>
            <InputLabel>Almacén</InputLabel>
            <Select value={ubiForm.almacen_id || ""} label="Almacén" onChange={handleUbiChange("almacen_id")}>
              {ubiData.almacenes.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        {onUbiReset && <Button onClick={onUbiReset}>Limpiar</Button>}
        <Button variant="contained" onClick={onApply}>Aplicar</Button>
      </Stack>
    </Box>
  );

  if (variant === "dialog") {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {title}
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{Content}</DialogContent>
      </Dialog>
    );
  }

  return Content;
}
