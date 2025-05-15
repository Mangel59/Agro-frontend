/**
 * @filer_kardex.jsx
 * @moduler_kardex
 * @description Servicio para cargar datos locales de archivos JSON desde /public.
 * Proporciona funciones para recuperar listas jerárquicas para el formulario de pedidos,
 * como país, departamento, municipio, sede, bloque, etc., con soporte para estructuras anidadas.
 * Cada archivo JSON contiene un array de objetos directamente (no anidado en una clave).
 */

import React from "react";
import axios from "axios";
import Formkardex from "./Formkardex";

const BASE_PATH = "/"; // JSONs están directamente en /public

/**
 * Realiza una solicitud para obtener un archivo JSON local.
 * @param {string} nombreArchivo - Nombre del archivo JSON sin extensión
 * @returns {Promise<any[]>} - Arreglo de objetos directamente extraído
 */
const obtenerDatos = async (nombreArchivo) => {
  const response = await axios.get(`${BASE_PATH}${nombreArchivo}.json`);
  return Array.isArray(response.data) ? response.data : [];
};

export const DataPedidosService = {
  cargarPaises: () => obtenerDatos("pais"),
  cargarDepartamentos: () => obtenerDatos("departamento"),
  cargarMunicipios: () => obtenerDatos("municipio"),
  cargarSedes: () => obtenerDatos("sede"),
  cargarBloques: () => obtenerDatos("bloque"),
  cargarEspacios: () => obtenerDatos("espacio"),
  cargarAlmacenes: () => obtenerDatos("almacen"),
  cargarUnidades: () => obtenerDatos("unidad"),
  cargarProductos: () => obtenerDatos("producto"),
  cargarTiposMovimiento: () => obtenerDatos("tipo_movimiento"),
  cargarMovimientos: () => obtenerDatos("movimiento"),
  cargarPresentaciones: () => obtenerDatos("producto_presentacion")
};

export default function RPedidos() {
  return (
    <div className="container mt-4">
       <h1>Reportde kardex</h1>
      <Formkardex />
    </div>
  );
}
