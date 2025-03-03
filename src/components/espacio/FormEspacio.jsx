import * as React from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import DialogContentText from "@mui/material/DialogContentText";

export default function FormEspacio({ sedes, selectedRow, setMessage, reloadData, setSelectedRow }) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [bloques, setBloques] = React.useState([]);
  const [tipoEspacio, setTipoEspacio] = React.useState([]);
  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedBloque, setSelectedBloque] = React.useState("");

  React.useEffect(() => {
    const fetchTipoEspacio = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTipoEspacio(response.data || []);
      } catch (error) {
        console.error("Error al cargar tipos de espacio:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar tipos de espacio.",
        });
      }
    };
    fetchTipoEspacio();
  }, [setMessage]);

  React.useEffect(() => {
    if (!selectedSede) {
      setBloques([]);
      return;
    }

    const fetchBloques = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/bloque/sede/${selectedSede}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBloques(response.data || []);
      } catch (error) {
        console.error("Error al cargar bloques:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar bloques.",
        });
      }
    };

    fetchBloques();
  }, [selectedSede, setMessage]);

  const create = () => {
    setSelectedRow({
      id: 0,
      tipoEspacio: "",
      nombre: "",
      geolocalizacion: "",
      coordenadas: "",
      descripcion: "",
      estado: 1,
    });
    setMethodName("Add");
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
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
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione una fila para eliminar.",
      });
      return;
    }
    axios
      .delete(`${SiteProps.urlbasev1}/espacio/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Espacio eliminado con éxito.",
        });
        reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar espacio:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el espacio. Intente nuevamente.",
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedBloque || !selectedRow.tipoEspacio || !selectedRow.nombre) {
      setMessage({
        open: true,
        severity: "error",
        text: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    const payload = {
      bloque: selectedBloque,
      tipoEspacio: selectedRow.tipoEspacio,
      nombre: selectedRow.nombre,
      geolocalizacion: selectedRow.geolocalizacion || null,
      coordenadas: selectedRow.coordenadas || null,
      descripcion: selectedRow.descripcion || null,
      estado: selectedRow.estado || 1,
    };

    const url = `${SiteProps.urlbasev1}/espacio`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Espacio creado con éxito." : "Espacio actualizado con éxito.",
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
    <React.Fragment>
      <Box display="flex" justifyContent="right" mb={2}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={create} style={{ marginRight: "10px" }}>
          ADD
        </Button>
        <Button variant="outlined" color="primary" startIcon={<UpdateIcon />} onClick={update} style={{ marginRight: "10px" }}>
          UPDATE
        </Button>
        <Button variant="outlined" color="primary" startIcon={<DeleteIcon />} onClick={deleteRow}>
          DELETE
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: "form", onSubmit: handleSubmit }}>
        <DialogTitle>Espacio</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select value={selectedSede || ""} onChange={(e) => setSelectedSede(e.target.value)}>
              {sedes.map((sede) => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

// Validación de PropTypes
FormEspacio.propTypes = {
  sedes: PropTypes.array.isRequired,
  selectedRow: PropTypes.object,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
