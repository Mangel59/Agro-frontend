import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

export default function BaseFormCampos({ formData, errors, handleChange }) {
  return (
    <>
      <TextField
        fullWidth margin="dense"
        name="nombre" label="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        error={!!errors.nombre}
        helperText={errors.nombre}
      />
      <TextField
        fullWidth margin="dense"
        name="descripcion" label="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        error={!!errors.descripcion}
        helperText={errors.descripcion}
      />
      <FormControl fullWidth margin="normal" error={!!errors.estado}>
        <InputLabel>Estado</InputLabel>
        <Select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          label="Estado"
        >
          <MenuItem value="">Seleccione...</MenuItem>
          <MenuItem value="1">Activo</MenuItem>
          <MenuItem value="2">Inactivo</MenuItem>
        </Select>
        {errors.estado && (
          <FormHelperText>{errors.estado}</FormHelperText>
        )}
      </FormControl>
    </>
  );
}
