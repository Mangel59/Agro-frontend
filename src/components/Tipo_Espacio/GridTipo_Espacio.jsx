import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function GridTipoEspacio({ setSelectedRow, reloadData }) {
  const [iespacios, setIespacios] = useState([]); // Lista de tipos de espacios
  const [loading, setLoading] = useState(false); // Estado para mostrar el cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para cargar los tipos de espacios
  useEffect(() => {
    const fetchIespacios = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Datos recibidos del backend:", response.data); // Verificar datos del backend
        setIespacios(response.data || []); // Asegúrate de que la respuesta sea un array
        setError(null); // Limpiar errores si los datos se cargaron correctamente
      } catch (error) {
        console.error("Error al cargar los tipos de espacio:", error);
        setError("No se pudieron cargar los tipos de espacio. Por favor, intente más tarde.");
        setIespacios([]); // En caso de error, establecer tipos de espacios como un array vacío
      } finally {
        setLoading(false); // Terminar el estado de carga
      }
    };

    fetchIespacios();
  }, [reloadData]); // Recargar datos si reloadData cambia

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

  const handleRowClick = (params) => {
    console.log("Fila seleccionada:", params.row); // Verificar la fila seleccionada
    setSelectedRow(params.row);
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={iespacios} // Cargar los tipos de espacios
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
