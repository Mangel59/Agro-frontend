/**
 * @file FormSede.jsx
 * @module FormSede
 * @description Formulario de gestión de sedes: permite agregar, actualizar y eliminar sedes.
 * Utiliza selectores para municipio, grupo y tipo de sede. Permite entrada numérica controlada en campos específicos.
 * Se conecta al backend y maneja peticiones asincrónicas con axios. 
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * @typedef {Object} SedeRow
 * @property {number} id - ID de la sede
 * @property {number|string} grupo - ID del grupo
 * @property {number|string} tipoSede - ID del tipo de sede
 * @property {string} nombre - Nombre de la sede
 * @property {number|string} municipio - ID del municipio
 * @property {string} geolocalizacion - Coordenada numérica (latitud/longitud)
 * @property {string} coordenadas - Coordenadas en texto (números y espacios)
 * @property {number|string} area - Área de la sede
 * @property {number|string} comuna - Comuna (valor numérico)
 * @property {string} descripcion - Descripción de la sede
 * @property {number} estado - Estado de la sede (1: Activo, 0: Inactivo)
 */

/**
 * Componente FormSede: gestiona la creación y edición de sedes.
 * @param {{selectedRow: SedeRow, setSelectedRow: Function, reloadData: Function, setMessage: Function}} props
 * @returns {JSX.Element}
 */
export default function FormSede(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [municipios, setMunicipios] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [tipoSedes, setTipoSedes] = React.useState([]);

  const selectedRow = props.selectedRow || {};

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [municipioRes, grupoRes, tipoSedeRes] = await Promise.all([
          axios.get(`${SiteProps.urlbasev1}/items/municipio`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get(`${SiteProps.urlbasev1}/grupo/minimal`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get(`${SiteProps.urlbasev1}/tipo_sede/minimal`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setMunicipios(municipioRes.data || []);
        setGrupos(grupoRes.data || []);
        setTipoSedes(tipoSedeRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar datos iniciales.",
        });
      }
    };
    fetchData();
  }, []);

  const create = () => {
    const emptyRow = {
      id: 0,
      grupo: 1,
      tipoSede: "",
      nombre: "",
      municipio: "",
      geolocalizacion: "",
      coordenadas: "",
      area: "",
      comuna: "",
      descripcion: "",
      estado: 1,
    };
    props.setSelectedRow(emptyRow);
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para actualizar.",
      });
      return;
    }
    setMethodName("Update");
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar.",
      });
      return;
    }

    axios.delete(`${SiteProps.urlbasev1}/sede/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({ open: true, severity: "success", text: "Sede eliminada con éxito." });
        props.reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar sede:", error);
        props.setMessage({ open: true, severity: "error", text: "Error al eliminar la sede. Intente nuevamente." });
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id || null,
      grupo: selectedRow.grupo,
      tipoSede: selectedRow.tipoSede,
      nombre: selectedRow.nombre,
      municipio: selectedRow.municipio,
      geolocalizacion: selectedRow.geolocalizacion,
      coordenadas: selectedRow.coordenadas,
      area: selectedRow.area,
      comuna: selectedRow.comuna,
      descripcion: selectedRow.descripcion,
      estado: selectedRow.estado,
    };

    const url = `${SiteProps.urlbasev1}/sede`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({ open: true, severity: "success", text: methodName === "Add" ? "Sede creada con éxito." : "Sede actualizada con éxito." });
        props.reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        props.setMessage({ open: true, severity: "error", text: "Error al enviar datos. Intente nuevamente." });
      });
  };

  const handleOnlyNumbersAndSpaces = (value) => value.replace(/[^\d\s]/g, "");

  return (
    <>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create} sx={{ mr: 1 }}>AGREGAR</Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={update} sx={{ mr: 1 }}>ACTUALIZAR</Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={deleteRow}>ELIMINAR</Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{methodName === "Add" ? "Agregar Sede" : "Actualizar Sede"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Sede</InputLabel>
                <Select value={selectedRow.tipoSede || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, tipoSede: e.target.value })}>
                  {tipoSedes.map((tipo) => (<MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" value={selectedRow.nombre || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, nombre: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Municipio</InputLabel>
                <Select value={selectedRow.municipio || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, municipio: e.target.value })}>
                  {municipios.map((mun) => (<MenuItem key={mun.id} value={mun.id}>{`${mun.id} - ${mun.nombre}`}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Geolocalización (número)" type="number" value={selectedRow.geolocalizacion || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, geolocalizacion: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Coordenadas" value={selectedRow.coordenadas || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, coordenadas: handleOnlyNumbersAndSpaces(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Área" type="number" value={selectedRow.area || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, area: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Comuna" type="number" value={selectedRow.comuna || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, comuna: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Descripción" value={selectedRow.descripcion || ""} onChange={(e) => props.setSelectedRow({ ...selectedRow, descripcion: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select value={selectedRow.estado ?? 1} onChange={(e) => props.setSelectedRow({ ...selectedRow, estado: e.target.value })}>
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">{methodName === "Add" ? "Agregar" : "Actualizar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

FormSede.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired
};
