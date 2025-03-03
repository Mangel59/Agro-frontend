import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

function GridBloque({ setSelectedRow, selectedSede }) {
  const [bloques, setBloques] = useState([]); // Lista de bloques
  const [loading, setLoading] = useState(false); // Estado para mostrar el cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para cargar los bloques según la sede seleccionada
  useEffect(() => {
    if (!selectedSede) {
      setBloques([]); // Si no hay sede seleccionada, vaciar la tabla
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
        setBloques(response.data || []); // Asegurar que la respuesta sea un array
        setError(null); // Limpiar errores si los datos se cargaron correctamente
      } catch (error) {
        console.error("Error al cargar los bloques:", error);
        setError("No se pudieron cargar los bloques. Por favor, intente más tarde.");
        setBloques([]); // En caso de error, establecer bloques como un array vacío
      } finally {
        setLoading(false); // Terminar el estado de carga
      }
    };

    fetchBloques();
  }, [selectedSede]); // Ejecutar cuando cambie la sede seleccionada

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

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={bloques} // Cargar los bloques según la sede seleccionada
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

// 📌 Agregamos la validación de props con PropTypes
GridBloque.propTypes = {
  setSelectedRow: PropTypes.func.isRequired, // Debe ser una función obligatoria
  selectedSede: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Puede ser string o número
};

export default GridBloque;
