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
} from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

function FormBloque({ selectedRow = {}, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [sedes, setSedes] = useState([]);
  const [tipoBloques, setTipoBloques] = useState([]);

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
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar datos iniciales.",
        });
      }
    };

    fetchData();
  }, [setMessage]);

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

  const update = () => {
    if (!selectedRow || selectedRow.id == null) {
      setMessage({
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
    if (!selectedRow || selectedRow.id == null) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar.",
      });
      return;
    }
    axios
      .delete(`${SiteProps.urlbasev1}/bloque/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Bloque eliminado con éxito.",
        });
        reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar bloque:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el bloque. Intente nuevamente.",
        });
      });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    const payload = {
      id: selectedRow?.id || null,
      sede: selectedRow?.sede || "",
      tipoBloque: selectedRow?.tipoBloque || "",
      nombre: selectedRow?.nombre || "",
      geolocalizacion: selectedRow?.geolocalizacion || null,
      coordenadas: selectedRow?.coordenadas || null,
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
          text:
            methodName === "Add"
              ? "Bloque creado con éxito."
              : "Bloque actualizado con éxito.",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al enviar datos. Intente nuevamente.",
        });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create}>
          Agregar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginLeft: "10px" }}
        >
          Actualizar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
          style={{ marginLeft: "10px" }}
        >
          Eliminar
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Bloque" : "Actualizar Bloque"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select
              value={selectedRow?.sede || ""}
              onChange={(e) => setSelectedRow({ ...selectedRow, sede: e.target.value })}
            >
              {sedes.map((sede) => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Bloque</InputLabel>
            <Select
              value={selectedRow?.tipoBloque || ""}
              onChange={(e) => setSelectedRow({ ...selectedRow, tipoBloque: e.target.value })}
            >
              {tipoBloques.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Nombre"
            value={selectedRow?.nombre || ""}
            onChange={(e) => setSelectedRow({ ...selectedRow, nombre: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={selectedRow?.descripcion || ""}
            onChange={(e) => setSelectedRow({ ...selectedRow, descripcion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {methodName === "Add" ? "Agregar" : "Actualizar"}
          </Button>
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
