// import * as React from "react";
// import axios from "axios";
// import MessageSnackBar from "../MessageSnackBar";
// import FormAlmacen from "./FormAlmacen";
// import GridAlmacen from "./GridAlmacen";
// import { SiteProps } from "../dashboard/SiteProps";

// export default function Almacen(props) {
//   const row = {
//     id: 0,
//     nombre: "",
//     descripcion: "",
//     sedeId: 0,
//     geolocalizacion: {
//       type: "Point",
//       coordinates: []
//     },
//     estado: 0,
//   };

//   const [selectedRow, setSelectedRow] = React.useState(row);
//   const messageData = {
//     open: false,
//     severity: "success",
//     text: "",
//   };

//   const [message, setMessage] = React.useState(messageData);
//   const [almacenes, setAlmacenes] = React.useState([]);

//   // Función para recargar los datos
//   const reloadData = () => {
//     axios
//       .get(`${SiteProps.urlbasev1}/almacen`)
//       .then((response) => {
//         const almacenData = response.data.map((item) => ({
//           ...item,
//           id: item.id,
//         }));
//         setAlmacenes(almacenData);
//       })
//       .catch((error) => {
//         console.error("Error al buscar almacenes!", error);
//       });
//   };

//   React.useEffect(() => {
//     reloadData();  // Cargar los datos iniciales
//   }, []);

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <MessageSnackBar message={message} setMessage={setMessage} />
//       <FormAlmacen
//         setMessage={setMessage}
//         selectedRow={selectedRow}
//         setSelectedRow={setSelectedRow}
//         reloadData={reloadData}
//         almacenes={almacenes}
//       />
//       <GridAlmacen
//         selectedRow={selectedRow}
//         setSelectedRow={setSelectedRow}
//         almacenes={almacenes}
//       />
//     </div>
//   );
// }

import * as React from 'react';
import MessageSnackBar from '../MessageSnackBar';
import FormAlmacen from './FormAlmacen';
import GridAlmacen from './GridAlmacen';

export default function Almacen() {
  const row = {
    alm_id: null,  // Usamos null en lugar de 0 para evitar conflicto con ids
    alm_nombre: "",
    alm_descripcion: "",
    alm_sede_id: 0,
    alm_geolocalizacion: {
      type: "Point",
      coordinates: [0, 0],
    },
    alm_coordenadas: "",
    alm_estado: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [almacenes, setAlmacenes] = React.useState([]);
  const [sede, setSede] = React.useState([]);
  const [bloque, setBloque] = React.useState([]);
  const [espacio, setEspacio] = React.useState([]);
  const [estado, setEstado] = React.useState([]);

  const fetchData = (url, setStateFunction) => {
    fetch(url)
      .then(response => response.json())
      .then(data => setStateFunction(data))
      .catch(error => console.error(`Error al buscar datos de ${url}`, error));
  };

  React.useEffect(() => {
    fetchData('/almacen.json', setAlmacenes);  // Cargar almacenes
    fetchData('/sede.json', setSede);
    fetchData('/bloque.json', setBloque);
    fetchData('/espacio.json', setEspacio);
    fetchData('/estado.json', setEstado);
  }, []);

  // Función para agregar un nuevo almacén
  const addAlmacen = (newData) => {
    const newAlmacen = { ...newData, alm_id: Date.now() };  // Genera un ID único usando Date.now()
    setAlmacenes((prevData) => [...prevData, newAlmacen]);
    setMessage({ open: true, severity: "success", text: "Almacén creado con éxito!" });
  };

  // Función para actualizar un almacén
  const updateAlmacen = (updatedData) => {
    setAlmacenes((prevData) =>
      prevData.map((item) => (item.alm_id === updatedData.alm_id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Almacén actualizado con éxito!" });
  };

  // Función para eliminar un almacén
  const deleteAlmacen = (alm_id) => {
    setAlmacenes((prevData) => prevData.filter((item) => item.alm_id !== alm_id));
    setMessage({ open: true, severity: "success", text: "Almacén eliminado con éxito!" });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormAlmacen
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        sede={sede}
        bloque={bloque}
        espacio={espacio}
        estado={estado}
        addAlmacen={addAlmacen}
        updateAlmacen={updateAlmacen}
        deleteAlmacen={deleteAlmacen}
      />
      <GridAlmacen
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        almacenes={almacenes}
      />
    </div>
  );
}
