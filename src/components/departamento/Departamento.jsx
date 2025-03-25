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

/**
 * @typedef {Object} DepartamentoRow
 * @property {number} id - ID del departamento.
 * @property {string} name - Nombre del departamento.
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open
 * @property {string} severity
 * @property {string} text
 */

export default function Departamento() {
  /** @type {DepartamentoRow} */
  const row = { id: 0, name: "" };

  /** @type {React.MutableRefObject<DepartamentoRow>} */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** @type {SnackbarMessage} */
  const initialMessage = { open: false, severity: "success", text: "" };

  /** Estado del mensaje que se muestra en el Snackbar */
  const [message, setMessage] = React.useState(initialMessage);

  /** Lista de departamentos obtenidos del backend */
  const [departamentos, setDepartamentos] = React.useState(/** @type {DepartamentoRow[]} */ ([]));

  // Carga inicial de los departamentos
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/items/departamento`)
      .then(response => {
        const departamentoData = response.data.map((item) => ({
          ...item,
          id: item.id,
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
