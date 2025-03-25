/**
 * @file FormPersona.jsx
 * @module FormPersona
 * @description Componente formulario para gestionar creación, edición y eliminación lógica de personas. Utiliza Material UI Dialog.
 * @author Karla
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

/**
 * Componente FormPersona.
 *
 * Maneja la creación, edición y eliminación lógica de registros de personas.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {Object} props.selectedRow - Objeto de persona actualmente seleccionada.
 * @param {Function} props.setSelectedRow - Función para actualizar la persona seleccionada.
 * @param {Function} props.setMessage - Función para mostrar mensajes en snackbar.
 * @param {Function} props.reloadData - Función para recargar los datos desde la API.
 * @returns {JSX.Element} Formulario en diálogo para gestionar personas.
 */
export default function FormPersona({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");

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
    celular: ""
  };

  const [formData, setFormData] = React.useState(initialData);

  /**
   * Abre el diálogo en modo creación.
   */
  const create = () => {
    setFormData(initialData);
    setMethodName("Add");
    setOpen(true);
  };

  /**
   * Abre el diálogo en modo edición con datos precargados.
   */
  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar." });
      return;
    }
    setFormData({ ...selectedRow });
    setMethodName("Update");
    setOpen(true);
  };

  /**
   * Elimina (de forma lógica) la persona seleccionada.
   */
  const deleteRow = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar." });
      return;
    }

    const url = `${SiteProps.urlbasev1}/persona/${selectedRow.id}`;
    axios.put(url, { ...selectedRow, estado: 2 })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Persona eliminada (estado inactivo)." });
        setSelectedRow({});
        reloadData();
      })
      .catch(error => {
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${error.message}` });
      });
  };

  const handleClose = () => setOpen(false);

  /**
   * Actualiza los valores del formulario.
   * @param {React.ChangeEvent} e - Evento de cambio del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario para crear o actualizar.
   * @param {React.FormEvent} event - Evento submit.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const fechaISO = new Date(formData.fechaNacimiento).toISOString().split('T')[0];

    const payload = {
      ...formData,
      tipoIdentificacion: parseInt(formData.tipoIdentificacion),
      estrato: parseInt(formData.estrato),
      fechaNacimiento: fechaISO,
      estado: 1
    };

    const url = `${SiteProps.urlbasev1}/persona`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Persona creada con éxito!" : "Persona actualizada con éxito!"
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
          <DialogTitle>{methodName} Persona</DialogTitle>
          <DialogContent>
            <DialogContentText>Formulario de persona</DialogContentText>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Tipo Identificación</InputLabel>
              <Select
                name="tipoIdentificacion"
                value={formData.tipoIdentificacion}
                onChange={handleChange}
                label="Tipo Identificación"
              >
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value={1}>Cédula</MenuItem>
                <MenuItem value={2}>Pasaporte</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth margin="dense" required name="identificacion" label="Identificación" value={formData.identificacion} onChange={handleChange} />
            <TextField fullWidth margin="dense" required name="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} />
            <TextField fullWidth margin="dense" required name="apellido" label="Apellido" value={formData.apellido} onChange={handleChange} />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Género</InputLabel>
              <Select name="genero" value={formData.genero} onChange={handleChange}>
                <MenuItem value="">Seleccione...</MenuItem>
                <MenuItem value="m">Masculino</MenuItem>
                <MenuItem value="f">Femenino</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="dense"
              required
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estrato</InputLabel>
              <Select name="estrato" value={formData.estrato} onChange={handleChange}>
                <MenuItem value="">Seleccione...</MenuItem>
                {[1, 2, 3, 4, 5, 6].map((e) => (
                  <MenuItem key={e} value={e}>{e}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField fullWidth margin="dense" required name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
            <TextField fullWidth margin="dense" name="celular" label="Celular" value={formData.celular} onChange={handleChange} />
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
