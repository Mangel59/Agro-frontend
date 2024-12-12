import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import MessageSnackBar from "../MessageSnackBar";
import FormBloque from "./FormBloque";

export default function Bloque() {
  const [sedes, setSedes] = useState([]); // Lista de sedes
  const [selectedSede, setSelectedSede] = useState(null); // Sede seleccionada
  const [bloques, setBloques] = useState([]); // Lista de bloques
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [selectedRow, setSelectedRow] = useState(null); // Fila seleccionada para editar

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
        setBloques(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los bloques:", err);
        setError("No se pudieron cargar los bloques.");
        setBloques([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBloques();
  }, [selectedSede]);

  const handleSedeChange = (event) => {
    setSelectedSede(event.target.value); // Actualizar la sede seleccionada
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "sede", headerName: "Sede", width: 180 },
    { field: "tipoBloque", headerName: "Tipo de Bloque", width: 180 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 300 },
    { field: "numeroPisos", headerName: "Número de Pisos", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "estado", headerName: "Estado", width: 120 },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
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

          <FormBloque
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={() => setSelectedSede(selectedSede)}
          />
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={bloques}
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
