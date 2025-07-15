import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormIngredientePresentacionP({ open, setOpen, selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [methodName, setMethodName] = React.useState("");

  const initialData = {
    nombre: "",
    descripcion: "",
    ingredienteId: "",
    presentacionProductoId: "",
    estado: ""
  };

  const [formData, setFormData] = React.useState(initialData);
  const [ingredientes, setIngredientes] = React.useState([]);
  const [presentaciones, setPresentaciones] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      axios.get("/v1/ingrediente").then(res => setIngredientes(res.data));
      axios.get("/v1/producto_presentacion").then(res => setPresentaciones(res.data));
    }

    if (open && selectedRow?.id) {
      setFormData({
        nombre: selectedRow.nombre || "",
        descripcion: selectedRow.descripcion || "",
        ingredienteId: selectedRow.ingredienteId || "",
        presentacionProductoId: selectedRow.presentacionProductoId || "",
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
      ingredienteId: parseInt(formData.ingredienteId),
      presentacionProductoId: parseInt(formData.presentacionProductoId),
      estadoId: parseInt(formData.estado)
    };

    const method = methodName === "Agregar" ? axios.post : axios.put;
    const url = methodName === "Agregar"
      ? "v1/ingrediente-presentacion-producto"
      : `v1/ingrediente-presentacion-producto/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: `Registro ${methodName === "Agregar" ? "creado" : "actualizado"} con éxito!`
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
      setMessage({ open: true, severity: "error", text: "Selecciona un registro para eliminar." });
      return;
    }

    axios.delete(`v1/ingrediente-presentacion-producto/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
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
            setMessage({ open: true, severity: "error", text: "Selecciona un registro para editar." });
            return;
          }
          setOpen(true);
        },
        deleteRow
      }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Ingrediente-Presentación</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para asignar un ingrediente a una presentación de producto</DialogContentText>

            <TextField
              fullWidth
              margin="dense"
              required
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="dense"
              required
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="dense" required>
              <InputLabel>Ingrediente</InputLabel>
              <Select
                name="ingredienteId"
                value={formData.ingredienteId}
                onChange={handleChange}
                label="Ingrediente"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {ingredientes.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" required>
              <InputLabel>Presentación</InputLabel>
              <Select
                name="presentacionProductoId"
                value={formData.presentacionProductoId}
                onChange={handleChange}
                label="Presentación"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {presentaciones.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" required>
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

FormIngredientePresentacionP.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
