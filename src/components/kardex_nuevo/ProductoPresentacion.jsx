// import React, { useEffect, useState } from 'react';
// import { TextField, Autocomplete } from '@mui/material';
// import axios from 'axios';
// import { SiteProps } from '../dashboard/SiteProps';

// export default function ProductoPresentacion({ value, setValue }) {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     const fetchProductoYPresentacion = async () => {
//       try {
//         const productosResponse = await axios.get(`${SiteProps.urlbasev1}/productos`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const productos = productosResponse.data.data || [];

//         const presentacionesResponse = await axios.get(`${SiteProps.urlbasev1}/producto-presentaciones`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const presentaciones = presentacionesResponse.data.data || [];

//         const combinedOptions = productos.map(producto => {
//           const relatedPresentaciones = presentaciones.filter(p => p.productoId === producto.id);
//           return relatedPresentaciones.map(presentacion => ({
//             id: presentacion.id, 
//             nombreProducto: producto.nombre,
//             nombrePresentacion: presentacion.nombre,
//             productoID: producto.id // Agrega productoID si es necesario
//           }));
//         }).flat();

//         setOptions(combinedOptions);
//       } catch (error) {
//         console.error('Error fetching Producto y Presentación:', error);
//       }
//     };

//     fetchProductoYPresentacion();
//   }, []);

//   return (
//     <Autocomplete
//       value={value}
//       onChange={(event, newValue) => {
//         if (newValue && newValue.id) {
//           setValue(newValue);
//         } else {
//           console.error("ProductoPresentacion es null o no tiene ID.");
//           alert("Selecciona un Producto Presentación válido.");
//         }
//       }}
//       options={options}
//       getOptionLabel={(option) => `${option.id} - ${option.nombreProducto} - ${option.nombrePresentacion}`}
//       isOptionEqualToValue={(option, value) => option.id === value.id}
//       renderInput={(params) => <TextField {...params} label="Producto Presentación" />}
//     />
//   );
// }

/**
 * ProductoPresentacion - Componente de selección de Producto Presentación con Autocompletado.
 * 
 * Este componente permite seleccionar una combinación de producto y presentación a través de un campo autocompletado.
 * La información es obtenida de dos endpoints que proporcionan los productos y sus presentaciones, los cuales son
 * combinados para formar las opciones de selección.
 * 
 * @module ProductoPresentacion
 */

import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

/**
 * Componente de autocompletado para seleccionar un producto con su presentación correspondiente.
 * 
 * @function ProductoPresentacion
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.value - Valor seleccionado actualmente en el autocompletado.
 * @param {Function} props.setValue - Función para actualizar el valor seleccionado.
 * @returns {JSX.Element} Componente de autocompletado.
 */
export default function ProductoPresentacion({ value, setValue }) {
  const [options, setOptions] = useState([]); // Opciones de producto y presentación combinadas

  // Hook para obtener productos y presentaciones al montar el componente
  useEffect(() => {
    /**
     * Función asincrónica que obtiene productos y presentaciones desde el backend,
     * y los combina para formar las opciones del autocompletado.
     * 
     * @async
     * @function fetchProductoYPresentacion
     */
    const fetchProductoYPresentacion = async () => {
      try {
        // Solicita productos al backend
        const productosResponse = await axios.get(`${SiteProps.urlbasev1}/productos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const productos = productosResponse.data.data || [];
        console.log("Productos obtenidos:", productos);

        // Solicita presentaciones al backend
        const presentacionesResponse = await axios.get(`${SiteProps.urlbasev1}/producto-presentaciones`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const presentaciones = presentacionesResponse.data.data || [];
        console.log("Presentaciones obtenidas:", presentaciones);

        // Combina los productos con sus presentaciones correspondientes
        const combinedOptions = presentaciones.map((presentacion) => {
          // Encuentra el producto correspondiente a esta presentación
          const producto = productos.find(p => p.id === presentacion.productoId);

          const nombreProducto = producto ? producto.nombre : 'Producto no encontrado';

          // Log para verificar la coincidencia
          console.log(`Para presentación ${presentacion.id} - ${presentacion.nombre}, producto encontrado:`, producto);

          return {
            id: presentacion.id,
            nombreProducto: nombreProducto,
            nombrePresentacion: presentacion.nombre,
            productoPresentacionID: presentacion.id
          };
        });

        setOptions(combinedOptions);
        console.log("Opciones combinadas:", combinedOptions); // Verifica la combinación final
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
          console.error("ProductoPresentacion es null o no tiene ID.");
          alert("Selecciona un Producto Presentación válido.");
        }
      }}
      options={options}
      getOptionLabel={(option) => `${option.id} - ${option.nombreProducto} - ${option.nombrePresentacion}`}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} label="Producto Presentación" />}
    />
  );
}
