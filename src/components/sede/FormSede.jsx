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
import axios from "../axiosConfig"; // Usa tu configuración de axios
import { SiteProps } from "../dashboard/SiteProps";

export default function FormSede({ selectedRow, setSelectedRow, reloadData, setMessage, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [tipoSedes, setTipoSedes] = useState([]);
  const [grupos, setGrupos] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    if (!token || token.trim() === "") {
      console.error("Token inválido");
      return;
    }
    try {
      const [tipoSedeResponse, grupoResponse, municipioResponse] = await Promise.all([
        axios.get('/api/v1/tipo_sede/minimal', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/v1/grupo/minimal', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/v1/municipio/all', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setTipoSedes(tipoSedeResponse.data || []);
      setGrupos(grupoResponse.data || []);
      setMunicipios(municipioResponse.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "No se pudo cargar la información de municipios, grupos o tipos de sede.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (method) => {
    if (method !== "Add" && (!selectedRow || selectedRow.id == null)) {
      setMessage({ open: true, severity: "error", text: "Seleccione un registro primero." });
      return;
    }
    setMethodName(method);
    if (method === "Delete") {
      onDelete(selectedRow.id);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setSelectedRow({
      id: null,
      nombre: "",
      municipioId: "",
      grupoId: "",
      tipoSedeId: "",
      area: "",
      comuna: "",
      descripcion: "",
      estadoId: 1,
    });
    setOpen(false);
  };

  const handleSubmit = () => {
    if (methodName === "Add") {
      onAdd(selectedRow);
    } else {
      onUpdate(selectedRow);
    }
    handleClose();
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                value={selectedRow?.nombre || ""}
                onChange={(e) => setSelectedRow({ ...selectedRow, nombre: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Área (m²)"
                type="number"
                value={selectedRow?.area || ""}
                onChange={(e) => setSelectedRow({ ...selectedRow, area: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Comuna"
                value={selectedRow?.comuna || ""}
                onChange={(e) => setSelectedRow({ ...selectedRow, comuna: e.target.value })}
              />
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
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
