/**
 * @file GridSede.jsx
 * @module GridSede
 * @description Componente de grilla para visualizar las sedes disponibles, con columnas informativas y selección de fila. Conecta con la API para obtener los datos de sedes.
 * @author Karla
 */

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import PropTypes from "prop-types";

/**
 * @typedef {Object} SedeRow
 * @property {number} id - ID de la sede
 * @property {string} grupo - Grupo asociado
 * @property {string} tipoSede - Tipo de sede
 * @property {string} nombre - Nombre de la sede
 * @property {string} municipio - Municipio asociado
 * @property {Object|null} geolocalizacion - Información de geolocalización
 * @property {Array<number>} [geolocalizacion.coordinates] - Coordenadas [longitud, latitud]
 * @property {number} area - Área de la sede
 * @property {string} comuna - Comuna de ubicación
 * @property {string} descripcion - Descripción de la sede
 * @property {number} estado - Estado de la sede (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} GridSedeProps
 * @property {function} setSelectedRow - Función para establecer la fila seleccionada
 */

/**
 * Componente GridSede.
 *
 * @param {Object} props - Props del componente
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada
 * @returns {JSX.Element} Grilla de sedes
 */
export default function GridSede({ setSelectedRow }) {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar las sedes:", error);
        setError("No se pudieron cargar las sedes. Por favor, intente más tarde.");
        setSedes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSedes();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "grupo", headerName: "Grupo", width: 180 },
    { field: "tipoSede", headerName: "Tipo de Sede", width: 180 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "municipio", headerName: "Municipio", width: 180 },
    {
      field: "geolocalizacion",
      headerName: "Geolocalización",
      width: 300,
      valueGetter: (params) =>
        params.row.geolocalizacion
          ? JSON.stringify(params.row.geolocalizacion)
          : "Sin datos",
    },
    {
      field: "coordenadas",
      headerName: "Coordenadas",
      width: 150,
      valueGetter: (params) =>
        params.row.coordenadas && params.row.coordenadas.trim() !== ""
          ? params.row.coordenadas
          : "Sin datos",
    },    
    { field: "area", headerName: "Área", width: 150 },
    { field: "comuna", headerName: "Comuna", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "estado", headerName: "Estado", width: 120 },
  ];

  /**
   * Maneja el clic sobre una fila para seleccionar una sede.
   * @param {*} params - Datos de la fila seleccionada
   */
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={sedes}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
      />
    </div>
  );
}

GridSede.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
};
