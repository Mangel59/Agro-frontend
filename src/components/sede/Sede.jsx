import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente principal para gestionar las sedes.
 * 
 * Este componente muestra un formulario para crear o editar sedes, 
 * y una grilla con la lista de sedes registradas. 
 * También maneja la carga de datos desde el backend, 
 * el estado de errores y los mensajes tipo snackbar.
 * 
 * @component
 * @param {Object} props - Props del componente (actualmente no utilizadas directamente).
 * @returns {JSX.Element} Componente de administración de sedes.
 */
/**
 * Componente Sede.
 * @module Sede.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Sede(props) {
  const row = {
    id: 0,
    grupo: "",
    tipoSede: "",
    nombre: "",
    municipioId: "",
    geolocalizacion: "",
    cooordenadas: "",
    area: 0,
    comuna: "",
    descripcion: "",
    estado: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(row); // Fila seleccionada para editar
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [sedes, setSedes] = React.useState([]); // Lista de sedes
  const [loading, setLoading] = React.useState(true); // Estado de carga
  const [error, setError] = React.useState(null); // Manejo de errores

  /**
   * Carga las sedes desde el backend y actualiza el estado local.
   */
  const reloadData = () => {
    setLoading(true);
    axios
      .get(`${SiteProps.urlbasev1}/sede`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const sedeData = response.data.map((item) => ({
          ...item,
          geolocalizacion: item.geolocalizacion || { type: "Point", coordinates: [0, 0] },
        }));
        setSedes(sedeData);
        setError(null); // Limpiar errores si se cargaron datos correctamente
      })
      .catch((error) => {
        console.error("Error al cargar las sedes!", error);
        setError("No se pudieron cargar las sedes. Intente nuevamente.");
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar las sedes. Intente nuevamente.",
        });
      })
      .finally(() => {
        setLoading(false); // Finalizar el estado de carga
      });
  };

  // Cargar los datos al montar el componente
  React.useEffect(() => {
    reloadData();
  }, []);

  /**
   * Manejador para cerrar el snackbar de mensajes.
   */
  const handleMessageClose = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Sede</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <FormSede
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={reloadData}
          />
          <GridSede
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            sedes={sedes}
            reloadData={reloadData}
          />
        </>
      )}
    </div>
  );
}
