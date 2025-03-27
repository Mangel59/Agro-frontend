/**
 * @file TipoMovimiento.jsx
 * @module TipoMovimiento
 * @description Componente principal para gestionar Tipos de Movimiento: formulario, grilla, mensajes y recarga de datos en tiempo real usando referencia (ref).
 * @author Karla
 */

import React, { useRef, useState } from "react";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoMovimiento from "./FormTipoMovimiento";
import GridTipoMovimiento from "./GridTipoMovimiento";

/**
 * @typedef {Object} TipoMovimientoRow
 * @property {number} id - ID del tipo de movimiento
 * @property {string} nombre - Nombre del tipo de movimiento
 * @property {string} descripcion - Descripción del tipo de movimiento
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 * @property {number} empresa - ID de la empresa asociada
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Indica si el mensaje snackbar está visible
 * @property {string} severity - Nivel de severidad del mensaje ("success", "error", etc.)
 * @property {string} text - Contenido del mensaje que se mostrará
 */

/**
 * Componente principal para la gestión de Tipos de Movimiento.
 *
 * @component
 * @returns {JSX.Element} Interfaz de administración para tipos de movimiento.
 */
export default function TipoMovimiento() {
  const gridRef = useRef(); // 👉 Referencia para la grilla

  /** @type {TipoMovimientoRow} */
  const initialRow = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: 0,
  };

  const [selectedRow, setSelectedRow] = useState(initialRow);

  /** @type {SnackbarMessage} */
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Movimiento</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoMovimiento
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => gridRef.current?.reloadData()} // 👉 Refrescar desde el form
      />

      <GridTipoMovimiento
        ref={gridRef} // 👉 Conectar ref a la grilla
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
      />
    </div>
  );
}
