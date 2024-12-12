import * as React from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormProduccion({ reloadProducciones, setMessage, selectedRow, setSelectedRow }) {
  const [open, setOpen] = React.useState(false);
  const [sedes, setSedes] = React.useState([]);
  const [bloques, setBloques] = React.useState([]);
  const [espacios, setEspacios] = React.useState([]);
  const [tiposProduccion, setTiposProduccion] = React.useState([]); // Nueva lista de tipos de producción
  const [selectedSede, setSelectedSede] = React.useState("");
  const [selectedBloque, setSelectedBloque] = React.useState("");
  const [selectedEspacio, setSelectedEspacio] = React.useState("");
  const [selectedTipoProduccion, setSelectedTipoProduccion] = React.useState(""); // Selección de tipo de producción
  const [formData, setFormData] = React.useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFinal: "",
    estado: 1,
  });

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "No se encontró el token de autenticación." });
      return;
    }

    // Cargar sedes
    axios
      .get(`${SiteProps.urlbasev1}/sede/minimal`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setSedes(response.data))
      .catch((error) => {
        console.error("Error al cargar sedes:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar sedes. Verifica tu acceso." });
      });

    // Cargar tipos de producción
    axios
      .get(`${SiteProps.urlbasev1}/tipo_produccion`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTiposProduccion(response.data))
      .catch((error) => {
        console.error("Error al cargar tipos de producción:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar tipos de producción." });
      });
  }, [setMessage]);

  const handleSedeChange = (sedeId) => {
    setSelectedSede(sedeId);
    setSelectedBloque("");
    setSelectedEspacio("");
    const token = localStorage.getItem("token");

    axios
      .get(`${SiteProps.urlbasev1}/bloque/sede/${sedeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBloques(response.data))
      .catch((error) => console.error("Error al cargar bloques:", error));
  };

  const handleBloqueChange = (bloqueId) => {
    setSelectedBloque(bloqueId);
    setSelectedEspacio("");
    const token = localStorage.getItem("token");

    axios
      .get(`${SiteProps.urlbasev1}/espacio/bloque/${bloqueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEspacios(response.data))
      .catch((error) => console.error("Error al cargar espacios:", error));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedEspacio || !selectedTipoProduccion) {
      setMessage({ open: true, severity: "error", text: "Selecciona un espacio y un tipo de producción." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado. Inicia sesión nuevamente." });
      return;
    }

    try {
      const response = await axios.post(
        `${SiteProps.urlbasev1}/producciones`,
        {
          ...formData,
          espacio: selectedEspacio,
          tipoProduccion: selectedTipoProduccion, // Usar la selección de tipoProduccion
        },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      setMessage({ open: true, severity: "success", text: "Producción creada con éxito!" });
      reloadProducciones();
      setOpen(false);
    } catch (error) {
      console.error("Error al crear la producción:", error.response || error);
      setMessage({
        open: true,
        severity: "error",
        text: `Error al crear la producción: ${error.response?.data?.message || "Verifica los datos ingresados."}`,
      });
    }
  };

  // Función para actualizar una fila seleccionada
  const update = () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar",
      });
      return;
    }
    setOpen(true); // Abrir el formulario para edición
  };

  // Función para eliminar una fila seleccionada
  const deleteRow = async () => {
    if (!selectedRow || selectedRow.id === 0) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar",
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${SiteProps.urlbasev1}/producciones/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ open: true, severity: "success", text: "Producción eliminada con éxito!" });
      reloadProducciones();
    } catch (error) {
      console.error("Error al eliminar la producción:", error);
      setMessage({ open: true, severity: "error", text: "Error al eliminar la producción." });
    }
  };

  return (
    <React.Fragment>
      <Button  startIcon={<AddIcon />} variant="outlined" onClick={() => setOpen(true)}>
        Add
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle> Add</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
          <Box sx={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="sede-label">Sede</InputLabel>
                <Select
                  labelId="sede-label"
                  value={selectedSede}
                  onChange={(e) => handleSedeChange(e.target.value)}
                >
                  {sedes.map((sede) => (
                    <MenuItem key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!selectedSede}>
                <InputLabel id="bloque-label">Bloque</InputLabel>
                <Select
                  labelId="bloque-label"
                  value={selectedBloque}
                  onChange={(e) => handleBloqueChange(e.target.value)}
                >
                  {bloques.map((bloque) => (
                    <MenuItem key={bloque.id} value={bloque.id}>
                      {bloque.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
                <InputLabel id="espacio-label">Espacio</InputLabel>
                <Select
                  labelId="espacio-label"
                  value={selectedEspacio}
                  onChange={(e) => setSelectedEspacio(e.target.value)}
                >
                  {espacios.map((espacio) => (
                    <MenuItem key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="tipoProduccion-label">Tipo de Producción</InputLabel>
                <Select
                  labelId="tipoProduccion-label"
                  value={selectedTipoProduccion}
                  onChange={(e) => setSelectedTipoProduccion(e.target.value)}
                >
                  {tiposProduccion.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="nombre"
                name="nombre"
                label="Nombre de Producción"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                id="descripcion"
                name="descripcion"
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                id="fechaInicio"
                name="fechaInicio"
                label="Fecha de Inicio"
                type="datetime-local"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                id="fechaFinal"
                name="fechaFinal"
                label="Fecha Final"
                type="datetime-local"
                value={formData.fechaFinal}
                onChange={(e) => setFormData({ ...formData, fechaFinal: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
