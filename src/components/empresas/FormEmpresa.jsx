/**
 * Componente principal del formulario de empresa.
 *
 * Este componente permite crear, actualizar o eliminar una empresa mediante un formulario emergente.
 *
 * @module FormEmpresa
 * @component
 * @returns {JSX.Element}
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} EmpresaRow
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} estado
 * @property {string} celular
 * @property {string} correo
 * @property {string} contacto
 * @property {number|string} tipoIdentificacionId
 * @property {number|string} personaId
 * @property {string} identificacion
 * @property {string} logo
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open
 * @property {string} severity
 * @property {string} text
 */

/**
 * @param {{
 *   selectedRow: EmpresaRow,
 *   setSelectedRow: Function,
 *   setMessage: Function,
 *   reloadData: Function
 * }} props
 * @returns {JSX.Element}
 */
export default function FormEmpresa({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  // Valores iniciales de empresa
  const defaultRow = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1,
    celular: "",
    correo: "",
    contacto: "",
    tipoIdentificacionId: "",
    personaId: "",
    identificacion: "",
    logo: "", // ✅ nuevo campo
  };

  const create = () => {
    setSelectedRow(defaultRow);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || !selectedRow.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar.",
      });
      return;
    }
    setMethodName("Actualizar ");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || !selectedRow.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar.",
      });
      return;
    }

    const url = `${SiteProps.urlbasev1}/empresas/${selectedRow.id}`;
    axios
      .delete(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Empresa eliminada con éxito!",
        });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar empresa: ${error.response?.data.message || error.message}`,
        });
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const url = `${SiteProps.urlbasev1}/empresas`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, formJson, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Empresa creada con éxito!" : "Empresa actualizada con éxito!",
        });
        setOpen(false);
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al guardar empresa: ${error.response?.data.message || error.message}`,
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>{methodName} Empresa</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          <FormControl fullWidth margin="normal">
            <TextField required id="nombre" name="nombre" label="Nombre" variant="standard" defaultValue={selectedRow?.nombre || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField required id="descripcion" name="descripcion" label="Descripción" variant="standard" defaultValue={selectedRow?.descripcion || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select labelId="estado-label" id="estado" name="estado" defaultValue={selectedRow?.estado || ""} fullWidth>
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField required id="celular" name="celular" label="Celular" variant="standard" defaultValue={selectedRow?.celular || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField required id="correo" name="correo" label="Correo" type="email" variant="standard" defaultValue={selectedRow?.correo || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField required id="contacto" name="contacto" label="Contacto" variant="standard" defaultValue={selectedRow?.contacto || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="tipoIdentificacionId-label">Tipo de Identificación</InputLabel>
            <Select labelId="tipoIdentificacionId-label" id="tipoIdentificacionId" name="tipoIdentificacionId" defaultValue={selectedRow?.tipoIdentificacionId || ""} fullWidth>
              <MenuItem value={1}>Cédula</MenuItem>
              <MenuItem value={2}>Pasaporte</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField required id="personaId" name="personaId" label="ID Persona" variant="standard" defaultValue={selectedRow?.personaId || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField required id="identificacion" name="identificacion" label="Número de Identificación" variant="standard" defaultValue={selectedRow?.identificacion || ""} />
          </FormControl>

          {/* ✅ NUEVO CAMPO: URL del Logo */}
          <FormControl fullWidth margin="normal">
            <TextField id="logo" name="logo" label="URL del Logo" variant="standard" defaultValue={selectedRow?.logo || ""} />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Validación de Props con PropTypes
FormEmpresa.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
