/**
 * Componente principal para la gestión de empresas.
 *
 * Este componente maneja la lógica del módulo de empresas, incluyendo la carga de datos,
 * manejo de mensajes, y renderizado de los formularios y la tabla de empresas.
 *
 * @module Empresa
 * @component
 * @returns {JSX.Element} El módulo de gestión de empresas.
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormEmpresa from "./FormEmpresa";
import GridEmpresa from "./GridEmpresa";
import StackButtons from "../StackButtons"; // ✅ Botones principales
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef EmpresaRow
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} estado
 * @property {string} celular
 * @property {string} correo
 * @property {string} contacto
 * @property {number} tipoIdentificacionId
 * @property {number} personaId
 * @property {string} identificacion
 */

/**
 * @typedef SnackbarMessage
 * @property {boolean} open
 * @property {string} severity
 * @property {string} text
 */

export default function Empresa() {
  /** @type {EmpresaRow} */
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
  };

  const [selectedRow, setSelectedRow] = React.useState(defaultRow);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [empresas, setEmpresas] = React.useState([]);
  const [openForm, setOpenForm] = React.useState(false);
  const [methodName, setMethodName] = React.useState("Add");

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

  const handleAdd = () => {
    setSelectedRow(defaultRow);
    setMethodName("Add");
    setOpenForm(true);
  };

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
      {/* ✅ Formulario con modal */}
      <FormEmpresa
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
        open={openForm}
        setOpen={setOpenForm}
        methodName={methodName}
      />

      {/* ✅ Grilla de datos */}
      <GridEmpresa
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        empresas={empresas}
      />
    </div>
  );
}
