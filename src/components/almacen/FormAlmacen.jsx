import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

const FormAlmacen = ({ setMessage, selectedRow, setSelectedRow, reloadData }) => {
  const [open, setOpen] = useState(false); // Estado del diálogo
  const [methodName, setMethodName] = useState(""); // Método actual (Add o Update)
  const [sedes, setSedes] = useState([]); // Lista de sedes

  useEffect(() => {
    // Cargar sedes al montar el componente
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar sedes.",
        });
      }
    };

    fetchSedes();
  }, []);

  const handleOpen = (method) => {
    setMethodName(method);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSubmit = () => {
    const payload = {
      id: selectedRow?.id || null,
      nombre: selectedRow?.nombre || "",
      sede: selectedRow?.sede || "",
      geolocalizacion: selectedRow?.geolocalizacion || "",
      coordenadas: selectedRow?.coordenadas || "",
      descripcion: selectedRow?.descripcion || "",
      estado: selectedRow?.estado || 1,
    };

    const url = `${SiteProps.urlbasev1}/almacen`;
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
              ? "Almacén creado con éxito."
              : "Almacén actualizado con éxito.",
        });
        reloadData(); // Recargar datos
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

  const handleDelete = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un almacén para eliminar.",
      });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/almacen/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Almacén eliminado con éxito.",
        });
        reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar almacén:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el almacén. Intente nuevamente.",
        });
      });
  };

  return (
    <>
      {/* Botones de acción */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen("Add")}
        >
          Agregar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={() => handleOpen("Update")}
          style={{ marginLeft: "10px" }}
        >
          Actualizar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          style={{ marginLeft: "10px" }}
        >
          Eliminar
        </Button>
      </Box>

      {/* Diálogo de formulario */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {methodName === "Add" ? "Agregar Almacén" : "Actualizar Almacén"}
        </DialogTitle>
        <DialogContent>
          {/* Selector de Sede */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select
              value={selectedRow?.sede || ""}
              onChange={(e) =>
                setSelectedRow({ ...selectedRow, sede: e.target.value })
              }
            >
              {sedes.map((sede) => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campos del formulario */}
          <TextField
            fullWidth
            label="Nombre"
            value={selectedRow?.nombre || ""}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, nombre: e.target.value })
            }
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Geolocalizacion"
            value={selectedRow?.geolocalizacion || ""}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, geolocalizacion: e.target.value })
            }
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Coordenadas"
            value={selectedRow?.coordenadas || ""}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, coordenadas: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descripción"
            value={selectedRow?.descripcion || ""}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, descripcion: e.target.value })
            }
            margin="normal"
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
};

export default FormAlmacen;
