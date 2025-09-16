/**
 * @file Departamento.jsx
 * @module Departamento
 * @description Componente principal para la gestión de departamentos.
 *
 * Este componente maneja la lógica del módulo de departamentos, incluyendo la carga
 * de países, filtrado por país, y renderizado del formulario y la tabla de departamentos.
 */

import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import GridDepartamento from "./GridDepartamento";
import FormDepartamento from "./FormDepartamento";
import MessageSnackBar from "../MessageSnackBar";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Button,
} from "@mui/material";

/**
 * @typedef {Object} DepartamentoRow
 * @property {number} id - ID del departamento
 * @property {string} nombre - Nombre del departamento
 * @property {number} paisId - ID del país asociado
 * @property {string} paisNombre - Nombre del país (solo para visualización)
 * @property {number} estadoId - Estado del departamento
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad ("success", "error", etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para la gestión de departamentos.
 *
 * @returns {JSX.Element} El módulo de gestión de departamentos
 */
export default function Departamento() {
  const [departamentos, setDepartamentos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [selectedPaisId, setSelectedPaisId] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
    
  });

  const unwrapPage = (data) => (Array.isArray(data) ? data : data?.content ?? []);
  /**
   * Carga la lista de países desde la API al iniciar el componente.
   */
  useEffect(() => {
    axios
      .get("/v1/pais")
      .then((res) => setPaises(res.data))
      .catch(() =>
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar países",
        })
      );
  }, []);

  /**
   * Carga y filtra departamentos según el país seleccionado.
   */
const reloadData = () => {
  if (!selectedPaisId) return;

  axios
    .get("/v1/departamento", {
      // opcional: si tu API permite paginar por params
      params: { page: 0, size: 1000 } // o el tamaño que quieras traer
    })
    .then((res) => {
      const lista = unwrapPage(res.data)
        .filter((d) => d.paisId === selectedPaisId)
        .map((d) => {
          const pais = paises.find((p) => p.id === d.paisId);
          return {
            id: d.id,
            name: d.nombre,
            paisNombre: pais?.nombre || d.paisId,
            ...d,
          };
        });

      setDepartamentos(lista);
      setSelectedRow(null);
    })
    .catch(() =>
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar departamentos",
      })
    );
};


  /**
   * Se ejecuta cada vez que cambia el país seleccionado o la lista de países.
   */
  useEffect(() => {
    reloadData();
  }, [selectedPaisId, paises]);

  /**
   * Maneja la eliminación de un departamento seleccionado.
   */
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar el departamento "${selectedRow.name}"?`)) {
      try {
        await axios.delete(`/v1/departamento/${selectedRow.id}`);
        setMessage({
          open: true,
          severity: "success",
          text: "Departamento eliminado correctamente.",
        });
        reloadData();
      } catch (err) {
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar departamento.",
        });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Departamento
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="pais-select-label">País</InputLabel>
        <Select
          labelId="pais-select-label"
          value={selectedPaisId}
          label="País"
          onChange={(e) => setSelectedPaisId(Number(e.target.value))}
        >
          {paises.map((pais) => (
            <MenuItem key={pais.id} value={pais.id}>
              {pais.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setFormMode("create");
            setFormOpen(true);
            setSelectedRow(null);
          }}
          disabled={!selectedPaisId}
        >
          + Agregar Departamento
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

      <GridDepartamento
        departamentos={departamentos}
        setSelectedRow={setSelectedRow}
      />

      <FormDepartamento
        open={formOpen}
        setOpen={setFormOpen}
        selectedPais={selectedPaisId}
        selectedRow={selectedRow}
        formMode={formMode}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
