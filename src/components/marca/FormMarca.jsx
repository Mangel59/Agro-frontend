/**
 * @file FormMarca.jsx
 * @module FormMarca
 * @description Componente formulario para gestionar marcas. Permite crear, actualizar y eliminar registros de marcas.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Button, TextField, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, InputLabel, MenuItem,
  FormControl, Select
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente `FormMarca`.
 * 
 * Muestra un formulario para crear, actualizar y eliminar marcas.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {function(Object):void} props.setMessage - Función para mostrar mensajes de snackbar.
 * @param {Object} props.selectedRow - Objeto con los datos de la marca seleccionada.
 * @param {function(Object):void} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {function():void} props.reloadData - Función para recargar los datos.
 * @returns {JSX.Element} El componente FormMarca.
 */
export default function FormMarca({ setMessage, selectedRow, setSelectedRow, reloadData }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [empresas, setEmpresas] = React.useState([]);

  /**
   * Carga la lista de empresas desde el backend.
   */
  const loadEmpresas = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
      return;
    }

    axios.get(`${SiteProps.urlbasev1}/empresas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      const data = response.data?.data;
      if (Array.isArray(data)) {
        setEmpresas(data);
      } else {
        setMessage({ open: true, severity: "error", text: "Error al cargar empresas: respuesta no válida." });
      }
    })
    .catch((error) => {
      setMessage({ open: true, severity: "error", text: `Error al cargar empresas: ${error.message}` });
    });
  };

  /**
   * Abre el formulario para agregar una nueva marca.
   */
  const create = () => {
    setSelectedRow({ id: 0, nombre: "", descripcion: "", estado: 0, empresa: "" });
    setMethodName("Add");
    setOpen(true);
    loadEmpresas();
  };

  /**
   * Abre el formulario para actualizar una marca existente.
   */
  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para actualizar" });
      return;
    }
    setMethodName("Update");
    setOpen(true);
    loadEmpresas();
  };

  /**
   * Elimina la marca seleccionada.
   */
  const deleteRow = () => {
    if (selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
      return;
    }

    axios.delete(`${SiteProps.urlbasev1}/marca/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMessage({ open: true, severity: "success", text: "Marca eliminada con éxito!" });
      reloadData();
    })
    .catch((error) => {
      setMessage({ open: true, severity: "error", text: `Error al eliminar Marca: ${error.message}` });
    });
  };

  /**
   * Cierra el diálogo.
   */
  const handleClose = () => setOpen(false);

  /**
   * Envía el formulario al backend para crear o actualizar la marca.
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const id = selectedRow?.id || 0;

    if (!payload.nombre || !payload.descripcion || !payload.empresa) {
      setMessage({ open: true, severity: "error", text: "Datos inválidos. Revisa el formulario." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Error: Token de autenticación no encontrado." });
      return;
    }

    const url = methodName === "Add"
      ? `${SiteProps.urlbasev1}/marca`
      : `${SiteProps.urlbasev1}/marca/${id}`;
    
    const method = methodName === "Add" ? axios.post : axios.put;

    method(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(() => {
      setMessage({ open: true, severity: "success", text: `Marca ${methodName === "Add" ? "creada" : "actualizada"} con éxito!` });
      setOpen(false);
      reloadData();
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({ open: true, severity: "error", text: `Error al guardar: ${errorMessage}` });
    });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>Marca</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          <FormControl fullWidth margin="normal">
            <TextField name="nombre" label="Nombre" required defaultValue={selectedRow?.nombre || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField name="descripcion" label="Descripción" required defaultValue={selectedRow?.descripcion || ""} />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              name="empresa"
              value={selectedRow?.empresa || ""}
              onChange={(e) => setSelectedRow({ ...selectedRow, empresa: e.target.value })}
            >
              {empresas.map((empresa) => (
                <MenuItem key={empresa.id} value={empresa.id}>{empresa.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select labelId="estado-label" name="estado" defaultValue={selectedRow?.estado || 1}>
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
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

FormMarca.propTypes = {
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    empresa: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estado: PropTypes.number,
  }).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
