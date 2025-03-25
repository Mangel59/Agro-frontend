/**
 * @file OrdenCompra.jsx
 * @module OrdenCompra
 * @description Componente principal para la gestión de órdenes de compra. Permite filtrar por sede y almacén, ver, seleccionar y gestionar órdenes de compra. Se conecta a la API usando Axios para cargar datos y actualizar la UI.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";

/**
 * Componente OrdenCompra.
 *
 * Este componente permite gestionar órdenes de compra por sede y almacén. Se conecta al backend para obtener
 * las sedes, almacenes y órdenes de compra, y muestra un formulario y tabla para gestionarlas.
 *
 * @component
 * @returns {JSX.Element} Componente visual de gestión de órdenes de compra.
 */
export default function OrdenCompra() {
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [sede, setSede] = useState("");
  const [almacenId, setAlmacenId] = useState(null);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [selectedOrdenCompra, setSelectedOrdenCompra] = useState(null);

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

  const handleSedeChange = async (e) => {
    const sedeId = e.target.value;
    setSede(sedeId);
    setAlmacenId(null);
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
              value={almacenId || ""}
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

      <FormOrdenCompra
        fetchOrdenesCompra={() => handleAlmacenChange({ target: { value: almacenId } })}
        sedes={sedes}
        almacenes={almacenes}
        setSede={setSede}
        setAlmacenId={setAlmacenId}
        selectedOrdenCompra={selectedOrdenCompra}
        setSelectedOrdenCompra={setSelectedOrdenCompra}
      />

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
