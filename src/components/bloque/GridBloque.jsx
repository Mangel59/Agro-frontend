/**
 * GridBloque componente principal.
 * Muestra una tabla con los bloques filtrados por sede y permite seleccionar una fila.
 *
 * @module GridBloque
 * @component
 * @param {Object} props
 * @param {function} props.setSelectedRow - Función para seleccionar una fila de la tabla.
 * @param {string|number} props.selectedSede - ID de la sede seleccionada para filtrar bloques.
 * @param {boolean} props.reloadData - Permite forzar recarga externa de los datos.
 * @returns {JSX.Element}
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

function GridBloque({ setSelectedRow, selectedSede, reloadData }) {
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBloques = async () => {
      if (!selectedSede) {
        setBloques([]);
        return;
      }

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
  }, [selectedSede, reloadData]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "sede", headerName: "Sede", width: 100 },
    { field: "tipoBloque", headerName: "Tipo de Bloque", width: 130 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    {
      field: "geolocalizacion",
      headerName: "Geolocalización",
      width: 180,
      valueGetter: (params) => {
        const geo = params.row.geolocalizacion;
        return geo ? String(geo) : "Sin datos";
      },
    },
    {
      field: "coordenadas",
      headerName: "Coordenadas",
      width: 150,
      valueGetter: (params) => {
        const coords = params.row.coordenadas;
        return coords && typeof coords === "string" ? coords : "Sin datos";
      },
    },
    { field: "numeroPisos", headerName: "Número de Pisos", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
  ];

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      {loading ? (
        <div>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <DataGrid
          rows={bloques}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          onRowClick={handleRowClick}
          getRowId={(row) => row.id}
        />
      )}
    </div>
  );
}

GridBloque.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedSede: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reloadData: PropTypes.bool.isRequired,
};

export default GridBloque;
