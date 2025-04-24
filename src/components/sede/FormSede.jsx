import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente de formulario para la gestión de sedes.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Objeto que representa la fila seleccionada
 * @param {function(Object): void} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @param {function(): void} props.reloadData - Función para recargar los datos desde la API
 * @param {function(Object): void} props.setMessage - Función para mostrar mensajes en Snackbar
 * @returns {JSX.Element} Formulario para crear, actualizar o eliminar sedes
 */
export default function FormSede({ selectedRow, setSelectedRow, reloadData, setMessage }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [tipoSedes, setTipoSedes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar tipo de sede
        await axios.get('/api/v1/tipo_sede/minimal', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => setTipoSedes(res.data));
        
        // Cargar grupos
        await axios.get('/api/v1/grupo/minimal', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => setGrupos(res.data));

        // Cargar municipios
        await axios.get('/api/v1/municipio/all', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          setMunicipios(res.data);
        });

      } catch (error) {
        console.error("Error al cargar datos iniciales de sede:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar datos iniciales.",
        });
      }
    };

    fetchData();
  }, []);

  const handleOpen = (method) => {
    if (method !== "Add" && (!selectedRow || selectedRow.id == null)) {
      setMessage({ open: true, severity: "error", text: "Seleccione un registro primero." });
      return;
    }
    setMethodName(method);
    if (method === "Delete") {
      handleDelete();
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setSelectedRow({
      id: null,
      nombre: "",
      municipioId: "",
      tipoSedeId: "",
      grupoId: "",
      descripcion: "",
      estadoId: 1,
    });
    setOpen(false);
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = `${SiteProps.urlbasev1}/sede`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, selectedRow, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Sede creada exitosamente." : "Sede actualizada exitosamente.",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al guardar sede:", error);
        const errorMessage = error.response?.status === 403
          ? "No tiene permisos para guardar la sede."
          : "Error al guardar datos.";
        setMessage({ open: true, severity: "error", text: errorMessage });
      });
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.delete(`${SiteProps.urlbasev1}/sede/${selectedRow.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Sede eliminada exitosamente." });
        reloadData();
        setSelectedRow({
          id: null,
          nombre: "",
          municipioId: "",
          tipoSedeId: "",
          grupoId: "",
          descripcion: "",
          estadoId: 1,
        });
      })
      .catch((error) => {
        console.error("Error al eliminar sede:", error);
        const errorMessage = error.response?.status === 403
          ? "No tiene permisos para eliminar la sede."
          : "Error al eliminar el registro.";
        setMessage({ open: true, severity: "error", text: errorMessage });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen("Add")} sx={{ mr: 1 }}>
          Nuevo
        </Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={() => handleOpen("Update")} sx={{ mr: 1 }}>
          Editar
        </Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={() => handleOpen("Delete")}>
          Eliminar
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Sede" : "Actualizar Sede"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                value={selectedRow?.nombre || ""}
                onChange={(e) => setSelectedRow({ ...selectedRow, nombre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Municipio</InputLabel>
                <Select
                  value={selectedRow?.municipioId || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, municipioId: e.target.value })}
                >
                  {municipios.map((mun) => (
                    <MenuItem key={mun.id} value={mun.id}>
                      {mun.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Grupo</InputLabel>
                <Select
                  value={selectedRow?.grupoId || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, grupoId: e.target.value })}
                >
                  {grupos.map((grupo) => (
                    <MenuItem key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Sede</InputLabel>
                <Select
                  value={selectedRow?.tipoSedeId || ""}
                  onChange={(e) => setSelectedRow({ ...selectedRow, tipoSedeId: e.target.value })}
                >
                  {tipoSedes.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Descripción"
                value={selectedRow?.descripcion || ""}
                onChange={(e) => setSelectedRow({ ...selectedRow, descripcion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={selectedRow?.estadoId || 1}
                  onChange={(e) => setSelectedRow({ ...selectedRow, estadoId: e.target.value })}
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

FormSede.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
