/**
 * @file Municipio.jsx
 * @module Municipio
 * @description Componente principal para la gestión de municipios.
 *
 * Este componente maneja la carga de países y departamentos, filtrado jerárquico,
 * renderizado de la tabla y el formulario de municipios, y operaciones CRUD.
 */

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

/**
 * Componente principal para la gestión de municipios.
 *
 * @returns {JSX.Element} El módulo de gestión de municipios
 */
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

  /**
   * Cargar todos los países al iniciar.
   */
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

  /**
   * Cargar departamentos filtrados por país seleccionado.
   */
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

  /**
   * Cargar municipios según el departamento seleccionado.
   */
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

  /**
   * Eliminar municipio seleccionado tras confirmación.
   */
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

      {/* Selector de país */}
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

      {/* Selector de departamento */}
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

      {/* Botones de acción */}
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

      {/* Tabla de municipios */}
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

      {/* Mensajes Snackbar */}
      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
