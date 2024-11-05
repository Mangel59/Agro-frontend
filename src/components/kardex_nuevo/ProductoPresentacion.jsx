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


import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

export default function ProductoPresentacion({ value, setValue }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchProductoYPresentacion = async () => {
      try {
        const productosResponse = await axios.get(`${SiteProps.urlbasev1}/productos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const productos = productosResponse.data.data || [];
        console.log("Productos obtenidos:", productos);

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

          // Si no se encuentra un producto, marcarlo como 'Producto no encontrado'
          const nombreProducto = producto ? producto.nombre : 'Producto no encontrado';

          // Log para verificar la coincidencia
          console.log(`Para presentación ${presentacion.id} - ${presentacion.nombre}, producto encontrado:`, producto);

          // Regresa el objeto combinado con nombre del producto y presentación
          return {
            id: presentacion.id, // ID de producto_presentacion
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
