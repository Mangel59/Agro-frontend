
/**
 * ProductoPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
// import React, { useEffect, useState } from 'react';
// import { TextField, Autocomplete } from '@mui/material';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

/**
 * Componente ProductoPresentacion.
 * @module ProductoPresentacion.jsx
 * @component
 * @returns {JSX.Element}
 */
import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function ProductoPresentacion({ value, setValue }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchProductoYPresentacion = async () => {
      try {
        const productosResponse = await axios.get(`${SiteProps.urlbasev1}/producto`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const productos = productosResponse.data.data || [];

        const presentacionesResponse = await axios.get(`${SiteProps.urlbasev1}/producto-presentacion`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const presentaciones = presentacionesResponse.data.data || [];

        const combinedOptions = presentaciones.map((presentacion) => {
          const producto = productos.find((p) => p.id === presentacion.productoId);
          return {
            id: presentacion.id,
            nombreProducto: producto?.nombre || 'Producto no encontrado',
            nombrePresentacion: presentacion.nombre,
            productoPresentacionID: presentacion.id,
          };
        });

        setOptions(combinedOptions);
      } catch (error) {
        console.error('Error fetching Producto y Presentación:', error);
      }
    };

    fetchProductoYPresentacion();
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (newValue && newValue.id) {
          setValue(newValue);
        } else {
          alert("Selecciona un Producto Presentación válido.");
        }
      }}
      options={options}
      getOptionLabel={(option) => `${option.nombreProducto} - ${option.nombrePresentacion}`}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} label="Producto Presentación" />}
    />
  );
}
