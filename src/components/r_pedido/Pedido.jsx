import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPedido from "./FormPedido";
import GridPedido from "./GridPedido.jsx";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";

export default function Pedido() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [selectedAlmacen, setSelectedAlmacen] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Cargas encadenadas
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data));
  }, []);

  useEffect(() => {
    resetAll(["departamentos", "municipios", "sedes", "bloques", "espacios", "almacenes", "pedidos"]);
    if (selectedPais)
      axios.get("/v1/departamento", headers).then(res => {
        setDepartamentos(res.data.filter(dep => dep.paisId === parseInt(selectedPais)));
      });
  }, [selectedPais]);

  useEffect(() => {
    resetAll(["municipios", "sedes", "bloques", "espacios", "almacenes", "pedidos"]);
    if (selectedDepto)
      axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => setMunicipios(res.data));
  }, [selectedDepto]);

  useEffect(() => {
    resetAll(["sedes", "bloques", "espacios", "almacenes", "pedidos"]);
    if (selectedMunicipio)
      axios.get("/v1/sede", headers).then(res => {
        setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
      });
  }, [selectedMunicipio]);

  useEffect(() => {
    resetAll(["bloques", "espacios", "almacenes", "pedidos"]);
    if (selectedSede)
      axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers).then(res => setBloques(res.data));
  }, [selectedSede]);

  useEffect(() => {
    resetAll(["espacios", "almacenes", "pedidos"]);
    if (selectedBloque)
      axios.get(`/v1/espacio?bloqueId=${selectedBloque}`, headers).then(res => setEspacios(res.data));
  }, [selectedBloque]);

  useEffect(() => {
    resetAll(["almacenes", "pedidos"]);
    if (selectedEspacio)
      axios.get(`/v1/almacen?espacioId=${selectedEspacio}`, headers).then(res => setAlmacenes(res.data));
  }, [selectedEspacio]);

  const reloadData = () => {
    if (!selectedAlmacen) return setPedidos([]);
    axios.get(`/v1/pedido?almacenId=${selectedAlmacen}`, headers).then(res => {
      setPedidos(res.data);
    });
  };

  useEffect(() => {
    reloadData();
  }, [selectedAlmacen]);

  const resetAll = (keys) => {
    if (keys.includes("departamentos")) setDepartamentos([]);
    if (keys.includes("municipios")) setMunicipios([]);
    if (keys.includes("sedes")) setSedes([]);
    if (keys.includes("bloques")) setBloques([]);
    if (keys.includes("espacios")) setEspacios([]);
    if (keys.includes("almacenes")) setAlmacenes([]);
    if (keys.includes("pedidos")) setPedidos([]);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (window.confirm(`¿Eliminar el pedido "${selectedRow.nombre}"?`)) {
      try {
        await axios.delete(`/v1/pedido/${selectedRow.id}`, headers);
        setMessage({ open: true, severity: "success", text: "Pedido eliminado correctamente." });
        setSelectedRow(null);
        reloadData();
      } catch {
        setMessage({ open: true, severity: "error", text: "Error al eliminar pedido." });
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Gestión de Pedidos</Typography>

      {[["País", selectedPais, setSelectedPais, paises],
        ["Departamento", selectedDepto, setSelectedDepto, departamentos],
        ["Municipio", selectedMunicipio, setSelectedMunicipio, municipios],
        ["Sede", selectedSede, setSelectedSede, sedes],
        ["Bloque", selectedBloque, setSelectedBloque, bloques],
        ["Espacio", selectedEspacio, setSelectedEspacio, espacios],
        ["Almacén", selectedAlmacen, setSelectedAlmacen, almacenes]
      ].map(([label, val, setter, list]) => (
        <FormControl fullWidth sx={{ mb: 2 }} key={label} disabled={!list.length && label !== "País"}>
          <InputLabel>{label}</InputLabel>
          <Select value={val} onChange={e => setter(e.target.value)} label={label}>
            {list.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => { setFormMode("create"); setFormOpen(true); setSelectedRow(null); }} disabled={!selectedAlmacen}>+ Agregar Pedido</Button>
        <Button variant="outlined" onClick={() => { setFormMode("edit"); setFormOpen(true); }} disabled={!selectedRow}>Editar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete} disabled={!selectedRow}>Eliminar</Button>
      </Box>

      <GridPedido pedidos={pedidos} setSelectedRow={setSelectedRow} />

      <FormPedido
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        almacenId={selectedAlmacen}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
