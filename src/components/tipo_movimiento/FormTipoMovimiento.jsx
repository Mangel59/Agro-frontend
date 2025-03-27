/**
 * @file FormTipoMovimiento.jsx
 * @module FormTipoMovimiento
 * @description Componente de formulario para gestionar Tipos de Movimiento: crear, actualizar o eliminar.
 * Incluye selección dinámica de empresas, validación, comunicación con API y uso de MUI Dialog.
 * @author Karla
 */

import PropTypes from "prop-types";
import * as React from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente de formulario para gestionar Tipos de Movimiento.
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Fila seleccionada del tipo de movimiento
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @param {Function} props.setMessage - Función para mostrar mensajes snackbar
 * @param {Function} props.reloadData - Función para recargar la grilla de datos
 * @returns {JSX.Element} El formulario de tipo de movimiento
 */
export default function FormTipoMovimiento({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = React.useState(false); // Estado del diálogo
  const [methodName, setMethodName] = React.useState(""); // Acción actual (Add / Update)
  const [empresas, setEmpresas] = React.useState([]); // Lista de empresas disponibles

  /**
   * Carga las empresas disponibles desde el backend.
   * Se usa para popular el select de empresa.
   */
  const loadEmpresas = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado" });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/empresas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data?.data)) {
          setEmpresas(response.data.data);
        } else {
          setMessage({ open: true, severity: "error", text: "Error al cargar empresas." });
        }
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al cargar empresas: ${error.message}`,
        });
      });
  };

  /**
   * Abre el formulario en modo creación.
   */
  const create = () => {
    const row = { id: 0, nombre: "", descripcion: "", estado: 1, empresa: "" };
    setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    loadEmpresas();
  };

  /**
   * Abre el formulario en modo actualización.
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
   * Elimina el registro seleccionado.
   */
  const deleteRow = () => {
    if (selectedRow.id === 0) {
      setMessage({ open: true, severity: "error", text: "Selecciona una fila para eliminar" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado" });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/tipo_movimiento/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Tipo de Movimiento eliminado con éxito!" });
        reloadData();
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message;
        setMessage({ open: true, severity: "error", text: `Error al eliminar: ${msg}` });
      });
  };

  /**
   * Cierra el diálogo del formulario.
   */
  const handleClose = () => setOpen(false);

  /**
   * Envía el formulario al backend, ya sea para crear o actualizar un registro.
   * @param {React.FormEvent<HTMLFormElement>} event - Evento del formulario
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = selectedRow?.id || 0;

    if (!formJson.nombre || !formJson.descripcion || !formJson.empresa) {
      setMessage({ open: true, severity: "error", text: "Datos inválidos. Revisa el formulario." });
      return;
    }

    const payload = {
      nombre: formJson.nombre,
      descripcion: formJson.descripcion,
      estado: Number(formJson.estado),
      empresa: formJson.empresa,
    };

    const url = methodName === "Add"
      ? `${SiteProps.urlbasev1}/tipo_movimiento`
      : `${SiteProps.urlbasev1}/tipo_movimiento/${id}`;

    const axiosMethod = methodName === "Add" ? axios.post : axios.put;
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado" });
      return;
    }

    axiosMethod(url, payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Creado con éxito!" : "Actualizado con éxito!",
        });
        setOpen(false);
        reloadData();
      })
      .catch((error) => {
        const msg = error.response?.data?.message || error.message;
        setMessage({ open: true, severity: "error", text: `Error al guardar: ${msg}` });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>Tipo de Movimiento</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={selectedRow?.nombre || ""}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              defaultValue={selectedRow?.descripcion || ""}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              id="empresa"
              name="empresa"
              value={selectedRow?.empresa || ""}
              onChange={(e) => setSelectedRow({ ...selectedRow, empresa: e.target.value })}
              fullWidth
            >
              {empresas.map((empresa) => (
                <MenuItem key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={selectedRow?.estado ?? 1}
              fullWidth
            >
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

FormTipoMovimiento.propTypes = {
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
    empresa: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
