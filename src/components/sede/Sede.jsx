/**
 * @file Sede.jsx
 * @module Sede
 * @description Componente principal para gestionar las sedes del sistema. Contiene formulario, grilla y manejo de estado y errores. Se conecta al backend para cargar datos dinámicamente.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} SedeRow
 * @property {number} id - ID de la sede
 * @property {string} grupo - ID o nombre del grupo
 * @property {string} tipoSede - ID o nombre del tipo de sede
 * @property {string} nombre - Nombre de la sede
 * @property {string} municipioId - ID del municipio
 * @property {string|Object} geolocalizacion - Ubicación geográfica (puede ser string u objeto con coordenadas)
 * @property {string} cooordenadas - Coordenadas manuales (si aplica)
 * @property {number} area - Área de la sede
 * @property {string} comuna - Comuna donde se ubica
 * @property {string} descripcion - Descripción de la sede
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Indica si el mensaje está visible
 * @property {string} severity - Severidad del mensaje (success, error, etc.)
 * @property {string} text - Texto del mensaje a mostrar
 */

/**
 * Componente principal para gestionar las sedes.
 *
 * Este componente muestra un formulario para crear o editar sedes,
 * y una grilla con la lista de sedes registradas.
 * También maneja la carga de datos desde el backend,
 * el estado de errores y los mensajes tipo snackbar.
 *
 * @function Sede
 * @returns {JSX.Element} Elemento JSX renderizado
 */
export default function Sede() {
  /** @type {SedeRow} */
  const row = {
    id: 0,
    grupo: "",
    tipoSede: "",
    nombre: "",
    municipioId: "",
    geolocalizacion: "",
    cooordenadas: "",
    area: 0,
    comuna: "",
    descripcion: "",
    estado: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [sedes, setSedes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  /**
   * Carga las sedes desde el backend y actualiza el estado local.
   */
  const reloadData = () => {
    setLoading(true);
    axios
      .get(`${SiteProps.urlbasev1}/sede`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const sedeData = response.data.map((item) => ({
          ...item,
          geolocalizacion: item.geolocalizacion || { type: "Point", coordinates: [0, 0] },
        }));
        setSedes(sedeData);
        setError(null);
      })
      .catch((error) => {
        console.error("Error al cargar las sedes!", error);
        setError("No se pudieron cargar las sedes. Intente nuevamente.");
        setMessage({ open: true, severity: "error", text: "Error al cargar las sedes. Intente nuevamente." });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  /**
   * Cierra el snackbar de mensajes.
   */
  const handleMessageClose = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Sede</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <FormSede
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={reloadData}
          />
          <GridSede
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            sedes={sedes}
            reloadData={reloadData}
          />
        </>
      )}
    </div>
  );
}
