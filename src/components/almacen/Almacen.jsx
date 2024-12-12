import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormAlmacen from "./FormAlmacen";
import { SiteProps } from "../dashboard/SiteProps";

const Almacen = () => {
  const [sedes, setSedes] = useState([]); // Lista de sedes
  const [almacenes, setAlmacenes] = useState([]); // Lista de almacenes
  const [selectedSede, setSelectedSede] = useState(null); // Sede seleccionada
  const [selectedRow, setSelectedRow] = useState(null); // Fila seleccionada para editar
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });

  // Cargar las sedes al montar el componente
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (err) {
        console.error("Error al cargar las sedes:", err);
      }
    };

    fetchSedes();
  }, []);

  // Cargar almacenes según la sede seleccionada
  useEffect(() => {
    if (!selectedSede) {
      setAlmacenes([]);
      setSelectedRow(null);
      return;
    }

    const fetchAlmacenes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/almacen/sede/${selectedSede}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const data = response.data?.content || [];
        setAlmacenes(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los almacenes:", err);
        setError("No se pudieron cargar los almacenes.");
        setAlmacenes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlmacenes();
  }, [selectedSede]);

  const reloadAlmacenes = () => {
    if (selectedSede) {
      const fetchAlmacenes = async () => {
        try {
          const response = await axios.get(
            `${SiteProps.urlbasev1}/almacen/sede/${selectedSede}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );

          const data = response.data?.content || [];
          setAlmacenes(data);
        } catch (err) {
          console.error("Error al recargar los almacenes:", err);
        }
      };

      fetchAlmacenes();
    }
  };

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

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* Mensajes de notificación */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Selector de sede */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="sede-select">Seleccionar Sede: </label>
        <select
          id="sede-select"
          value={selectedSede || ""}
          onChange={(e) => setSelectedSede(e.target.value)}
        >
          <option value="">Seleccione una sede</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario para crear/editar almacenes */}
      <FormAlmacen
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        sedeId={selectedSede}
        reloadData={reloadAlmacenes}
      />

      {/* Tabla de almacenes */}
      <div style={{ height: 400, width: "100%" }}>
        {loading ? (
          <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
        ) : (
          <DataGrid
            rows={almacenes}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={(params) => setSelectedRow(params.row)}
          />
        )}
      </div>
    </div>
  );
};

export default Almacen;
