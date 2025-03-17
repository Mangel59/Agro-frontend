/**
 * GridBloque componente principal.
 * Muestra una tabla con los bloques filtrados por sede y permite seleccionar una fila.
 *
 * @module GridBloque
 * @component
 * @param {Object} props
 * @param {function} props.setSelectedRow - Función para seleccionar una fila de la tabla.
 * @param {string|number} props.selectedSede - ID de la sede seleccionada para filtrar bloques.
 * @returns {JSX.Element}
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

function GridBloque({ setSelectedRow, selectedSede }) {
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene los bloques de la sede seleccionada desde el backend.
   */
  useEffect(() => {
    if (!selectedSede) {
      setBloques([]);
      return;
    }

    const fetchBloques = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/bloque/sede/${selectedSede}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setBloques(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar los bloques:", error);
        setError("No se pudieron cargar los bloques. Por favor, intente más tarde.");
        setBloques([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBloques();
  }, [selectedSede]);

  /**
   * Columnas para la tabla de bloques.
   */
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "sede", headerName: "Sede", width: 180 },
    { field: "tipoBloque", headerName: "Tipo de Bloque", width: 180 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    {
      field: "geolocalizacion",
      headerName: "Geolocalización",
      width: 300,
      type: "string",
      valueGetter: (params) =>
        params.row.geolocalizacion
          ? JSON.stringify(params.row.geolocalizacion)
          : "Sin datos",
    },
    {
      field: "cordenadas",
      headerName: "Coordenadas",
      width: 150,
      type: "number",
      valueGetter: (params) => {
        const coordinates = params.row.geolocalizacion?.coordinates;
        return coordinates ? `${coordinates[1]}, ${coordinates[0]}` : "Sin datos";
      },
    },
    { field: "numeroPisos", headerName: "Número de pisos", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "estado", headerName: "Estado", width: 120 },
  ];

  /**
   * Maneja el evento de clic en una fila.
   * @param {object} params - Parámetros del evento de clic.
   */
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={bloques}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

// 📌 Validación de props con PropTypes
GridBloque.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedSede: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default GridBloque;
