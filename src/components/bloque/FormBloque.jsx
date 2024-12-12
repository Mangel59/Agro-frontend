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

export default function FormBloque(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  const [sedes, setSedes] = React.useState([]); // Estado para sedes
  const [tipoBloques, setTipoBloques] = React.useState([]);
  const selectedRow = props.selectedRow || {};

  React.useEffect(() => {
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
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar datos iniciales.",
        });
      }
    };

    fetchData();
  }, []);
  // Función para crear un nuevo bloque
  const create = () => {
    const row = {
      id: 0,
      sede: "",
      tipoBloque: "",
      nombre: "",
      geolocalizacion: null,
      coordenadas: null,
      numeroPisos: 0,
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
      .delete(`${SiteProps.urlbasev1}/bloque/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "Bloque eliminado con éxito.",
        });
        props.reloadData();
      })
      .catch((error) => {
        console.error("Error al eliminar bloque:", error);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el bloque. Intente nuevamente.",
        });
      });
  };

  // Función para manejar el cierre del diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id || null,
      sede: selectedRow.sede,
      tipoBloque: selectedRow.tipoBloque,
      nombre: selectedRow.nombre,
      geolocalizacion: selectedRow.geolocalizacion || null,
      coordenadas: selectedRow.coordenadas || null,
      numeroPisos: selectedRow.numeroPisos,
      descripcion: selectedRow.descripcion,
      estado: selectedRow.estado,
    };

    const url = `${SiteProps.urlbasev1}/bloque`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
      props.setMessage({
        open: true,
        severity: "success",
        text: methodName === "Add" ? "Bloque creado con éxito." : "Bloque actualizado con éxito.",
      });
      props.reloadData(); // Aquí se actualiza la tabla
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
              value={selectedRow.sede || ""}
              onChange={(e) => props.setSelectedRow({ ...selectedRow, sede: e.target.value })}
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
            value={selectedRow.tipoBloque || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, tipoBloque: e.target.value })}
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
            value={selectedRow.nombre || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, nombre: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Geolocalizacion" 
            value={selectedRow.geolocalizacion || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, geolocalizacion: e.target.value })}
            type="number"
          />
          <TextField
            fullWidth
            label="Coordenadas"
            value={selectedRow.coordenadas || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, coordenadas: e.target.value })}
          />
          <TextField
            fullWidth
            label="Número de Pisos"
            value={selectedRow.numeroPisos || ""}
            onChange={(e) => props.setSelectedRow({ ...selectedRow, numeroPisos: e.target.value })}
            type="number"
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
