/**
 * @file GridEspacio.jsx
 * @module GridEspacio
 * @description Componente que muestra los espacios disponibles por bloque en una tabla.
 * @component
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente GridEspacio.
 *
 * Muestra los espacios disponibles según el bloque seleccionado en una tabla tipo DataGrid.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setSelectedRow - Función que establece la fila seleccionada.
 * @param {string|number} props.selectedBloque - ID del bloque seleccionado.
 * @param {boolean} props.reloadFlag - Bandera para recargar los datos.
 * @returns {JSX.Element} Componente de grilla con los espacios.
 */
export default function GridEspacio({ setSelectedRow, selectedBloque, reloadFlag }) {
  const [espacios, setEspacios] = useState([]); // Lista de espacios
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    if (!selectedBloque) {
      setEspacios([]);
      return;
    }

    const fetchEspacios = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/espacio/bloque/${selectedBloque}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEspacios(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar los espacios:", error);
        setError("No se pudieron cargar los espacios. Por favor, intente más tarde.");
        setEspacios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEspacios();
  }, [selectedBloque, reloadFlag]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "bloque",
      headerName: "Bloque",
      width: 180,
      valueGetter: (params) => params.row.bloque?.nombre || "",
    },
    {
      field: "tipoEspacio",
      headerName: "Tipo de Espacio",
      width: 180,
      valueGetter: (params) => params.row.tipoEspacio?.nombre || "",
    },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 300 },
    { field: "coordenadas", headerName: "Coordenadas", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
  ];

  const handleRowSelectionChange = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = espacios.find((row) => selectedIDs.has(row.id)) || null;
    setSelectedRow(selectedRowData);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={espacios}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        onRowSelectionModelChange={(ids) => handleRowSelectionChange(ids)}
        getRowId={(row) => row.id}
      />
    </div>
  );
}

// Validación de tipos con PropTypes
GridEspacio.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedBloque: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  reloadFlag: PropTypes.bool,
};
