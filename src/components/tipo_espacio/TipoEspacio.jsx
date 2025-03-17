
/**
 * TipoEspacio componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEspacio from "./FormTipoEspacio";
import GridTipoEspacio from "./GridTipoEspacio";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente TipoEspacio.
 * @module TipoEspacio.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function TipoEspacio() {
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const reloadData = React.useCallback(() => {
    setLoading(true);
    axios
      .get(`${SiteProps.urlbasev1}/tipo_espacio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data.map((item) => ({
              id: item.id,
              nombre: item.nombre,
              descripcion: item.descripcion,
              estado: item.estado,
            }))
          : [];
        console.log("Datos cargados:", data);
        // Aquí se puede guardar si luego se quiere usar
        setError(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Error desconocido.";
        setError(errorMessage);
        setMessage({
          open: true,
          severity: "error",
          text: errorMessage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

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

