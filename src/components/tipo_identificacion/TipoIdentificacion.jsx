import * as React from "react";
// import axios from "../axiosConfig";
import axios from "axios"; 
import MessageSnackBar from "../MessageSnackBar";
import FormTipoIdentificacion from "./FormTipoIdentificacion";
import GridTipoIdentificacion from "./GridTipoIdentificacion";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente TipoIdentificacion gestiona el módulo de tiposIdentificacion, incluyendo el formulario
 * y la tabla de datos para crear, actualizar, y eliminar tiposIdentificacion.
 * 
 * @componente
 * @returns {JSX.Element} El módulo de gestión de tiposIdentificacion.
 */
export default function TipoIdentificacion() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [tiposIdentificacion, setTiposIdentificacion] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Función para recargar los datos
  const reloadData = () => {
    setLoading(true);
    axios
      .get(`${SiteProps.urlbasev1}/tipo_identificacion`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const sedeData = response.data.map((item) => ({
          ...item,
          geolocalizacion: item.geolocalizacion || { type: "Point", coordinates: [0, 0] },
        }));
        setTiposIdentificacion(sedeData);
        setError(null); // Limpiar errores si se cargaron datos correctamente
      })
      .catch((error) => {
        console.error("Error al cargar las tiposIdentificacion!", error);
        setError("No se pudieron cargar las tiposIdentificacion. Intente nuevamente.");
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar las tiposIdentificacion. Intente nuevamente.",
        });
      })
      .finally(() => {
        setLoading(false); // Finalizar el estado de carga
      });
  };

  React.useEffect(() => {
    reloadData(); // Cargar los datos al montar el componente
  }, []);
  return (
    <div style={{ height: "100%", width: "100%" }}>
       <h1>TipoIdentificacion</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoIdentificacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormProductocategoria
        tiposIdentificacion={tiposIdentificacion}

      />
      <GridTipoIdentificacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tiposIdentificacion={tiposIdentificacion}
      />
    </div>
  );
}
