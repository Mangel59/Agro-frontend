/**
 * @file Empresa.jsx
 * @module Empresa
 * @description Componente principal para la gestión de empresas.
 *
 * Este componente maneja la lógica del módulo de empresas, incluyendo la carga de datos,
 * manejo de mensajes, y renderizado de los formularios y la tabla de empresas.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormEmpresa from "./FormEmpresa";
import GridEmpresa from "./GridEmpresa";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} EmpresaRow
 * @property {number} id - ID de la empresa
 * @property {string} nombre - Nombre de la empresa
 * @property {string} descripcion - Descripción de la empresa
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 * @property {string} celular - Número de celular de contacto
 * @property {string} correo - Correo electrónico de la empresa
 * @property {string} contacto - Nombre del contacto principal
 * @property {number} tipoIdentificacionId - ID del tipo de identificación
 * @property {number} personaId - ID de la persona asociada
 * @property {string} identificacion - Número de identificación
 * @property {string} logo - URL o nombre del logo de la empresa
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad ("success", "error", etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para la gestión de empresas.
 *
 * @returns {JSX.Element} El módulo de gestión de empresas
 */
export default function Empresa() {
  const defaultRow = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    celular: "",
    correo: "",
    contacto: "",
    tipoIdentificacionId: 0,
    personaId: 0,
    identificacion: "",
    logo: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(defaultRow);
  const [message, setMessage] = React.useState(
    /** @type {SnackbarMessage} */ ({
      open: false,
      severity: "success",
      text: "",
    })
  );
  const [empresas, setEmpresas] = React.useState(/** @type {EmpresaRow[]} */ ([]));
  const [openForm, setOpenForm] = React.useState(false);
  const [methodName, setMethodName] = React.useState("Add");

  /**
   * Carga los datos de empresas desde la API.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/empresas`)
      .then((response) => {
        const empresaData = response.data.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setEmpresas(empresaData);
      })
      .catch((error) => {
        console.error("Error al buscar empresas!", error);
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  /**
   * Maneja la acción de agregar una nueva empresa.
   */
  const handleAdd = () => {
    setSelectedRow(defaultRow);
    setMethodName("Add");
    setOpenForm(true);
  };

  /**
   * Maneja la acción de actualizar una empresa existente.
   */
  const handleUpdate = () => {
    if (!selectedRow?.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para actualizar.",
      });
      return;
    }
    setMethodName("Update");
    setOpenForm(true);
  };

  /**
   * Maneja la acción de eliminar una empresa.
   */
  const handleDelete = () => {
    if (!selectedRow?.id) {
      setMessage({
        open: true,
        severity: "error",
        text: "Selecciona una fila para eliminar.",
      });
      return;
    }

    axios
      .delete(`${SiteProps.urlbasev1}/empresas/${selectedRow.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Empresa eliminada con éxito!",
        });
        reloadData();
      })
      .catch((error) => {
        setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar empresa: ${error.response?.data.message || error.message}`,
        });
      });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Gestión de Empresas</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormEmpresa
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
        open={openForm}
        setOpen={setOpenForm}
        methodName={methodName}
      />

      <GridEmpresa
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        empresas={empresas}
      />
    </div>
  );
}
