import * as React from "react";
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
import axios from "axios"; // Asegúrate de importar axios
import { SiteProps } from "../dashboard/SiteProps";
import DialogContentText from "@mui/material/DialogContentText";

export default function FormEspacio(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const sedes = props.sedes || [];
  const [bloques, setBloques] = React.useState([]);
  const [tipoEspacio, setTipoEspacio] = React.useState([]);
  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedBloque, setSelectedBloque] = React.useState("");
  const selectedRow = props.selectedRow || {};

  React.useEffect(() => {
    // Cargar tipos de espacio
    const fetchTipoEspacio = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTipoEspacio(response.data || []);
      } catch (error) {
        console.error("Error al cargar tipos de espacio:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar tipos de espacio.",
        });
      }
    };

    fetchTipoEspacio();
  }, []);

  // Actualizar los bloques según la sede seleccionada
  React.useEffect(() => {
    if (!selectedSede) {
      setBloques([]); // Si no hay sede seleccionada, vaciar la lista de bloques
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
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar bloques.",
        });
      }
    };

    fetchBloques();
  }, [selectedSede]);

  // Función para abrir el formulario en modo creación
  const create = () => {
    const row = {
      id: 0,
      tipoEspacio: "",
      nombre: "",
      geolocalizacion: "",
      coordenadas: "",
      descripcion: "",
      estado: 1,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
  };

  // Función para manejar la actualización
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

  // Función para manejar la eliminación
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
      .delete(`${SiteProps.urlbasev1}/espacio/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Espacio eliminado con éxito.",
        });
        props.reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar espacio:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el espacio. Intente nuevamente.",
        });
      });
  };

  // Función para manejar el cierre del diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario
  
    // Validar que los campos requeridos no estén vacíos
    if (!selectedBloque || !selectedRow.tipoEspacio || !selectedRow.nombre) {
      props.setMessage({
        open: true,
        severity: "error",
        text: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }
  
    const payload = {
      bloque: selectedBloque, // Incluye el bloque seleccionado
      tipoEspacio: selectedRow.tipoEspacio,
      nombre: selectedRow.nombre,
      geolocalizacion: selectedRow.geolocalizacion || null,
      coordenadas: selectedRow.coordenadas || null,
      descripcion: selectedRow.descripcion || null,
      estado: selectedRow.estado || 1, // Valor predeterminado
    };
  
    const url = `${SiteProps.urlbasev1}/espacio`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;
  
    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: methodName === "Add" ? "Espacio creado con éxito." : "Espacio actualizado con éxito.",
        });
        props.reloadData(); // Recarga los datos después de guardar
        handleClose(); // Cierra el diálogo
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
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Espacio</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sede</InputLabel>
            <Select
              value={selectedSede || ""}
              onChange={(e) => setSelectedSede(e.target.value)}
            >
              {sedes.map((sede) => (
                <MenuItem key={sede.id} value={sede.id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Bloque</InputLabel>
            <Select
              value={selectedBloque || ""}
              onChange={(e) => setSelectedBloque(e.target.value)}
            >
              {bloques.map((bloque) => (
                <MenuItem key={bloque.id} value={bloque.id}>
                  {bloque.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Espacio</InputLabel>
            <Select
              value={selectedRow.tipoEspacio || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, tipoEspacio: e.target.value })}
            >
              {tipoEspacio.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            value={selectedRow.nombre || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, nombre: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Coordenadas"
            value={selectedRow.coordenadas || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, coordenadas: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            value={selectedRow.descripcion || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, descripcion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
