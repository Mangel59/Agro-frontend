import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Button, Box
} from "@mui/material";

/**
 * Modal genérico de filtros con limpieza automática de campos dependientes.
 * @param {Array} fields -> { name, label, getOptions, dependsOn, disabled, clearChildren }
 * - clearChildren: Array de nombres de campos que se limpiarán cuando este campo cambie
 * - dependsOn: Array de nombres de campos de los que depende este campo
 * - disabled: Función que determina si el campo está deshabilitado basado en values
 */
export default function CrudFilterModal({
  open, onClose, title,
  fields, values, onChange,
  onApply, onClear
}) {
  const [options, setOptions] = useState({});

  // Función para manejar cambios con limpieza automática de hijos
  const handleFieldChange = (fieldName, value) => {
    const field = fields.find(f => f.name === fieldName);
    
    // Primero, actualizar el campo actual
    onChange({ name: fieldName, value });
    
    // Luego, limpiar los campos hijos si existen
    if (field?.clearChildren && field.clearChildren.length > 0) {
      field.clearChildren.forEach(childName => {
        onChange({ name: childName, value: "" });
      });
    }
  };

  useEffect(() => {
    fields.forEach(async (f) => {
      if (f.getOptions) {
        const opts = await f.getOptions(values);
        setOptions((prev) => ({ ...prev, [f.name]: opts }));
        
        // Auto-seleccionar si solo hay una opción y el campo está vacío
        if (opts.length === 1 && !values[f.name]) {
          const field = fields.find(field => field.name === f.name);
          // Solo auto-completar si el campo no está deshabilitado
          if (!field?.disabled?.(values)) {
            handleFieldChange(f.name, opts[0].value);
          }
        }
      }
    });
  }, [fields, values]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {fields.map((f) => (
            <FormControl key={f.name} fullWidth disabled={f.disabled?.(values)}>
              <InputLabel>{f.label}</InputLabel>
              <Select
                value={values[f.name] || ""}
                onChange={(e) =>
                  handleFieldChange(f.name, e.target.value)
                }
              >
                <MenuItem value="">Todos</MenuItem>
                {(options[f.name] || []).map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClear}>Limpiar</Button>
        <Button variant="contained" onClick={onApply}>Aplicar</Button>
      </DialogActions>
    </Dialog>
  );
}
