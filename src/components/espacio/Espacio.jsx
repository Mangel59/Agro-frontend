import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import MessageSnackBar from "../MessageSnackBar";
import FormEspacio from "../espacio/FormEspacio";

export default function Espacio() {
  const [sedes, setSedes] = useState([]); // Lista de sedes
  const [selectedSede, setSelectedSede] = useState(null); // Sede seleccionada
  const [bloques, setBloques] = useState([]); // Lista de bloques
  const [selectedBloque, setSelectedBloque] = useState(null); // Bloque seleccionado
  const [espacio, setEspacios] = useState([]); // Lista de espacio
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [selectedRow, setSelectedRow] = useState(null); // Fila seleccionada para editar

  // Función para cargar espacios
  const fetchEspacios = async () => {
    if (!selectedBloque) {
      setEspacios([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${SiteProps.urlbasev1}/espacio/bloque/${selectedBloque}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEspacios(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los espacios:", err);
      setError("No se pudieron cargar los espacios.");
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Cargar los bloques según la sede seleccionada
  useEffect(() => {
    if (!selectedSede) {
      setBloques([]);
      setEspacios([]);
      return;
    }

    const fetchBloques = async () => {
      try {
        const response = await axios.get(
          `${SiteProps.urlbasev1}/bloque/sede/${selectedSede}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setBloques(response.data || []);
      } catch (err) {
        console.error("Error al cargar los bloques:", err);
      }
    };

    fetchBloques();
  }, [selectedSede]);

  // Recargar espacios cuando cambie el bloque seleccionado
  useEffect(() => {
    fetchEspacios();
  }, [selectedBloque]);

  const handleSedeChange = (event) => {
    setSelectedSede(event.target.value);
    setSelectedBloque(null);
    setEspacios([]);
  };

  const handleBloqueChange = (event) => {
    setSelectedBloque(event.target.value);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "bloque", headerName: "Bloque", width: 180 },
    { field: "tipoEspacio", headerName: "Tipo de Espacio", width: 180 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 300 },
    { field: "coordenadas", headerName: "Coordenadas", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "estado", headerName: "Estado", width: 120 },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
       <h1>Espacio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="sede-select">Seleccionar Sede: </label>
            <select
              id="sede-select"
              value={selectedSede || ""}
              onChange={handleSedeChange}
            >
              <option value="">Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="bloque-select">Seleccionar Bloque: </label>
            <select
              id="bloque-select"
              value={selectedBloque || ""}
              onChange={handleBloqueChange}
            >
              <option value="">Seleccione un bloque</option>
              {bloques.map((bloque) => (
                <option key={bloque.id} value={bloque.id}>
                  {bloque.nombre}
                </option>
              ))}
            </select>
          </div>

          <FormEspacio
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={fetchEspacios} // Pasar la función para recargar espacios
            sedes={sedes}
          />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={espacio}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={(params) => setSelectedRow(params.row)}
            />
          </div>
        </>
      )}
    </div>
  );
}
