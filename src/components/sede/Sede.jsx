import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

export default function Sede() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [tiposSede, setTiposSede] = useState([]);
  const [sedes, setSedes] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Soporta array plano o { content, page }
  const unwrapPage = (data) => (Array.isArray(data) ? data : data?.content ?? []);

  useEffect(() => {
    axios
      .get("/v1/pais", { ...headers, params: { page: 0, size: 1000 } })
      .then((res) => setPaises(unwrapPage(res.data)))
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al cargar países." }));

    axios
      .get("/v1/tipo_sede", { ...headers, params: { page: 0, size: 1000 } })
      .then((res) => setTiposSede(unwrapPage(res.data)))
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al cargar tipos de sede." }));

    axios
      .get("/v1/grupo", { ...headers, params: { page: 0, size: 1000 } })
      .then((res) => setGrupos(unwrapPage(res.data)))
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al cargar grupos." }));
  }, []);

  // Departamentos por país
  useEffect(() => {
    if (!selectedPais) {
      setDepartamentos([]);
      setSelectedDepto("");
      setMunicipios([]);
      setSelectedMunicipio("");
      return;
    }

    axios
      .get("/v1/departamento", { ...headers, params: { page: 0, size: 1000 } })
      .then((res) => {
        const lista = unwrapPage(res.data).filter(
          (dep) => Number(dep.paisId) === Number(selectedPais)
        );
        setDepartamentos(lista);
        setSelectedDepto("");
        setMunicipios([]);
        setSelectedMunicipio("");
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar departamentos." })
      );
  }, [selectedPais]);

  // Municipios por departamento
  useEffect(() => {
    if (!selectedDepto) {
      setMunicipios([]);
      setSelectedMunicipio("");
      return;
    }

    axios
      .get("/v1/municipio", {
        ...headers,
        params: { departamentoId: Number(selectedDepto), page: 0, size: 1000 },
      })
      .then((res) => setMunicipios(unwrapPage(res.data)))
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar municipios." })
      );
  }, [selectedDepto]);

  // Sedes por municipio
  const reloadData = () => {
    if (!selectedMunicipio) {
      setSedes([]);
      return;
    }
    axios
      .get("/v1/sede", {
        ...headers,
        params: { municipioId: Number(selectedMunicipio), page: 0, size: 1000 },
      })
      .then((res) => {
        const lista = unwrapPage(res.data).filter(
          (s) => Number(s.municipioId) === Number(selectedMunicipio)
        );
        setSedes(lista);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar sedes." })
      );
  };
  useEffect(() => { reloadData(); }, [selectedMunicipio]);

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar la sede "${selectedRow.nombre}"?`)) return;

    try {
      await axios.delete(`/v1/sede/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Sede eliminada correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar sede." });
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Sede</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>País</InputLabel>
        <Select
          value={selectedPais}
          onChange={(e) => setSelectedPais(Number(e.target.value))}
          label="País"
        >
          {paises.map((pais) => (
            <MenuItem key={pais.id} value={pais.id}>{pais.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPais}>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={selectedDepto}
          onChange={(e) => setSelectedDepto(Number(e.target.value))}
          label="Departamento"
        >
          {departamentos.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedDepto}>
        <InputLabel>Municipio</InputLabel>
        <Select
          value={selectedMunicipio}
          onChange={(e) => setSelectedMunicipio(Number(e.target.value))}
          label="Municipio"
        >
          {municipios.map((mun) => (
            <MenuItem key={mun.id} value={mun.id}>{mun.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }}
          disabled={!selectedMunicipio}
        >
          + Agregar Sede
        </Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>
          Editar
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>
          Eliminar
        </Button>
      </Box>

      <GridSede sedes={sedes} setSelectedRow={setSelectedRow} />

      <FormSede
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        municipioId={selectedMunicipio}
        grupos={grupos}
        tiposSede={tiposSede}
        authHeaders={headers}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
