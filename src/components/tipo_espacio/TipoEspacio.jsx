import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEspacio from "./FormTipoEspacio";
import GridTipoEspacio from "./GridTipoEspacio";
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoEspacio(props) {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1,
    empresa: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [tespacios, setTespacios] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const reloadData = React.useCallback(() => {
    setLoading(true);
    console.log("Iniciando carga de datos desde el backend...");
    axios
      .get(`${SiteProps.urlbasev1}/tipo_espacio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("Respuesta del backend:", response.data);
        const tespaciosData = Array.isArray(response.data)
          ? response.data.map((item) => ({
              id: item.id, // Asegúrate de que el campo 'id' esté presente
              nombre: item.nombre,
              descripcion: item.descripcion,
              estado: item.estado,
            }))
          : [];
        console.log("Datos procesados para la tabla:", tespaciosData);
        setTespacios(tespaciosData);
        setError(null);
      })
      .catch((error) => {
        console.error("Error al cargar las tespacios!", error);
        const errorMessage = error.response?.data?.message || "Error desconocido.";
        setError(errorMessage);
        setMessage({
          open: true,
          severity: "error",
          text: errorMessage,
        });
      })
      .finally(() => {
        console.log("Carga de datos finalizada.");
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  const handleMessageClose = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Espacio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <FormTipoEspacio
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={reloadData}
          />
          <GridTipoEspacio
            setSelectedRow={setSelectedRow}
            reloadData={reloadData}
          />
        </>
      )}
    </div>
  );
}
