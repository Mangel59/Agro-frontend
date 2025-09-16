import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Button, Box
} from "@mui/material";

/**
 * Modal genérico de filtros.
 * @param {Array} fields -> { name,label,getOptions,dependsOn,disabled,clearChildren }
 */
export default function CrudFilterModal({
  open, onClose, title,
  fields, values, onChange,
  onApply, onClear
}) {
  const [options, setOptions] = useState({});

  useEffect(() => {
    fields.forEach(async (f) => {
      if (f.getOptions) {
        const opts = await f.getOptions(values);
        setOptions((prev) => ({ ...prev, [f.name]: opts }));
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
                  onChange({ name: f.name, value: e.target.value })
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
