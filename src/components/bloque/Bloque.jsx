import * as React from 'react';
import MessageSnackBar from '../MessageSnackBar';
import FormBloque from './FormBloque.jsx';
import GridBloque from './GridBloque.jsx';

export default function Bloque() {
  const row = {
    id: null,
    nombre: "",
    descripcion: "",
    sedeId: 0,
    geolocalizacion: {
      type: "Point",
      coordinates: [0, 0],
    },
    numeroPisos: 0,
    estado: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [bloques, setBloques] = React.useState([]);

  // Función para mapear los datos de bloque.json
  const mapBloquesData = (data) => {
    return data.map(item => ({
      id: item.blo_id,
      nombre: item.blo_nombre,
      descripcion: item.blo_descripcion,
      sedeId: item.blo_sede_id,
      geolocalizacion: item.blo_geolocalizacion,
      numeroPisos: item.blo_numero_pisos,
      estado: item.blo_estado,
    }));
  };

  const fetchData = (url, setStateFunction, mapper = null) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (mapper) {
          setStateFunction(mapper(data));
        } else {
          setStateFunction(data);
        }
      })
      .catch(error => console.error(`Error al buscar datos de ${url}`, error));
  };

  React.useEffect(() => {
    fetchData('/bloque.json', setBloques, mapBloquesData);  // Mapeamos los datos
  }, []);

  const addBloque = (newData) => {
    const newBloque = { ...newData, id: Date.now() };
    setBloques((prevData) => [...prevData, newBloque]);
    setMessage({ open: true, severity: "success", text: "Bloque creado con éxito!" });
  };

  const updateBloque = (updatedData) => {
    setBloques((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Bloque actualizado con éxito!" });
  };

  const deleteBloque = (id) => {
    setBloques((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Bloque eliminado con éxito!" });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormBloque
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addBloque={addBloque}
        updateBloque={updateBloque}
        deleteBloque={deleteBloque}
      />
      <GridBloque
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        bloques={bloques}
      />
    </div>
  );
}
