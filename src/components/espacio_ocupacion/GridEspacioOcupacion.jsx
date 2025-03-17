/**
 * Componente GridEspacioOcupacion.
 * @module GridEspacioOcupacion
 * @component
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { SiteProps } from "../dashboard/SiteProps";

const GridEspacioOcupacion = ({ setSelectedRow, selectedEspacio, reloadFlag }) => {
  const [espacioOcupacion, setEspacioOcupacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    const fetchEspacioOcupacion = async () => {
      if (!selectedEspacio) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/espacio_ocupacion/espacio/${selectedEspacio}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setEspacioOcupacion(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar espacio ocupación:", error);
        setError("No se pudieron cargar los datos. Por favor, intente más tarde.");
        setEspacioOcupacion([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEspacioOcupacion();
  }, [selectedEspacio, reloadFlag]); // ✅ Se recarga al cambiar el booleano reloadFlag

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "tipoEspacio",
      headerName: "Tipo de Espacio",
      width: 150,
      valueGetter: (params) => params.row.tipoEspacio || params.row.espacio || "Sin datos",
    },
    {
      field: "espacio",
      headerName: "Espacio",
      width: 150,
      valueGetter: (params) => params.row.espacio || "Sin datos",
    },
    {
      field: "actividadOcupacion",
      headerName: "Actividad",
      width: 150,
      valueGetter: (params) => params.row.actividadOcupacion || "Sin datos",
    },
    { field: "fechaInicio", headerName: "Fecha Inicio", width: 180 },
    { field: "fechaFin", headerName: "Fecha Fin", width: 180 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
  ];

  const handleRowClick = (params) => {
    setSelectedRowId(params.id);
    setSelectedRow(params.row);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={espacioOcupacion}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
        getRowClassName={(params) =>
          params.id === selectedRowId ? "selected-row" : ""
        }
      />
    </div>
  );
};

// ✅ Validación de props
GridEspacioOcupacion.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedEspacio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reloadFlag: PropTypes.bool.isRequired, // ✅ cambiado a booleano
};

export default GridEspacioOcupacion;
