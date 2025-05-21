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

export default function Departamento() {
  const [departamentos, setDepartamentos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [selectedPaisId, setSelectedPaisId] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" o "edit"
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });

  // ✅ Cargar países
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

  // ✅ Cargar departamentos por país
  const reloadData = () => {
    if (!selectedPaisId) return;

    axios
      .get("/v1/departamento")
      .then((res) => {
        const filtrados = res.data
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

        setDepartamentos(filtrados);
        setSelectedRow(null); // limpia selección
      })
      .catch(() =>
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar departamentos",
        })
      );
  };

  useEffect(() => {
    reloadData();
  }, [selectedPaisId, paises]);

  // ✅ Eliminar departamento
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
