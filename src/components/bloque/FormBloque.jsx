/**
 * Formulario para gestionar bloques: agregar, actualizar y eliminar.
 * Incluye campos como sede, tipo de bloque, nombre, geolocalización, coordenadas,
 * número de pisos, descripción y estado. Se conecta con el backend para guardar cambios.
 *
 * @module FormBloque
 * @component
 * @param {Object} props
 * @param {Object} props.selectedRow - Fila actualmente seleccionada.
 * @param {Function} props.setSelectedRow - Setter para modificar la fila seleccionada.
 * @param {Function} props.setMessage - Función para mostrar mensajes de éxito o error.
 * @param {Function} props.reloadData - Función para recargar los datos de la tabla.
 * @returns {JSX.Element} El formulario para crear, editar o eliminar bloques.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid,
} from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

function FormBloque({ selectedRow = {}, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [sedes, setSedes] = useState([]);
  const [tipoBloques, setTipoBloques] = useState([]);

  /**
   * Carga las sedes y tipos de bloque cuando el componente se monta.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sedesRes, tipoBloquesRes] = await Promise.all([
          axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get(`${SiteProps.urlbasev1}/tipo_bloque/minimal`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setSedes(sedesRes.data || []);
        setTipoBloques(tipoBloquesRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar datos iniciales." });
      }
    };

    fetchData();
  }, [setMessage]);

  /**
   * Abre el formulario para crear un nuevo bloque.
   */
  const create = () => {
    setSelectedRow({
      id: null,
      sede: "",
      tipoBloque: "",
      nombre: "",
      geolocalizacion: "",
      coordenadas: "",
      numeroPisos: 0,
      descripcion: "",
      estado: 1,
    });
    setMethodName("Add");
    setOpen(true);
  };

  /**
   * Abre el formulario para actualizar un bloque existente.
   */
  const update = () => {
    if (!selectedRow || selectedRow.id == null) {
      setMessage({ open: true, severity: "error", text: "Seleccione una fila para actualizar." });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  /**
   * Elimina el bloque actualmente seleccionado.
   */
  const deleteRow = () => {
    if (!selectedRow || selectedRow.id == null) {
      setMessage({ open: true, severity: "error", text: "Seleccione una fila para eliminar." });
      return;
    }
    axios.delete(`${SiteProps.urlbasev1}/bloque/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Bloque eliminado con éxito." });
        reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar bloque:", error);
        setMessage({ open: true, severity: "error", text: "Error al eliminar el bloque. Intente nuevamente." });
      });
  };

  const handleClose = () => setOpen(false);

  /**
   * Maneja los cambios en los campos del formulario.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Envía los datos del formulario al backend para agregar o actualizar.
   */
  const handleSubmit = () => {
    const payload = {
      id: selectedRow?.id || null,
      sede: selectedRow?.sede || "",
      tipoBloque: selectedRow?.tipoBloque || "",
      nombre: selectedRow?.nombre || "",
      geolocalizacion: selectedRow?.geolocalizacion || "",
      coordenadas: selectedRow?.coordenadas || "",
      numeroPisos: selectedRow?.numeroPisos || 0,
      descripcion: selectedRow?.descripcion || "",
      estado: selectedRow?.estado || 1,
    };

    const url = `${SiteProps.urlbasev1}/bloque`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Bloque creado con éxito." : "Bloque actualizado con éxito.",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        setMessage({ open: true, severity: "error", text: "Error al enviar datos. Intente nuevamente." });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create} sx={{ mr: 1 }}>Agregar</Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={update} sx={{ mr: 1 }}>Actualizar</Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={deleteRow}>Eliminar</Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Bloque" : "Actualizar Bloque"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Sede</InputLabel>
                <Select
                  value={selectedRow?.sede || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, sede: e.target.value })}
                >
                  {sedes.map((sede) => (
                    <MenuItem key={sede.id} value={sede.id}>{sede.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Bloque</InputLabel>
                <Select
                  value={selectedRow?.tipoBloque || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, tipoBloque: e.target.value })}
                >
                  {tipoBloques.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={selectedRow?.nombre || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Geolocalización (lat,lng)"
                name="geolocalizacion"
                value={selectedRow?.geolocalizacion || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coordenadas"
                name="coordenadas"
                value={selectedRow?.coordenadas || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número de Pisos"
                name="numeroPisos"
                type="number"
                value={selectedRow?.numeroPisos || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={selectedRow?.descripcion || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={selectedRow?.estado || 1}
                  onChange={handleInputChange}
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

FormBloque.propTypes = {
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};

export default FormBloque;