import * as React from "react";
import {
  Button, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  InputLabel, MenuItem, FormControl, Select
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FormEvaluacionItem({
  onAdd,
  onUpdate,
  onDelete,
  selectedRow,
  setSelectedRow,
}) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [criterios, setCriterios] = React.useState([]);
  const [formData, setFormData] = React.useState({
    evi_evaluacion_id: "",
    evi_valor: "",
    evi_criterio_evaluacion_id: "",
    evi_descripcion: "",
    evi_estado: 1,
  });

  React.useEffect(() => {
    fetch("/criterio_evaluacion.json")
      .then((res) => res.json())
      .then((data) => setCriterios(data))
      .catch((err) => console.error("Error cargando criterio_evaluacion.json:", err));
  }, []);

  const handleOpen = (mode) => {
    setMethodName(mode);
    if (mode === "Update" && selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        evi_evaluacion_id: "",
        evi_valor: "",
        evi_criterio_evaluacion_id: "",
        evi_descripcion: "",
        evi_estado: 1,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "evi_estado" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.evi_evaluacion_id ||
      !formData.evi_valor ||
      !formData.evi_criterio_evaluacion_id ||
      !formData.evi_descripcion
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    methodName === "Add" ? onAdd(formData) : onUpdate(formData);
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow?.evi_id) {
      onDelete(selectedRow.evi_id);
      handleClose();
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen("Add")}>ADD</Button>
        <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={() => handleOpen("Update")} disabled={!selectedRow}>UPDATE</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} disabled={!selectedRow}>DELETE</Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar" : "Editar"} Ítem de Evaluación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Completa todos los campos requeridos.
          </DialogContentText>

          <FormControl fullWidth margin="normal">
            <TextField
              name="evi_evaluacion_id"
              label="Evaluación ID"
              type="number"
              value={formData.evi_evaluacion_id}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              name="evi_valor"
              label="Valor"
              type="number"
              inputProps={{ min: 0, max: 10 }}
              value={formData.evi_valor}
              onChange={handleChange}
              required
            />
          </FormControl>
           <FormControl fullWidth margin="normal">
            <InputLabel>Criterio de Evaluación</InputLabel>
            <Select
              name="evi_criterio_evaluacion_id"
              value={formData.evi_criterio_evaluacion_id}
              onChange={handleChange}
              label="Criterio de Evaluación"
              required
            >
              {criterios.map((crit) => (
                <MenuItem key={crit.cre_id} value={crit.cre_id}>
                  {crit.cre_nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <TextField
              name="evi_descripcion"
              label="Descripción"
              multiline
              rows={3}
              value={formData.evi_descripcion}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="evi_estado"
              value={formData.evi_estado}
              onChange={handleChange}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {methodName === "Add" ? "Agregar" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
