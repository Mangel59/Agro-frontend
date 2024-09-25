import * as React from 'react';
import MessageSnackBar from '../MessageSnackBar';
import FormEspacio from './FormEspacio';
import GridEspacio from './GridEspacio';

export default function Espacio() {
  const row = {
    id: null,  // Usamos null en lugar de 0 para evitar conflicto con ids
    nombre: "",
    descripcion: "",
    sedeId: 0,
    geolocalizacion: {
      type: "Point",
      coordinates: [0, 0],
    },
    estado: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [espacios, setEspacios] = React.useState([]);

  // Función para mapear los datos de espacio.json
  const mapEspaciosData = (data) => {
    return data.map(item => ({
      id: item.esp_id,
      nombre: item.esp_nombre,
      descripcion: item.esp_descripcion,
      sedeId: item.esp_bloque_id,  // Asumiendo que el bloque es equivalente a la sede
      geolocalizacion: item.esp_geolocalizacion,
      estado: item.esp_estado,
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
    fetchData('/espacio.json', setEspacios, mapEspaciosData);  // Mapeamos los datos
  }, []);

  const addEspacio = (newData) => {
    const newEspacio = { ...newData, id: Date.now() };  // Genera un ID único usando Date.now()
    setEspacios((prevData) => [...prevData, newEspacio]);
    setMessage({ open: true, severity: "success", text: "Espacio creado con éxito!" });
  };

  const updateEspacio = (updatedData) => {
    setEspacios((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Espacio actualizado con éxito!" });
  };

  const deleteEspacio = (id) => {
    setEspacios((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Espacio eliminado con éxito!" });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormEspacio
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addEspacio={addEspacio}
        updateEspacio={updateEspacio}
        deleteEspacio={deleteEspacio}
      />
      <GridEspacio
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        espacios={espacios}  
      />
    </div>
  );
}
