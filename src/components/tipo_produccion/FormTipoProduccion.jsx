import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormTipoProduccion({ open, setOpen, selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [methodName, setMethodName] = React.useState("");

  const initialData = { nombre: "", descripcion: "", estado: "" };
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    if (open && selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        estado: selectedRow.estadoId?.toString() || ""
      });
      setMethodName("Actualizar");
    } else {
      setFormData(initialData);
      setMethodName("Agregar");
    }
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Agregar" ? axios.post : axios.put;
    const url = methodName === "Agregar"
      ? "/v1/tipo_produccion"
      : `/v1/tipo_produccion/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: `Tipo de Producción ${methodName === "Agregar" ? "creado" : "actualizado"} con éxito!`
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${err.message}`
        });
      });
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un tipo de producción para eliminar." });
      return;
    }

    axios.delete(`/v1/tipo_produccion/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Producción eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${err.message}`,
        });
      });
  };

  return (
    <>
      <StackButtons methods={{
        create: () => { setFormData(initialData); setMethodName("Agregar"); setOpen(true); },
        update: () => {
          if (!selectedRow?.id) {
            setMessage({ open: true, severity: "error", text: "Selecciona un tipo de producción para editar." });
            return;
          }
          setOpen(true);
        },
        deleteRow
      }} />

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Tipo de Producción</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar tipos de producción</DialogContentText>

            <TextField fullWidth margin="dense" required name="nombre" label="Nombre"
              value={formData.nombre} onChange={handleChange} />

            <TextField fullWidth margin="dense" required name="descripcion" label="Descripción"
              value={formData.descripcion} onChange={handleChange} />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange} label="Estado">
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormTipoProduccion.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
