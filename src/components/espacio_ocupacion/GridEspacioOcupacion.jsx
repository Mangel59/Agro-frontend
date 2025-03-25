/**
 * @file GridEspacioOcupacion.jsx
 * @module GridEspacioOcupacion
 * @description Componente de grilla que muestra la ocupación de espacios según el espacio seleccionado.
 * Permite seleccionar registros para editar o eliminar.
 */

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente de grilla que lista los registros de ocupación de un espacio específico.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {string|number} props.selectedEspacio - ID del espacio seleccionado para filtrar los datos.
 * @param {boolean} props.reloadData - Bandera que fuerza la recarga de datos cuando cambia.
 * @returns {JSX.Element} Componente DataGrid con registros de ocupación.
 */
const GridEspacioOcupacion = ({ setSelectedRow, selectedEspacio, reloadData }) => {
  const [espacioOcupacion, setEspacioOcupacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  /**
   * Carga los registros de ocupación del espacio seleccionado.
   */
  useEffect(() => {
    const fetchEspacioOcupacion = async () => {
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
        if (error.response) {
          console.error("Error en la respuesta del servidor:", error.response);
        } else if (error.request) {
          console.error("Error en la solicitud al servidor:", error.request);
        } else {
          console.error("Error desconocido:", error.message);
        }
        setError("No se pudieron cargar los datos. Por favor, intente más tarde.");
        setEspacioOcupacion([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedEspacio) {
      fetchEspacioOcupacion();
    }
  }, [selectedEspacio, reloadData]);

  /**
   * Columnas para la grilla de ocupación.
   */
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

  /**
   * Maneja el clic en una fila para seleccionarla.
   * @param {Object} params - Parámetros del evento de fila.
   */
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

export default GridEspacioOcupacion;
