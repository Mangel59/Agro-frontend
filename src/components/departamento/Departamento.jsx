/**
 * Departamento componente principal.
 *
 * Este componente se encarga de gestionar y mostrar la información de departamentos.
 * Incluye un formulario y una tabla para listar los departamentos.
 *
 * @module Departamento
 * @component
 * @returns {JSX.Element} Componente visual para gestionar departamentos.
 */

import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormDepartamento from "./FormDepartamento";
import GridDepartamento from "./GridDepartamento";
import { SiteProps } from '../dashboard/SiteProps';

export default function Departamento() {
  // Estado inicial
  const row = {
    id: 0,
    name: "",
  };

  /**
   * Estado que almacena la fila seleccionada.
   * @type {{id: number, name: string}}
   */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /**
   * Estado del mensaje que se muestra en el snackbar.
   * @type {{open: boolean, severity: string, text: string}}
   */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: ""
  });

  /**
   * Lista de departamentos obtenidos del backend.
   * @type {Array<{id: number, name: string}>}
   */
  const [departamentos, setDepartamentos] = React.useState([]);

  // Carga inicial de los departamentos
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/items/departamento`)
      .then(response => {
        const departamentoData = response.data.map((item) => ({
          ...item,
          id: item.id, // Garantiza que tenga campo `id`
        }));
        setDepartamentos(departamentoData);
      })
      .catch(error => {
        console.error("Error al buscar departamento!", error);
      });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <h1>Departamentos</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormDepartamento
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        departamentos={departamentos}
      />
      <GridDepartamento
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        departamentos={departamentos}
      />
    </div>
  );
}
