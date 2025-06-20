import * as React from "react";
import PropTypes from "prop-types";
import axios from "../components/axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../components/StackButtons";


export default function FormIngrediente({ selectedRow, setSelectedRow, setMessage, reloadData, open, setOpen }) {
  const [methodName, setMethodName] = React.useState("");

  const initialData = {
    nombre: "",
    descripcion: "",
    estado: ""
  };

  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    if (open) {
      if (selectedRow?.id) {
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
    }
  }, [open, selectedRow]);

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
    const url = methodName === "Agregar" ? "/v1/ingrediente" : `/v1/ingrediente/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Agregar" ? "Ingrediente creado con éxito!" : "Ingrediente actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
      });
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un ingrediente para eliminar." });
      return;
    }

    axios.delete(`/v1/ingrediente/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Ingrediente eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${err.message}` });
      });
  };

  return (
    <>
      <StackButtons methods={{
        create: () => {
          setFormData(initialData);
          setMethodName("Agregar");
          setOpen(true);
        },
        update: () => {
          if (!selectedRow?.id) {
            setMessage({ open: true, severity: "error", text: "Selecciona un ingrediente para editar." });
            return;
          }
          setMethodName("Actualizar");
          setOpen(true);
        },
        deleteRow
      }} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Ingrediente</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar ingredientes</DialogContentText>

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
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

FormIngrediente.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
