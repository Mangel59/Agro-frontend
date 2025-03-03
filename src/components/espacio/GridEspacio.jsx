import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function GridEspacio({ setSelectedRow, selectedBloque }) {
  const [espacios, setEspacios] = useState([]); // Lista de espacios
  const [loading, setLoading] = useState(false); // Estado para mostrar el cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para cargar los espacios según el bloque seleccionado
  useEffect(() => {
    if (!selectedBloque) {
      setEspacios([]); // Si no hay bloque seleccionado, vaciar la tabla
      return;
    }

    const fetchEspacios = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/espacio/bloque/${selectedBloque}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setEspacios(response.data || []); // Asegúrate de que la respuesta sea un array
        setError(null); // Limpiar errores si los datos se cargaron correctamente
      } catch (error) {
        console.error("Error al cargar los espacios:", error);
        setError("No se pudieron cargar los espacios. Por favor, intente más tarde.");
        setEspacios([]); // En caso de error, establecer espacios como un array vacío
      } finally {
        setLoading(false); // Terminar el estado de carga
      }
    };

    fetchEspacios();
  }, [selectedBloque]); // Ejecutar cuando cambie el bloque seleccionado

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "bloque", headerName: "Bloque", width: 180 },
    { field: "tipoEspacio", headerName: "Tipo de Espacio", width: 180 },
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

  const handleRowSelectionChange = (id) => {
    const selectedIDs = new Set(id);
    const selectedRowData = espacios.find((row) => selectedIDs.has(row.id)) || null;
    setSelectedRow(selectedRowData); // Maneja cuando no hay selección
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={espacios} // Cargar los espacios según el bloque seleccionado
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20, 50]}
        onRowSelectionModelChange={(ids) => handleRowSelectionChange(ids)}
      />
    </div>
  );
}

// Validación de PropTypes
GridEspacio.propTypes = {
  setSelectedRow: PropTypes.func.isRequired, // Debe ser una función
  selectedBloque: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Puede ser string o número
};
