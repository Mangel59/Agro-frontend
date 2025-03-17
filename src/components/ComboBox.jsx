
/**
 * ComboBox componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

/**
 * Componente ComboBox.
 * @module ComboBox.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function ComboBox({ onAlmacenChange, onProduccionChange, onMovimientoChange, onDescripcionChange, onEstadoChange }) {
  const [almacenes, setAlmacenes] = useState([]);
  const [producciones, setProducciones] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [selectedAlmacen, setSelectedAlmacen] = useState(null);
  const [selectedProduccion, setSelectedProduccion] = useState(null);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');

  // Obtener datos desde kardex.json usando axios
  useEffect(() => {
    axios.get('/kardex.json')
      .then(response => {
        const kardexData = response.data;

        // Extraer almacenes únicos
        const almacenesUnicos = [...new Set(kardexData.map(item => item.kar_almacen_id))];
        setAlmacenes(almacenesUnicos);

        // Extraer producciones únicas
        const produccionesUnicas = [...new Set(kardexData.map(item => item.kar_produccion_id))];
        setProducciones(produccionesUnicas);

        // Extraer movimientos únicos
        const movimientosUnicos = [...new Set(kardexData.map(item => item.kar_tipo_movimiento_id))];
        setMovimientos(movimientosUnicos);
      })
      .catch(error => console.error('Error al cargar kardex.json:', error));
  }, []);

  // Notificar cambios individuales
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
      {/* Primera fila: Almacén, Producción, Movimiento */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Autocomplete
          disablePortal
          id="combo-box-almacen"
          options={almacenes}
          getOptionLabel={(option) => `Almacén ${option}`}  // Muestra el ID del almacén
          sx={{ width: 300 }}
          onChange={(event, newValue) => setSelectedAlmacen(newValue)}
          renderInput={(params) => <TextField {...params} label="Almacén" />}
        />

        <Autocomplete
          disablePortal
          id="combo-box-produccion"
          options={producciones}
          getOptionLabel={(option) =>` Producción ${option}`}  // Muestra el ID de la producción
          sx={{ width: 300 }}
          onChange={(event, newValue) => setSelectedProduccion(newValue)}
          renderInput={(params) => <TextField {...params} label="Producción" />}
          disabled={!selectedAlmacen}  // Se habilita solo si hay un almacén seleccionado
        />

        <Autocomplete
          disablePortal
          id="combo-box-tipo-movimiento"
          options={movimientos}
          getOptionLabel={(option) => `Movimiento ${option}`}  // Muestra el ID del movimiento
          sx={{ width: 300 }}
          onChange={(event, newValue) => setSelectedMovimiento(newValue)}
          renderInput={(params) => <TextField {...params} label="Tipo Movimiento" />}
          disabled={!selectedProduccion}  // Se habilita solo si hay una producción seleccionada
        />
      </Box>

      {/* Segunda fila: Descripción y Estado */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Campo de Descripción */}
        <TextField
          id="descripcion"
          label="Descripción"
          variant="outlined"
          sx={{ width: 300 }}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {/* ComboBox para seleccionar Estado */}
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