import * as React from 'react';
import MessageSnackBar from '../MessageSnackBar';
import FormSede from './FormSede';
import GridSede from './GridSede';

export default function Sede() {
  const row = {
    id: null,
    nombre: "",
    descripcion: "",
    municipioId: 0,
    geolocalizacion: {
      type: "Point",
      coordinates: [0, 0],
    },
    area: 0,
    comuna: "",
    estado: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [sedes, setSedes] = React.useState([]);

  // Función para mapear los datos de Sede.json
  const mapSedesData = (data) => {
    return data.map(item => ({
      id: item.sed_id,
      nombre: item.sed_nombre,
      descripcion: item.sed_descripcion,
      municipioId: item.sed_municipio_id,
      geolocalizacion: item.sed_geolocalizacion,
      area: item.sed_area,
      comuna: item.sed_comuna,
      estado: item.sed_estado,
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
    fetchData('/sede.json', setSedes, mapSedesData);
  }, []);

  const addSede = (newData) => {
    const newSede = { ...newData, id: Date.now() };
    setSedes((prevData) => [...prevData, newSede]);
    setMessage({ open: true, severity: "success", text: "Sede creada con éxito!" });
  };

  const updateSede = (updatedData) => {
    setSedes((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Sede actualizada con éxito!" });
  };

  const deleteSede = (id) => {
    setSedes((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Sede eliminada con éxito!" });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormSede
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addSede={addSede}
        updateSede={updateSede}
        deleteSede={deleteSede}
      />
      <GridSede
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        sedes={sedes}
      />
    </div>
  );
}
