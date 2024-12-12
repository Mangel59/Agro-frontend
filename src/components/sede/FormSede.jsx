import * as React from "react";
import axios from "axios";
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
  Grid,
} from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FormSede(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [municipios, setMunicipios] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]); // Estado para los grupos
  const [tipoSedes, setTipoSedes] = React.useState([]); // Estado para los tipos de sede
  const selectedRow = props.selectedRow || {};

  React.useEffect(() => {
    // Cargar datos de municipios, grupos y tipo de sede
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

  // Método para manejar la creación
  const create = () => {
    const emptyRow = {
      id: 0,
      grupo: "",
      tipoSede: "",
      nombre: "",
      municipio: "",
      geolocalizacion: null,
      area: 0,
      comuna: "",
      descripcion: "",
      estado: 1,
    };
    props.setSelectedRow(emptyRow);
    setMethodName("Add");
    setOpen(true);
  };

  // Método para manejar la actualización
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

  // Método para manejar la eliminación
  const deleteRow = () => {
    if (!selectedRow || selectedRow.id === 0) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar.",
      });
      return;
    }
    axios
      .delete(`${SiteProps.urlbasev1}/sede/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Sede eliminada con éxito.",
        });
        props.reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar sede:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar la sede. Intente nuevamente.",
        });
      });
  };

  // Método para manejar el cierre del diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Método para manejar el envío del formulario
  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id || null,
      grupo: selectedRow.grupo,
      tipoSede: selectedRow.tipoSede,
      nombre: selectedRow.nombre,
      municipio: selectedRow.municipio,
      geolocalizacion: selectedRow.geolocalizacion || null,
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
        props.setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Sede creada con éxito." : "Sede actualizada con éxito.",
        });
        props.reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al enviar datos. Intente nuevamente.",
        });
      });
  };

  return (
    <React.Fragment>
     <Box display="flex" justifyContent="right" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={create}
          style={{ marginRight: "10px" }}
        >
          ADD
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={update}
          style={{ marginRight: "10px" }}
        >
          UPDATE
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={deleteRow}
        >
          DELETE
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{methodName === "Add" ? "Agregar Sede" : "Actualizar Sede"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Grupo</InputLabel>
            <Select
              value={selectedRow.grupo || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, grupo: e.target.value })}
            >
              {grupos.map((grupo) => (
                <MenuItem key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Sede</InputLabel>
            <Select
              value={selectedRow.tipoSede || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, tipoSede: e.target.value })}
            >
              {tipoSedes.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Nombre"
            value={selectedRow.nombre || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, nombre: e.target.value })}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Municipio</InputLabel>
            <Select
              value={selectedRow.municipio || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, municipio: e.target.value })}
            >
              {municipios.map((mun) => (
                <MenuItem key={mun.id} value={mun.id}>
                  {`${mun.id} - ${mun.nombre}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Área"
            value={selectedRow.area || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, area: e.target.value })}
          />
          <TextField
            fullWidth
            label="Comuna"
            value={selectedRow.comuna || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, comuna: e.target.value })}
          />
          <TextField
            fullWidth
            label="Descripción"
            value={selectedRow.descripcion || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, descripcion: e.target.value })}
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
    </React.Fragment>
  );
}
