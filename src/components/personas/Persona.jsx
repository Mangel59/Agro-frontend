/**
 * @file Persona.jsx
 * @module Persona
 * @description Componente principal para gestionar personas. Incluye formulario y grilla con paginación y actualización de datos desde el backend.
 * @author Karla
 */

import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPersona from "./FormPersona";
import GridPersona from "./GridPersona";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} PersonaRow
 * @property {number} id - ID de la persona
 * @property {string} tipoIdentificacion - Tipo de identificación (CC, TI, etc.)
 * @property {string} identificacion - Número de documento
 * @property {string} nombre - Nombre de la persona
 * @property {string} apellido - Apellido de la persona
 * @property {string} genero - Género de la persona
 * @property {string} fechaNacimiento - Fecha de nacimiento (formato YYYY-MM-DD)
 * @property {string} estrato - Estrato socioeconómico
 * @property {string} direccion - Dirección de residencia
 * @property {string} email - Correo electrónico
 * @property {string} celular - Número de celular
 * @property {number} estado - Estado (1: Activo, 0: Inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Indica si el mensaje está visible
 * @property {string} severity - Severidad del mensaje (success, error, etc.)
 * @property {string} text - Texto del mensaje a mostrar
 */

/**
 * @typedef {Object} PaginationModel
 * @property {number} page - Página actual
 * @property {number} pageSize - Tamaño de página
 * @property {number} total - Total de elementos
 */

/**
 * Componente principal para la gestión de personas.
 *
 * @component
 * @returns {JSX.Element} Vista para crear, editar, eliminar y listar personas
 */
export default function Persona() {
  /** @type {PersonaRow} */
  const defaultRow = {
    id: 0,
    tipoIdentificacion: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    genero: "",
    fechaNacimiento: "",
    estrato: "",
    direccion: "",
    email: "",
    celular: "",
    estado: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(defaultRow);
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [personas, setPersonas] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 5,
    total: 0,
  });

  /**
   * Carga los datos de personas desde la API.
   * @param {number} [page=0] - Página actual.
   * @param {number} [pageSize=5] - Tamaño de página.
   */
  const reloadData = (page = 0, pageSize = 5) => {
    axios
      .get(`${SiteProps.urlbasev1}/persona?page=${page}&size=${pageSize}`)
      .then((response) => {
        const content = response.data?.content || response.data?.data || [];
        setPersonas(content);
        setPagination({
          page,
          pageSize,
          total: response.data.totalElements || content.length || 0,
        });
      })
      .catch((err) => {
        console.error("Error al cargar personas", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar personas desde el servidor.",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Personas</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPersona
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(pagination.page, pagination.pageSize)}
      />
      <GridPersona
        personas={personas}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        pagination={pagination}
        onPageChange={reloadData}
      />
    </div>
  );
}
