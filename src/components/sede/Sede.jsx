import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";
import { SiteProps } from "../dashboard/SiteProps";

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

  // Función para cargar las sedes desde el backend
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

  React.useEffect(() => {
    reloadData(); // Cargar los datos al montar el componente
  }, []);

  // Manejador de mensaje cerrado
  const handleMessageClose = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
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
