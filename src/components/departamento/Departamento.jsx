import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormDepartamento from "./FormDepartamento";
import GridDepartamento from "./GridDepartamento";
import { SiteProps } from '../dashboard/SiteProps';

/**
 * Componente Departamento que gestiona la lógica y renderizado de departamentos.
 * 
 * @returns {JSX.Element} Componente que contiene el formulario y la cuadrícula de departamentos.
 */
export default function Departamento() {
  // Fila inicial seleccionada
  const row = {
    dep_id: 0,
    dep_nombre: "",
    dep_pais_id: 0,
    dep_codigo: 0,
    dep_acronimo: ""
  };

  // Estado para la fila seleccionada
  const [selectedRow, setSelectedRow] = React.useState(row);

  // Datos iniciales del mensaje
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  // Estado para el mensaje
  const [message, setMessage] = React.useState(messageData);

  // Estado para los departamentos
  const [departamentos, setDepartamentos] = React.useState([]);

  // Estado para los países
  const [pais, setPais] = React.useState([]);

  // Efecto para obtener los departamentos al cargar el componente
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/departamento`)
      .then(response => {
        const departamentoData = response.data.map((item) => ({
          ...item,
          id: item.dep_id, // Asignar id basado en pai_id
        }));
        setDepartamentos(departamentoData);
        console.log(departamentoData);
      })
      .catch(error => {
        console.error("Error al buscar departamento!", error);
      });
  }, []);

  // Efecto para obtener los países al cargar el componente
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/pais`)
      .then(response => {
        setPais(response.data);
        console.log(pais);
      })
      .catch(error => {
        console.error("Error al buscar país!", error);
      });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormDepartamento setMessage={setMessage} selectedRow={selectedRow} setSelectedRow={setSelectedRow} departamentos={departamentos} pais={pais}/>
      <GridDepartamento selectedRow={selectedRow} setSelectedRow={setSelectedRow} departamentos={departamentos} />
    </div>
  );
}