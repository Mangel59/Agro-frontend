
/**
 * OrdenCompra componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";

/**
 * Componente OrdenCompra.
 * @module OrdenCompra.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function OrdenCompra() {
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [sede, setSede] = useState("");
  const [almacenId, setAlmacenId] = useState(null);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [selectedOrdenCompra, setSelectedOrdenCompra] = useState(null);

  // Cargar sedes al iniciar
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  // Cargar almacenes según la sede seleccionada
  const handleSedeChange = async (e) => {
    const sedeId = e.target.value;
    setSede(sedeId);
    setAlmacenId(null); // Resetear almacén al cambiar sede
    setAlmacenes([]);
    setOrdenesCompra([]);

    if (sedeId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/almacen/minimal/sede/${sedeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlmacenes(response.data || []);
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
      }
    }
  };

  // Cargar órdenes de compra según el almacén seleccionado
  const handleAlmacenChange = async (e) => {
    const almacenId = e.target.value;
    setAlmacenId(almacenId);
    setOrdenesCompra([]);
    setSelectedOrdenCompra(null);

    if (almacenId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/orden_compra/almacen/${almacenId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrdenesCompra(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar órdenes de compra:", error);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Órdenes de Compra
      </Typography>

      {/* Filtros por Sede y Almacén */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Sede</InputLabel>
            <Select value={sede} onChange={handleSedeChange} required>
              <MenuItem value="">
                <em>Seleccione una sede</em>
              </MenuItem>
              {sedes.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Almacén</InputLabel>
            <Select
              value={almacenId}
              onChange={handleAlmacenChange}
              required
              disabled={!almacenes.length}
            >
              <MenuItem value="">
                <em>Seleccione un almacén</em>
              </MenuItem>
              {almacenes.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* CRUD de Órdenes de Compra */}
      <FormOrdenCompra
        fetchOrdenesCompra={() => handleAlmacenChange({ target: { value: almacenId } })}
        sedes={sedes}
        almacenes={almacenes}
        setSede={setSede}
        setAlmacenId={setAlmacenId}
        selectedOrdenCompra={selectedOrdenCompra}
        setSelectedOrdenCompra={setSelectedOrdenCompra}
      />

      {/* Tabla de Órdenes de Compra */}
      <GridOrdenCompra
        ordenesCompra={ordenesCompra}
        onSelectOrdenCompra={(orden) => setSelectedOrdenCompra(orden)}
      />

      {selectedOrdenCompra ? (
        <Typography variant="body1" mt={2}>
          Orden seleccionada: {selectedOrdenCompra.id}
        </Typography>
      ) : (
        <Typography variant="body1" color="textSecondary" mt={2}>
          Selecciona una orden de compra para agregar ítems o generar un reporte.
        </Typography>
      )}
    </Box>
  );
}
