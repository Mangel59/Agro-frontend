import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";

export default function FormTipoMovimiento({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [movimientos, setMovimientos] = React.useState([]);

  const initialData = {
    nombre: "",
    descripcion: "",
    estado: "",
    movimientoId: ""
  };

  const [formData, setFormData] = React.useState(initialData);

  const loadMovimientos = () => {
    axios.get("/v1/movimiento")
      .then(res => {
        const data = res.data;
        setMovimientos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: "Error al cargar movimientos" });
      });
  };

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
    loadMovimientos();
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un tipo de movimiento para editar." });
      return;
    }

    setFormData({
      nombre: selectedRow.nombre || "",
      descripcion: selectedRow.descripcion || "",
      estado: selectedRow.estadoId?.toString() || "",
      movimientoId: selectedRow.movimientoId?.toString() || ""
    });

    setMethodName("Update");
    setOpen(true);
    loadMovimientos();
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un tipo de movimiento para eliminar." });
      return;
    }

    axios.delete(`/v1/tipo_movimiento/${selectedRow.id}`)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de movimiento eliminado correctamente." });
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

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    let empresaId = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      empresaId = payload.empresaId;
    } catch (e) {
      setMessage({ open: true, severity: "error", text: "Error al obtener empresa del token" });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: parseInt(formData.estado),
      movimientoId: parseInt(formData.movimientoId),
      empresaId
    };

    const method = methodName === "Add" ? axios.post : axios.put;
    const url = methodName === "Add" ? "/v1/tipo_movimiento" : `/v1/tipo_movimiento/${selectedRow.id}`;

    method(url, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Tipo de movimiento creado con éxito!" : "Tipo de movimiento actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${err.message || "Network Error"}`
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Tipo de Movimiento</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario para gestionar tipos de movimiento</DialogContentText>

            <TextField
              fullWidth margin="dense" required
              name="nombre" label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            <TextField
              fullWidth margin="dense" required
              name="descripcion" label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Movimiento</InputLabel>
              <Select
                name="movimientoId"
                value={formData.movimientoId}
                onChange={handleChange}
                label="Movimiento"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {Array.isArray(movimientos) && movimientos.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
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

FormTipoMovimiento.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
