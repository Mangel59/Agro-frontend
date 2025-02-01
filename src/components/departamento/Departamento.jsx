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
    id: 0,
    name: "",
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

  // Efecto para obtener los departamentos al cargar el componente
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/items/departamento`)
      .then(response => {
        const departamentoData = response.data.map((item) => ({
          ...item,
          id: item.id, // Asignar id basado en pai_id
        }));
        setDepartamentos(departamentoData);
        console.log(departamentoData);
      })
      .catch(error => {
        console.error("Error al buscar departamento!", error);
      });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
       <h1>Departamentos</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormDepartamento setMessage={setMessage} selectedRow={selectedRow} setSelectedRow={setSelectedRow} departamentos={departamentos}/>
      <GridDepartamento selectedRow={selectedRow} setSelectedRow={setSelectedRow} departamentos={departamentos} />
    </div>
  );
}