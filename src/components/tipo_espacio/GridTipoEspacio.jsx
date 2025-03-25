/**
 * @file GridTipoEspacio.jsx
 * @module GridTipoEspacio
 * @description Componente que renderiza una grilla con los tipos de espacio registrados.
 * Permite seleccionar un tipo de espacio para su edición o eliminación.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {boolean} props.reloadData - Valor que activa la recarga de datos cuando cambia.
 * @returns {JSX.Element} Grilla con los tipos de espacio disponibles.
 */

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente que muestra una tabla con los tipos de espacio disponibles.
 * Los datos se cargan desde un endpoint y se actualizan al cambiar `reloadData`.
 */
export default function GridTipoEspacio({ setSelectedRow, reloadData }) {
  const [iespacios, setIespacios] = useState([]); // Lista de tipos de espacios
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores

  /**
   * Carga los datos desde la API al montar el componente o cambiar reloadData.
   */
  useEffect(() => {
    const fetchIespacios = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Datos recibidos del backend:", response.data);
        setIespacios(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error al cargar los tipos de espacio:", error);
        setError("No se pudieron cargar los tipos de espacio. Por favor, intente más tarde.");
        setIespacios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIespacios();
  }, [reloadData]);

  /**
   * Columnas a mostrar en la grilla de tipos de espacio.
   */
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
  ];

  /**
   * Maneja la selección de una fila y envía la fila seleccionada al componente padre.
   * @param {object} params - Datos de la fila seleccionada.
   */
  const handleRowClick = (params) => {
    console.log("Fila seleccionada:", params.row);
    setSelectedRow(params.row);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={iespacios}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
