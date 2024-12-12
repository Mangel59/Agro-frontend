import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function GridSede({ setSelectedRow }) {
  const [sedes, setSedes] = useState([]); // Inicializar sedes como un array vacío
  const [loading, setLoading] = useState(true); // Estado para mostrar el cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []); // Asegúrate de que la respuesta sea un array
        setError(null); // Limpiar errores si los datos se cargaron correctamente
      } catch (error) {
        console.error("Error al cargar las sedes:", error);
        setError("No se pudieron cargar las sedes. Por favor, intente más tarde.");
        setSedes([]); // En caso de error, establecer sedes como un array vacío
      } finally {
        setLoading(false); // Terminar el estado de carga
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
    { field: "area", headerName: "Área", width: 150 },
    { field: "comuna", headerName: "Comuna", width: 150 },
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
        rows={sedes} // Asegúrate de que 'sedes' no sea undefined
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
