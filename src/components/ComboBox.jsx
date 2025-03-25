/**
 * @file ComboBox.jsx - Componente de selección para filtros de Kardex.
 * @module ComboBox
 * @exports ComboBox
 */

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

/**
 * Componente ComboBox.
 *
 * Permite seleccionar un almacén, producción, tipo de movimiento, descripción y estado,
 * y notifica estos cambios mediante funciones callback.
 *
 * @param {Object} props - Props del componente.
 * @param {Function} props.onAlmacenChange - Callback para cambiar almacén.
 * @param {Function} props.onProduccionChange - Callback para cambiar producción.
 * @param {Function} props.onMovimientoChange - Callback para cambiar movimiento.
 * @param {Function} props.onDescripcionChange - Callback para cambiar descripción.
 * @param {Function} props.onEstadoChange - Callback para cambiar estado.
 * @returns {JSX.Element} Vista del componente.
 */
function ComboBox({ onAlmacenChange, onProduccionChange, onMovimientoChange, onDescripcionChange, onEstadoChange }) {
  const [almacenes, setAlmacenes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [selectedAlmacen, setSelectedAlmacen] = useState(null);
  const [selectedProduccion, setSelectedProduccion] = useState(null);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    axios.get('/kardex.json')
      .then(response => {
        const kardexData = response.data;

        const almacenesUnicos = [...new Set(kardexData.map(item => item.kar_almacen_id))];
        setAlmacenes(almacenesUnicos);

        const produccionesUnicas = [...new Set(kardexData.map(item => item.kar_produccion_id))];
        setProducciones(produccionesUnicas);

        const movimientosUnicos = [...new Set(kardexData.map(item => item.kar_tipo_movimiento_id))];
        setMovimientos(movimientosUnicos);
      })
      .catch(error => console.error('Error al cargar kardex.json:', error));
  }, []);

  useEffect(() => {
    if (onAlmacenChange) onAlmacenChange(selectedAlmacen);
  }, [selectedAlmacen, onAlmacenChange]);

  useEffect(() => {
    if (onProduccionChange) onProduccionChange(selectedProduccion);
  }, [selectedProduccion, onProduccionChange]);

  useEffect(() => {
    if (onMovimientoChange) onMovimientoChange(selectedMovimiento);
  }, [selectedMovimiento, onMovimientoChange]);

  useEffect(() => {
    if (onDescripcionChange) onDescripcionChange(descripcion);
  }, [descripcion, onDescripcionChange]);

  useEffect(() => {
    if (onEstadoChange) onEstadoChange(estado);
  }, [estado, onEstadoChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, pt: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Autocomplete
          disablePortal
          id="combo-box-almacen"
          options={almacenes}
          getOptionLabel={(option) => `Almacén ${option}`}
          sx={{ width: 300 }}
          onChange={(event, newValue) => setSelectedAlmacen(newValue)}
          renderInput={(params) => <TextField {...params} label="Almacén" />}
        />

        <Autocomplete
          disablePortal
          id="combo-box-produccion"
          options={producciones}
          getOptionLabel={(option) => `Producción ${option}`}
          sx={{ width: 300 }}
          onChange={(event, newValue) => setSelectedProduccion(newValue)}
          renderInput={(params) => <TextField {...params} label="Producción" />}
          disabled={!selectedAlmacen}
        />

        <Autocomplete
          disablePortal
          id="combo-box-tipo-movimiento"
          options={movimientos}
          getOptionLabel={(option) => `Movimiento ${option}`}
          sx={{ width: 300 }}
          onChange={(event, newValue) => setSelectedMovimiento(newValue)}
          renderInput={(params) => <TextField {...params} label="Tipo Movimiento" />}
          disabled={!selectedProduccion}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          id="descripcion"
          label="Descripción"
          variant="outlined"
          sx={{ width: 300 }}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <TextField
          id="estado"
          select
          label="Estado"
          sx={{ width: 300 }}
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <MenuItem value={1}>Activo</MenuItem>
          <MenuItem value={0}>Inactivo</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}

export default ComboBox;
