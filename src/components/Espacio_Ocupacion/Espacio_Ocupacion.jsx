import * as React from 'react';
import MessageSnackBar from '../MessageSnackBar';
import FormEspacioOcuOcupacion from './FromEspacioOcupacion';
import GridEspacioOcupacion from '../Espacio_Ocupacion/GridEspacioOcupacion';

export default function EspacioOcupacion() {
  const row = {
    id: null,
    espacio: "",
    espacioacti: "",
    fechainicio: "",
    fechafin: 0,
    estado: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: ""
  });
  const [espacioocu, setEspacioOcu] = React.useState([]);

  // Mapea los datos del archivo JSON a los campos necesarios
  const mapEspacioOcuData = (data) => {
    return data.map(item => ({
      id: item.eso_id,
      espacio: item.eso_espacio_id,
      espacioacti: item.eso_actividad_ocupacion_id,
      fechainicio: item.eso_fecha_inicio,
      fechafin: item.eso_fecha_fin,
      estado: item.eso_estado,
    }));
  };
  
  const fetchData = (url, setStateFunction, mapper = null) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al cargar datos de ${url}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (mapper) {
          setStateFunction(mapper(data));
        } else {
          setStateFunction(data);
        }
      })
      .catch(error => console.error(error.message));
  };

  React.useEffect(() => {
    fetchData('/espacio_ocupacion.json', setEspacioOcu, mapEspacioOcuData);
  }, []);
  
  React.useEffect(() => {
    console.log("Datos cargados:", espacioocu);
  }, [espacioocu]);

  const addEspacio = (newData) => {
    const newEspacio = { ...newData, id: Date.now() }; // Genera un ID único usando Date.now()
    setEspacioOcu((prevData) => [...prevData, newEspacio]);
    setMessage({ open: true, severity: "success", text: "Espacio creado con éxito!" });
  };

  const updateEspacio = (updatedData) => {
    setEspacioOcu((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setMessage({ open: true, severity: "success", text: "Espacio actualizado con éxito!" });
  };

  const deleteEspacio = (id) => {
    setEspacioOcu((prevData) => prevData.filter((item) => item.id !== id));
    setMessage({ open: true, severity: "success", text: "Espacio eliminado con éxito!" });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormEspacioOcuOcupacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addEspacioOcu={addEspacio}
        updateEspacioOcu={updateEspacio}
        deleteEspacioOcu={deleteEspacio}
      />
      <GridEspacioOcupacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        espacioocu={espacioocu} // Asegúrate de que este estado tenga los datos cargados
        />
    </div>
  );
}
