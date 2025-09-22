import React from "react";
import {
  Box, Grid, Dialog, DialogTitle, DialogContent, IconButton,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Button, Stack, Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Filtros combinados: Ubicación + Pedido.
 *
 * Props:
 * - variant: "dialog" | "inline"
 * - title: string
 * - open: boolean (solo si variant="dialog")
 * - onClose: fn() (solo si variant="dialog")
 * - ubiForm, ubiData, handleUbiChange, onUbiReset   // ubicación (hook)
 * - pedido, pedidos, categoriasEstado, handlePedidoChange, fechasError // pedido (hook)
 * - onApply: fn()  // acción al dar clic en Aplicar
 */
export default function UbicacionPedidoFilters({
  variant = "dialog",
  title = "Filtros",
  open = false,
  onClose = () => {},
  // ubicación
  ubiForm,
  ubiData,
  handleUbiChange,
  onUbiReset,
  // pedido
  pedido,
  pedidos,
  categoriasEstado,
  handlePedidoChange,
  fechasError = false,
  // acción
  onApply,
}) {
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
      {variant !== "dialog" && (
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      )}

      {/* ---- Filtros de Pedido ---- */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Filtros de pedido
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pedido</InputLabel>
            <Select
              name="pedido_id"
              value={pedido.pedido_id || ""}
              label="Pedido"
              onChange={handlePedidoChange("pedido_id")}
            >
              {pedidos.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {`Pedido ${p.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Categoría de estado</InputLabel>
            <Select
              name="categoria_estado_id"
              value={pedido.categoria_estado_id || ""}
              label="Categoría de estado"
              onChange={handlePedidoChange("categoria_estado_id")}
            >
              {categoriasEstado.length ? (
                categoriasEstado.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.nombre ?? `Categoría ${c.id}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Sin opciones
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={pedido.fecha_inicio || ""}
            onChange={handlePedidoChange("fecha_inicio")}
            InputLabelProps={{ shrink: true }}
            error={fechasError}
            helperText={fechasError ? "Inicio no puede ser mayor que fin." : ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Fin"
            name="fecha_fin"
            type="datetime-local"
            fullWidth
            value={pedido.fecha_fin || ""}
            onChange={handlePedidoChange("fecha_fin")}
            InputLabelProps={{ shrink: true }}
            error={fechasError}
            helperText={fechasError ? "Fin debe ser >= Inicio." : ""}
          />
        </Grid>
      </Grid>

      {/* ---- Filtros de Ubicación ---- */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Filtros de ubicación
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>País</InputLabel>
            <Select value={ubiForm.pais_id || ""} onChange={handleUbiChange("pais_id")}>
              {ubiData.paises.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.departamento}>
            <InputLabel>Departamento</InputLabel>
            <Select value={ubiForm.departamento_id || ""} onChange={handleUbiChange("departamento_id")}>
              {ubiData.departamentos.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.municipio}>
            <InputLabel>Municipio</InputLabel>
            <Select value={ubiForm.municipio_id || ""} onChange={handleUbiChange("municipio_id")}>
              {ubiData.municipios.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.sede}>
            <InputLabel>Sede</InputLabel>
            <Select value={ubiForm.sede_id || ""} onChange={handleUbiChange("sede_id")}>
              {ubiData.sedes.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.bloque}>
            <InputLabel>Bloque</InputLabel>
            <Select value={ubiForm.bloque_id || ""} onChange={handleUbiChange("bloque_id")}>
              {ubiData.bloques.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.espacio}>
            <InputLabel>Espacio</InputLabel>
            <Select value={ubiForm.espacio_id || ""} onChange={handleUbiChange("espacio_id")}>
              {ubiData.espacios.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth disabled={disabled.almacen}>
            <InputLabel>Almacén</InputLabel>
            <Select value={ubiForm.almacen_id || ""} onChange={handleUbiChange("almacen_id")}>
              {ubiData.almacenes.map((it) => (
                <MenuItem key={it.id} value={String(it.id)}>{it.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Botones */}
      <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 2 }}>
        {onUbiReset ? <Button onClick={onUbiReset}>Limpiar</Button> : <span />}
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

  return Content; // inline
}
