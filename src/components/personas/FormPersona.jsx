import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormPersona({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  // Valores iniciales del formulario
  const initialData = {
    tipoIdentificacion: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    genero: "",
    fechaNacimiento: "",
    estrato: "",
    direccion: "",
    email: "",
    celular: "",
    estado: "1"
  };

  const [formData, setFormData] = React.useState(initialData);
  const [tiposIdentificacion, setTiposIdentificacion] = React.useState([]);

  // Traer tipos de identificación desde backend
  React.useEffect(() => {
    axios.get("/v1/items/tipo_identificacion/1")
      .then(res => setTiposIdentificacion(res.data))
      .catch(() => setMessage({ open: true, severity: "error", text: "Error cargando tipos de identificación" }));
  }, []);

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una persona para editar." });
      return;
    }

    setFormData({
      tipoIdentificacion: selectedRow.tipoIdentificacion?.id || selectedRow.tipoIdentificacion || "",
      identificacion: selectedRow.identificacion || "",
      nombre: selectedRow.nombre || "",
      apellido: selectedRow.apellido || "",
      genero: selectedRow.genero || "",
      fechaNacimiento: selectedRow.fechaNacimiento || "",
      estrato: selectedRow.estrato || "",
      direccion: selectedRow.direccion || "",
      email: selectedRow.email || "",
      celular: selectedRow.celular || "",
      estado: selectedRow.estado?.toString() || "1"
    });

    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una persona para eliminar." });
      return;
    }

    axios.delete(`/v1/persona/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Persona eliminada correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch((err) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar: ${err.message}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tipoIdentificacion: parseInt(formData.tipoIdentificacion), // 👈 Enviamos solo el ID al backend
      estado: parseInt(formData.estado),
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/persona" : `/v1/persona/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Persona creada!" : "Persona actualizada!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: `Error: ${err.message}` });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Persona</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para Persona</DialogContentText>

            {/* 👇 Aquí usamos el name para mostrar y el id como value */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Tipo Identificación</InputLabel>
              <Select
                name="tipoIdentificacion"
                value={formData.tipoIdentificacion}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {tiposIdentificacion.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.name} {/* 👈 Este name es lo que el usuario ve */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField fullWidth margin="dense" required name="identificacion" label="Identificación" value={formData.identificacion} onChange={handleChange} />
            <TextField fullWidth margin="dense" required name="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="apellido" label="Apellido" value={formData.apellido} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="genero" label="Género" value={formData.genero} onChange={handleChange} />
            <TextField fullWidth margin="dense" type="date" name="fechaNacimiento" label="Fecha de Nacimiento" value={formData.fechaNacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth margin="dense" name="estrato" label="Estrato" value={formData.estrato} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="email" label="Email" value={formData.email} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="celular" label="Celular" value={formData.celular} onChange={handleChange} />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange}>
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

FormPersona.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
