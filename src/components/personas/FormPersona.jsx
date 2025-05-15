/**
 * @file FormPais.jsx
 * @module FormPais
 * @description Componente formulario para gestionar países. Usa Material UI Dialog y acciones estándar.
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "../axiosConfig";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormPais({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

  const initialData = {
    nombre: "",
    codigo: "",
    acronimo: "",
    empresa: "",
    estado: ""
  };

  const [formData, setFormData] = React.useState(initialData);
  const [empresas, setEmpresas] = React.useState([]);
  const [estados, setEstados] = React.useState([]);

  // Cargar opciones
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/empresa`).then((res) => setEmpresas(res.data));
    axios.get(`${SiteProps.urlbasev1}/estado`).then((res) => setEstados(res.data));
  }, []);

  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un país para actualizar." });
      return;
    }
    setFormData({
      nombre: selectedRow.nombre || "",
      codigo: selectedRow.codigo || "",
      acronimo: selectedRow.acronimo || "",
      empresa: selectedRow.empresa?.id || "",
      estado: selectedRow.estado?.id || ""
    });
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona un país para eliminar." });
      return;
    }

    const url = `${SiteProps.urlbasev1}/pais/${selectedRow.id}`;
    axios.delete(url)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "País eliminado correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(error => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${error.message}` });
      });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      nombre: formData.nombre,
      codigo: parseInt(formData.codigo),
      acronimo: formData.acronimo.toUpperCase(),
      empresa: { id: parseInt(formData.empresa) },
      estado: { id: parseInt(formData.estado) }
    };

    const url = `${SiteProps.urlbasev1}/pais`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "País creado con éxito!" : "País actualizado con éxito!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(error => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error: ${error.message}`
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} País</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario de país</DialogContentText>

            <TextField
              fullWidth margin="dense" required
              name="nombre" label="Nombre"
              value={formData.nombre} onChange={handleChange}
            />

            <TextField
              fullWidth margin="dense" required type="number"
              name="codigo" label="Código"
              value={formData.codigo} onChange={handleChange}
            />

            <TextField
              fullWidth margin="dense" required
              name="acronimo" label="Acrónimo" inputProps={{ maxLength: 3 }}
              value={formData.acronimo} onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Empresa</InputLabel>
              <Select name="empresa" value={formData.empresa} onChange={handleChange}>
                <MenuItem value="">Seleccione...</MenuItem>
                {empresas.map((e) => (
                  <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={formData.estado} onChange={handleChange}>
                <MenuItem value="">Seleccione...</MenuItem>
                {estados.map((e) => (
                  <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                ))}
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

FormPais.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
