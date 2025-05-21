import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormMunicipio from "./FormMunicipio";
import GridMunicipio from "./GridMunicipio";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export default function Municipio() {
  const [paises, setPaises] = React.useState([]);
  const [departamentos, setDepartamentos] = React.useState([]);
  const [municipios, setMunicipios] = React.useState([]);
  const [selectedPais, setSelectedPais] = React.useState("");
  const [selectedDepto, setSelectedDepto] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState("create");
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  // ✅ Cargar países
  React.useEffect(() => {
    axios
      .get("/v1/pais")
      .then((res) => setPaises(res.data))
      .catch(() =>
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar países.",
        })
      );
  }, []);

  // ✅ Cargar departamentos por país
  React.useEffect(() => {
    if (!selectedPais) {
      setDepartamentos([]);
      setSelectedDepto("");
      return;
    }

    axios
      .get("/v1/departamento")
      .then((res) => {
        const filtrados = res.data.filter(
          (d) => d.paisId === parseInt(selectedPais)
        );
        setDepartamentos(filtrados);
      })
      .catch(() =>
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar departamentos.",
        })
      );
  }, [selectedPais]);

  // ✅ Cargar municipios por departamento
  const reloadData = () => {
    if (!selectedDepto) {
      setMunicipios([]);
      return;
    }

    axios
      .get(`/v1/municipio?departamentoId=${selectedDepto}`)
      .then((res) => setMunicipios(res.data))
      .catch(() =>
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar municipios.",
        })
      );
  };

  React.useEffect(() => {
    reloadData();
  }, [selectedDepto]);

  // ✅ Eliminar municipio
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar el municipio "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/municipio/${selectedRow.id}`);
        setMessage({
          open: true,
          severity: "success",
          text: "Municipio eliminado correctamente.",
        });
        setSelectedRow(null);
        reloadData();
      } catch (err) {
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar municipio.",
        });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Municipio
      </Typography>

      {/* Select País */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>País</InputLabel>
        <Select
          value={selectedPais}
          label="País"
          onChange={(e) => setSelectedPais(e.target.value)}
        >
          {paises.map((pais) => (
            <MenuItem key={pais.id} value={pais.id}>
              {pais.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select Departamento */}
      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPais}>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={selectedDepto}
          label="Departamento"
          onChange={(e) => setSelectedDepto(e.target.value)}
        >
          {departamentos.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
              {dep.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botones externos */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setFormMode("create");
            setFormOpen(true);
            setSelectedRow(null);
          }}
          disabled={!selectedDepto}
        >
          + Agregar Municipio
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
          disabled={!selectedRow}
        >
          Editar
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={!selectedRow}
        >
          Eliminar
        </Button>
      </Box>

      {/* Tabla */}
      <GridMunicipio
        municipios={municipios}
        setSelectedRow={setSelectedRow}
      />

      {/* Formulario modal */}
      <FormMunicipio
        open={formOpen}
        setOpen={setFormOpen}
        selectedDepartamento={selectedDepto}
        selectedRow={selectedRow}
        formMode={formMode}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
